# == Schema Information
#
# Table name: project_ticket_statuses
#
#  id         :bigint           not null, primary key
#  is_done    :boolean          default(FALSE)
#  sort_order :integer
#  title      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  project_id :bigint
#
# Indexes
#
#  index_project_ticket_statuses_on_project_id  (project_id)
#
# Foreign Keys
#
#  fk_rails_...  (project_id => projects.id)
#

class ProjectTicketStatus < ApplicationRecord
  belongs_to :project

  has_many :tickets, dependent: :nullify
end
