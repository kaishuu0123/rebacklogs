require 'rails_helper'

RSpec.describe ProjectChannel, type: :channel do
  let(:user)    { create(:user) }
  let(:admin)   { create(:admin_user) }
  let(:group)   { create(:group).tap { |g| g.users << user } }
  let(:project) { create(:project, :with_group, group: group) }

  describe '#subscribed' do
    context '未ログイン' do
      it '接続を拒否する' do
        stub_connection current_user: nil
        subscribe(project_id: project.id)
        expect(subscription).not_to be_confirmed
      end
    end

    context 'ログイン済み・グループ所属あり' do
      before { stub_connection current_user: user }

      it 'プライベートプロジェクトに購読できる' do
        subscribe(project_id: project.id)
        expect(subscription).to be_confirmed
        expect(subscription).to have_stream_from("project_#{project.id}")
      end

      it '存在しないプロジェクトは拒否される' do
        subscribe(project_id: 0)
        expect(subscription).not_to be_confirmed
      end

      it '所属していないプロジェクトは拒否される' do
        other_project = create(:project, :with_group)
        subscribe(project_id: other_project.id)
        expect(subscription).not_to be_confirmed
      end
    end

    context 'ログイン済み・パブリックプロジェクト' do
      let(:public_project) { create(:project, is_public: true) }
      before { stub_connection current_user: user }

      it 'グループ所属なしでも購読できる' do
        subscribe(project_id: public_project.id)
        expect(subscription).to be_confirmed
        expect(subscription).to have_stream_from("project_#{public_project.id}")
      end
    end

    context 'admin ユーザー・グループ未所属' do
      before { stub_connection current_user: admin }

      it 'プライベートプロジェクトでも購読できる' do
        subscribe(project_id: project.id)
        expect(subscription).to be_confirmed
        expect(subscription).to have_stream_from("project_#{project.id}")
      end
    end
  end
end
