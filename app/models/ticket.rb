# == Schema Information
#
# Table name: tickets
#
#  id                         :integer          not null, primary key
#  project_id                 :integer
#  sprint_id                  :integer
#  ticket_id                  :integer
#  project_ticket_category_id :integer
#  project_ticket_status_id   :integer
#  assignee_id                :integer
#  type                       :string
#  ticket_number              :integer
#  title                      :string
#  body                       :text
#  point                      :float
#  is_done                    :boolean          default(FALSE)
#  sort_order                 :integer
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#

class Ticket < ApplicationRecord
  include RankedModel
  has_paper_trail

  belongs_to :project
  belongs_to :assignee, optional: true, class_name: 'User'
  belongs_to :project_ticket_status
  acts_as_sequenced scope: :project_id, column: :ticket_number
  has_many :comments

  before_validation :update_is_done, if: :will_save_change_to_project_ticket_status_id?

  attribute :ticket_number_with_ticket_prefix

  def ticket_number_with_ticket_prefix
    "#{project.ticket_prefix}-#{ticket_number}"
  end

  def created_user_by
    whodunnit = versions.reorder(:created_at).find_by(event: 'create').whodunnit
    whodunnit ? User.find(whodunnit) : nil
  end

  def last_updated_user_by
    whodunnit = versions.reorder(created_at: :desc).find_by(event: 'update')&.whodunnit
    whodunnit ? User.find(whodunnit) : nil
  end

  def update_is_done
    self.is_done = project_ticket_status.is_done
  end
end
