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

class Story < Ticket
  include Broadcastable

  belongs_to :sprint, optional: true
  belongs_to :project_ticket_category, optional: true

  has_many :tasks, -> { order(sort_order: :asc) }, foreign_key: :ticket_id

  ranks :row_order, column: :sort_order, with_same: [:project_id, :sprint_id]

  after_touch :update_is_done

  def update_is_done
    is_done = project_ticket_status.is_done || (tasks.all?(&:is_done) && tasks.count > 0)
    update_attribute(:is_done, is_done)
  end
end
