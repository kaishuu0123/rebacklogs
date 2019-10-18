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

class Story < Ticket
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
