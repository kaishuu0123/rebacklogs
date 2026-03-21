# == Schema Information
#
# Table name: tickets
#
#  id                         :bigint           not null, primary key
#  body                       :text
#  is_done                    :boolean          default(FALSE)
#  point                      :float
#  sort_order                 :integer
#  ticket_number              :integer
#  title                      :string
#  type                       :string
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#  assignee_id                :bigint
#  project_id                 :bigint
#  project_ticket_category_id :bigint
#  project_ticket_status_id   :bigint
#  sprint_id                  :bigint
#  ticket_id                  :bigint
#
# Indexes
#
#  index_tickets_on_assignee_id                 (assignee_id)
#  index_tickets_on_project_id                  (project_id)
#  index_tickets_on_project_ticket_category_id  (project_ticket_category_id)
#  index_tickets_on_project_ticket_status_id    (project_ticket_status_id)
#  index_tickets_on_sprint_id                   (sprint_id)
#  index_tickets_on_ticket_id                   (ticket_id)
#
# Foreign Keys
#
#  fk_rails_...  (assignee_id => users.id)
#  fk_rails_...  (project_id => projects.id)
#  fk_rails_...  (project_ticket_category_id => project_ticket_categories.id)
#  fk_rails_...  (project_ticket_status_id => project_ticket_statuses.id)
#  fk_rails_...  (sprint_id => sprints.id)
#  fk_rails_...  (ticket_id => tickets.id)
#
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
