require 'rails_helper'

RSpec.describe 'Sprints', type: :request do
  let(:user)    { create(:user) }
  let(:group)   { create(:group).tap { |g| g.users << user } }
  let(:project) { create(:project).tap { |p| p.groups << group } }
  let(:sprint)  { create(:sprint, project: project) }

  describe 'GET /projects/:project_id/sprints (JSON)' do
    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it '200 と JSON を返す' do
        get project_sprints_path(project), as: :json
        expect(response).to have_http_status(:ok)
        expect(response.content_type).to include('application/json')
      end
    end

    context '未ログイン' do
      it '401 を返す' do
        get project_sprints_path(project), as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /projects/:project_id/sprints' do
    let(:valid_params) { { title: 'Sprint 1', project_id: project.id } }

    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it 'スプリントが作成される' do
        expect {
          post project_sprints_path(project), params: valid_params, as: :json
        }.to change(Sprint, :count).by(1)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'ログイン済み・他人のプロジェクト' do
      let(:other_project) { create(:project) }
      before { sign_in user }

      it '403 を返す' do
        post project_sprints_path(other_project),
             params: valid_params.merge(project_id: other_project.id), as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'PATCH /projects/:project_id/sprints/:id' do
    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it 'スプリントを更新できる' do
        patch project_sprint_path(project, sprint),
              params: { title: 'Updated Sprint' }, as: :json
        expect(sprint.reload.title).to eq('Updated Sprint')
      end

      it 'closed: true でスプリントをクローズできる' do
        patch project_sprint_path(project, sprint),
              params: { closed: true }, as: :json
        expect(sprint.reload.closed).to be true
      end
    end
  end
end
