require 'rails_helper'

RSpec.describe 'Stories', type: :request do
  let(:user)    { create(:user) }
  let(:group)   { create(:group).tap { |g| g.users << user } }
  let(:project) { create(:project).tap { |p| p.groups << group } }
  let(:status)  { create(:project_ticket_status, project: project) }
  let(:story)   { create(:story, project: project, project_ticket_status: status) }

  describe 'GET /projects/:project_id/stories (JSON)' do
    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it '成功レスポンスを返す' do
        get project_stories_path(project), as: :json
        expect(response).to have_http_status(:success)
      end
    end

    context '未ログイン' do
      it '401 を返す' do
        get project_stories_path(project), as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /projects/:project_id/stories' do
    let(:valid_params) do
      { title: 'New Story', project_id: project.id, project_ticket_status_id: status.id }
    end

    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it 'ストーリーが作成される' do
        expect {
          post project_stories_path(project), params: valid_params, as: :json
        }.to change(Story, :count).by(1)
        expect(response).to have_http_status(:ok)
      end

      it 'ticket_number が採番される' do
        post project_stories_path(project), params: valid_params, as: :json
        body = JSON.parse(response.body)
        expect(body['ticket_number']).to be_present
      end
    end

    context 'ログイン済み・他人のプロジェクト' do
      let(:other_project) { create(:project) }
      before { sign_in user }

      it '403 を返す' do
        post project_stories_path(other_project),
             params: valid_params.merge(project_id: other_project.id), as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'PATCH /projects/:project_id/stories/:id' do
    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it 'タイトルを更新できる' do
        patch project_story_path(project, story),
              params: { title: 'Updated Story' }, as: :json
        expect(story.reload.title).to eq('Updated Story')
      end
    end

    context 'ログイン済み・他人のプロジェクトの Story' do
      let(:other_project) { create(:project) }
      let(:other_status)  { create(:project_ticket_status, project: other_project) }
      let(:other_story)   { create(:story, project: other_project, project_ticket_status: other_status) }
      before { sign_in user }

      it '403 を返す' do
        patch project_story_path(other_project, other_story),
              params: { title: 'Hacked' }, as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'DELETE /projects/:project_id/stories/:id' do
    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it 'ストーリーを削除できる' do
        story
        expect {
          delete project_story_path(project, story), as: :json
        }.to change(Story, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end
  end
end
