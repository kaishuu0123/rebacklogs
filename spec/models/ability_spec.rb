require 'rails_helper'
require 'cancan/matchers'

RSpec.describe Ability, type: :model do
  let(:user)    { create(:user) }
  let(:group)   { create(:group).tap { |g| g.users << user } }
  let(:project) { create(:project).tap { |p| p.groups << group } }

  # group → project の関連を Ability 生成前に確立する
  subject(:ability) { project; Ability.new(user) }

  describe 'developer ロール（デフォルト）' do
    it '自身が属するプロジェクトを管理できる' do
      expect(ability).to be_able_to(:manage, project)
    end

    it '自身が属さないプロジェクトは管理できない' do
      other_project = create(:project)
      expect(ability).not_to be_able_to(:manage, other_project)
    end

    it '自身が属するプロジェクトのスプリントを管理できる' do
      sprint = create(:sprint, project: project)
      expect(ability).to be_able_to(:manage, sprint)
    end

    it '他プロジェクトのスプリントは管理できない' do
      other_sprint = create(:sprint, project: create(:project))
      expect(ability).not_to be_able_to(:manage, other_sprint)
    end

    it '自身が属するプロジェクトの Story を管理できる' do
      status = create(:project_ticket_status, project: project)
      story  = create(:story, project: project, project_ticket_status: status)
      expect(ability).to be_able_to(:manage, story)
    end

    it '自身のユーザー情報を管理できる' do
      expect(ability).to be_able_to(:manage, user)
    end

    it '他のユーザー情報は管理できない' do
      other_user = create(:user)
      expect(ability).not_to be_able_to(:manage, other_user)
    end

    it '自身が属するグループを管理できる' do
      expect(ability).to be_able_to(:manage, group)
    end

    it 'グループの読み取りはできる' do
      other_group = create(:group)
      expect(ability).to be_able_to(:read, other_group)
    end
  end

  describe 'admin ロール' do
    let(:user) { create(:admin_user) }

    it '全てを管理できる' do
      expect(ability).to be_able_to(:manage, :all)
    end
  end
end
