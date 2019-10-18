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

class Task < Ticket
  belongs_to :story, foreign_key: :ticket_id, touch: true
  belongs_to :project_ticket_status
  alias_attribute :story_id, :ticket_id

  ranks :row_order, column: :sort_order, with_same: [:ticket_id, :project_ticket_status_id]
end
