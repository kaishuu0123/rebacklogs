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

class Ticket < ApplicationRecord
  include RankedModel
  has_paper_trail

  belongs_to :project
  belongs_to :assignee, optional: true, class_name: 'User'
  belongs_to :project_ticket_status
  acts_as_sequenced scope: :project_id, column: :ticket_number
  has_many :comments
  has_many :tag_tickets, inverse_of: :ticket, dependent: :destroy
  has_many :tags, through: :tag_tickets

  before_validation :update_is_done, if: :will_save_change_to_project_ticket_status_id?

  attribute :ticket_number_with_ticket_prefix

  def ticket_number_with_ticket_prefix
    "#{project.ticket_prefix}-#{ticket_number}"
  end

  def created_user_by
    whodunnit = versions.reorder(:created_at).find_by(event: 'create').whodunnit
    whodunnit ? User.find_by_id(id: whodunnit) : nil
  end

  def last_updated_user_by
    whodunnit = versions.reorder(created_at: :desc).find_by(event: 'update')&.whodunnit
    whodunnit ? User.find_by_id(id: whodunnit) : nil
  end

  def update_is_done
    self.is_done = project_ticket_status.is_done
  end
end
