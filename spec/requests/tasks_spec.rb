require 'rails_helper'

RSpec.describe 'Tasks', type: :request do
  let(:user)    { create(:user) }
  let(:group)   { create(:group).tap { |g| g.users << user } }
  let(:project) { create(:project).tap { |p| p.groups << group } }
  let(:status)  { create(:project_ticket_status, project: project) }
  let(:story)   { create(:story, project: project, project_ticket_status: status) }
  let(:task)    { create(:task, project: project, project_ticket_status: status, story: story) }

  describe 'POST /projects/:project_id/tasks' do
    let(:valid_params) do
      { title: 'New Task', project_id: project.id, story_id: story.id, project_ticket_status_id: status.id }
    end

    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it 'タスクが作成される' do
        expect {
          post project_tasks_path(project), params: valid_params, as: :json
        }.to change(Task, :count).by(1)
        expect(response).to have_http_status(:ok)
      end

      it 'ticket_number が採番される' do
        post project_tasks_path(project), params: valid_params, as: :json
        body = JSON.parse(response.body)
        expect(body['ticket_number']).to be_present
      end
    end

    context '未ログイン' do
      it '401 を返す' do
        post project_tasks_path(project), params: valid_params, as: :json
        expect(response).to have_http_status(:unauthorized)
      end
    end

    context 'ログイン済み・他人のプロジェクト' do
      let(:other_project) { create(:project) }
      let(:other_status)  { create(:project_ticket_status, project: other_project) }
      let(:other_story)   { create(:story, project: other_project, project_ticket_status: other_status) }
      before { sign_in user }

      it '403 を返す' do
        post project_tasks_path(other_project),
             params: valid_params.merge(project_id: other_project.id, story_id: other_story.id), as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'PATCH /projects/:project_id/tasks/:id' do
    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it 'タイトルを更新できる' do
        patch project_task_path(project, task),
              params: { title: 'Updated Task' }, as: :json
        expect(task.reload.title).to eq('Updated Task')
      end

      it 'ステータスを更新できる（Kanban D&D）' do
        new_status = create(:project_ticket_status, project: project)
        patch project_task_path(project, task),
              params: { project_ticket_status_id: new_status.id }, as: :json
        expect(task.reload.project_ticket_status).to eq(new_status)
      end


    end

    context 'ログイン済み・他人のプロジェクトの Task' do
      let(:other_project) { create(:project) }
      let(:other_status)  { create(:project_ticket_status, project: other_project) }
      let(:other_story)   { create(:story, project: other_project, project_ticket_status: other_status) }
      let(:other_task)    { create(:task, project: other_project, project_ticket_status: other_status, story: other_story) }
      before { sign_in user }

      it '403 を返す' do
        patch project_task_path(other_project, other_task),
              params: { title: 'Hacked' }, as: :json
        expect(response).to have_http_status(:forbidden)
      end
    end
  end

  describe 'DELETE /projects/:project_id/tasks/:id' do
    context 'ログイン済み・自身のプロジェクト' do
      before { sign_in user }

      it 'タスクを削除できる' do
        task
        expect {
          delete project_task_path(project, task), as: :json
        }.to change(Task, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
    end
  end
end
