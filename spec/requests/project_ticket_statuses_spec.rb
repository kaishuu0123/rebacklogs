require 'rails_helper'

RSpec.describe 'ProjectTicketStatuses', type: :request do
  let(:user)    { create(:user) }
  let(:group)   { create(:group).tap { |g| g.users << user } }
  let(:project) { create(:project).tap { |p| p.groups << group } }
  let(:status)  { create(:project_ticket_status, project: project) }

  describe 'GET /projects/:project_id/project_ticket_statuses' do
    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it '200 を返す' do
        get project_project_ticket_statuses_path(project), as: :json
        expect(response).to have_http_status(:ok)
      end
    end

    context '未ログイン' do
      it '401 を返す' do
        get project_project_ticket_statuses_path(project), as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /projects/:project_id/project_ticket_statuses' do
    let(:valid_params) { { title: 'In Review', project_id: project.id } }

    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it 'ステータスが作成される' do
        expect {
          post project_project_ticket_statuses_path(project), params: valid_params, as: :json
        }.to change(ProjectTicketStatus, :count).by(1)
        expect(response).to have_http_status(:created)
      end
    end

    context 'ログイン済み・他人のプロジェクト' do
      let(:other_project) { create(:project) }
      before { sign_in user }

      it '403 を返す' do
        post project_project_ticket_statuses_path(other_project),
             params: valid_params.merge(project_id: other_project.id), as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'PATCH /projects/:project_id/project_ticket_statuses/:id' do
    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it 'タイトルを更新できる' do
        patch project_project_ticket_status_path(project, status),
              params: { title: 'Done' }, as: :json
        expect(status.reload.title).to eq('Done')
      end
    end

    context 'ログイン済み・他人のプロジェクトのステータス' do
      let(:other_project) { create(:project) }
      let(:other_status)  { create(:project_ticket_status, project: other_project) }
      before { sign_in user }

      it '403 を返す' do
        patch project_project_ticket_status_path(other_project, other_status),
              params: { title: 'Hacked' }, as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'DELETE /projects/:project_id/project_ticket_statuses/:id' do
    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it 'ステータスを削除できる' do
        status
        expect {
          delete project_project_ticket_status_path(project, status), as: :json
        }.to change(ProjectTicketStatus, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end
  end
end
