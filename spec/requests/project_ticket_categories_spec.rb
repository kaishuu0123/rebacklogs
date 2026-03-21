require 'rails_helper'

RSpec.describe 'ProjectTicketCategories', type: :request do
  let(:user)     { create(:user) }
  let(:group)    { create(:group).tap { |g| g.users << user } }
  let(:project)  { create(:project).tap { |p| p.groups << group } }
  let(:category) { create(:project_ticket_category, project: project) }

  describe 'GET /projects/:project_id/project_ticket_categories' do
    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it '200 を返す' do
        get project_project_ticket_categories_path(project), as: :json
        expect(response).to have_http_status(:ok)
      end
    end

    context '未ログイン' do
      it '401 を返す' do
        get project_project_ticket_categories_path(project), as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /projects/:project_id/project_ticket_categories' do
    let(:valid_params) { { title: 'Frontend', color: '#FF5733', project_id: project.id } }

    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it 'カテゴリが作成される' do
        expect {
          post project_project_ticket_categories_path(project), params: valid_params, as: :json
        }.to change(ProjectTicketCategory, :count).by(1)
        expect(response).to have_http_status(:created)
      end
    end

    context 'ログイン済み・他人のプロジェクト' do
      let(:other_project) { create(:project) }
      before { sign_in user }

      it '403 を返す' do
        post project_project_ticket_categories_path(other_project),
             params: valid_params.merge(project_id: other_project.id), as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'PATCH /projects/:project_id/project_ticket_categories/:id' do
    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it 'タイトルを更新できる' do
        patch project_project_ticket_category_path(project, category),
              params: { title: 'Backend' }, as: :json
        expect(category.reload.title).to eq('Backend')
      end

      it '色を更新できる' do
        patch project_project_ticket_category_path(project, category),
              params: { color: '#0000FF' }, as: :json
        expect(category.reload.color).to eq('#0000FF')
      end
    end

    context 'ログイン済み・他人のプロジェクトのカテゴリ' do
      let(:other_project)  { create(:project) }
      let(:other_category) { create(:project_ticket_category, project: other_project) }
      before { sign_in user }

      it '403 を返す' do
        patch project_project_ticket_category_path(other_project, other_category),
              params: { title: 'Hacked' }, as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'DELETE /projects/:project_id/project_ticket_categories/:id' do
    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it 'カテゴリを削除できる' do
        category
        expect {
          delete project_project_ticket_category_path(project, category), as: :json
        }.to change(ProjectTicketCategory, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end
  end
end
