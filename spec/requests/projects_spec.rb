require 'rails_helper'

RSpec.describe 'Projects', type: :request do
  let(:user)    { create(:user) }
  let(:group)   { create(:group).tap { |g| g.users << user } }
  let(:project) { create(:project).tap { |p| p.groups << group } }

  describe 'GET /projects' do
    context 'ログイン済み' do
      before { sign_in user }

      it '200 を返す' do
        get projects_path
        expect(response).to have_http_status(:ok)
      end
    end

    context '未ログイン' do
      it 'ログインページにリダイレクトする' do
        get projects_path
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end

  describe 'GET /projects/:id' do
    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it '200 を返す' do
        get project_path(project)
        expect(response).to have_http_status(:ok)
      end
    end

    context 'ログイン済み・他人のプロジェクト（JSON）' do
      let(:other_project) { create(:project) }
      before { sign_in user }

      it '403 を返す' do
        get project_path(other_project), as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end

    context '未ログイン' do
      it 'ログインページにリダイレクトする' do
        get project_path(project)
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end

  describe 'POST /projects' do
    let(:valid_params) do
      { project: { title: 'New Project', ticket_prefix: 'NP', body: '' } }
    end

    context 'ログイン済み' do
      before { sign_in user }

      it 'プロジェクトが作成されリダイレクトする' do
        expect {
          post projects_path, params: valid_params
        }.to change(Project, :count).by(1)
        expect(response).to redirect_to(projects_path)
      end
    end

    context '未ログイン' do
      it 'ログインページにリダイレクトする' do
        post projects_path, params: valid_params
        expect(response).to redirect_to(new_user_session_path)
      end
    end
  end

  describe 'PATCH /projects/:id' do
    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it 'プロジェクトを更新できる' do
        patch project_path(project), params: { project: { title: 'Updated' } }
        expect(project.reload.title).to eq('Updated')
      end
    end

    context 'ログイン済み・他人のプロジェクト（JSON）' do
      let(:other_project) { create(:project) }
      before { sign_in user }

      it '403 を返す' do
        patch project_path(other_project),
              params: { project: { title: 'Hacked' } }, as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
