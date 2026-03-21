require 'rails_helper'

RSpec.describe Task, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:project) }
    it { is_expected.to belong_to(:story) }
    it { is_expected.to belong_to(:project_ticket_status) }
    it { is_expected.to have_many(:comments) }
  end

  describe 'story_id エイリアス' do
    it 'ticket_id を story_id として読み書きできる' do
      project = create(:project)
      status  = create(:project_ticket_status, project: project)
      story   = create(:story, project: project, project_ticket_status: status)
      task    = create(:task, project: project, project_ticket_status: status, story: story)
      expect(task.story_id).to eq(story.id)
      expect(task.ticket_id).to eq(story.id)
    end
  end

  describe 'is_done のデフォルト値' do
    it '作成直後は false' do
      project = create(:project)
      status  = create(:project_ticket_status, project: project)
      story   = create(:story, project: project, project_ticket_status: status)
      task    = create(:task, project: project, project_ticket_status: status, story: story)
      expect(task.is_done).to be false
    end
  end
end
