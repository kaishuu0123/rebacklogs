require 'rails_helper'

RSpec.describe Story, type: :model do
  describe 'associations' do
    it { is_expected.to belong_to(:project) }
    it { is_expected.to belong_to(:sprint).optional }
    it { is_expected.to belong_to(:project_ticket_category).optional }
    it { is_expected.to have_many(:tasks) }
    it { is_expected.to have_many(:comments) }
    it { is_expected.to have_many(:tags).through(:tag_tickets) }
  end

  describe 'ticket_number_with_ticket_prefix' do
    it 'PREFIX-番号 形式を返す' do
      project = create(:project, ticket_prefix: 'TST')
      status  = create(:project_ticket_status, project: project)
      story   = create(:story, project: project, project_ticket_status: status)
      expect(story.ticket_number_with_ticket_prefix).to match(/\ATST-\d+\z/)
    end
  end

  describe 'ticket_number の採番' do
    it '同じプロジェクト内で連番になる' do
      project = create(:project)
      status  = create(:project_ticket_status, project: project)
      story1  = create(:story, project: project, project_ticket_status: status)
      story2  = create(:story, project: project, project_ticket_status: status)
      expect(story2.ticket_number).to eq(story1.ticket_number + 1)
    end

    it '別プロジェクトでは独立した連番になる' do
      project_a = create(:project)
      project_b = create(:project)
      status_a  = create(:project_ticket_status, project: project_a)
      status_b  = create(:project_ticket_status, project: project_b)
      story_a   = create(:story, project: project_a, project_ticket_status: status_a)
      story_b   = create(:story, project: project_b, project_ticket_status: status_b)
      expect(story_a.ticket_number).to eq(story_b.ticket_number)
    end
  end
end
