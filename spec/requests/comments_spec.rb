require 'rails_helper'

RSpec.describe 'Comments', type: :request do
  let(:user)    { create(:user) }
  let(:group)   { create(:group).tap { |g| g.users << user } }
  let(:project) { create(:project).tap { |p| p.groups << group } }
  let(:status)  { create(:project_ticket_status, project: project) }
  let(:story)   { create(:story, project: project, project_ticket_status: status) }
  let(:comment) { create(:comment, ticket: story, user: user) }

  describe 'POST /projects/:project_id/stories/:story_id/comments' do
    let(:valid_params) { { ticket_id: story.id, body: 'Great story!' } }

    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it 'コメントが作成される' do
        expect {
          post project_story_comments_path(project, story), params: valid_params, as: :json
        }.to change(Comment, :count).by(1)
        expect(response).to have_http_status(:created)
      end
    end

    context '未ログイン' do
      it '401 を返す' do
        post project_story_comments_path(project, story), params: valid_params, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'ログイン済み・他人のプロジェクト' do
      let(:other_project) { create(:project) }
      let(:other_status)  { create(:project_ticket_status, project: other_project) }
      let(:other_story)   { create(:story, project: other_project, project_ticket_status: other_status) }
      before { sign_in user }

      it '403 を返す' do
        post project_story_comments_path(other_project, other_story),
             params: { ticket_id: other_story.id, body: 'Hacked!' }, as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'PATCH /projects/:project_id/stories/:story_id/comments/:id' do
    context 'ログイン済み・自身のコメント' do
      before { sign_in user }

      it 'コメントを更新できる' do
        patch project_story_comment_path(project, story, comment),
              params: { body: 'Updated comment' }, as: :json
        expect(comment.reload.body).to eq('Updated comment')
      end
    end

    context 'ログイン済み・同プロジェクトの他人のコメント（manage 権限あり）' do
      let(:other_user)    { create(:user) }
      let(:other_comment) { create(:comment, ticket: story, user: other_user) }
      before { sign_in user }

      it '更新できる（プロジェクトメンバーは全コメントを manage できる）' do
        patch project_story_comment_path(project, story, other_comment),
              params: { body: 'Updated by member' }, as: :json
        expect(response).to have_http_status(:ok)
      end
    end

    context 'ログイン済み・他人のプロジェクトのコメント' do
      let(:other_project) { create(:project) }
      let(:other_status)  { create(:project_ticket_status, project: other_project) }
      let(:other_story)   { create(:story, project: other_project, project_ticket_status: other_status) }
      let(:other_comment) { create(:comment, ticket: other_story, user: user) }
      before { sign_in user }

      it '403 を返す' do
        patch project_story_comment_path(other_project, other_story, other_comment),
              params: { body: 'Hacked!' }, as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'DELETE /projects/:project_id/stories/:story_id/comments/:id' do
    context 'ログイン済み・自身のコメント' do
      before { sign_in user }

      it 'コメントを削除できる' do
        comment
        expect {
          delete project_story_comment_path(project, story, comment), as: :json
        }.to change(Comment, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end

    context 'ログイン済み・他人のプロジェクトのコメント' do
      let(:other_project) { create(:project) }
      let(:other_status)  { create(:project_ticket_status, project: other_project) }
      let(:other_story)   { create(:story, project: other_project, project_ticket_status: other_status) }
      let(:other_comment) { create(:comment, ticket: other_story, user: user) }
      before { sign_in user }

      it '403 を返す' do
        delete project_story_comment_path(other_project, other_story, other_comment), as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end
  end
end
