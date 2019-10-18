# == Schema Information
#
# Table name: project_ticket_statuses
#
#  id         :integer          not null, primary key
#  project_id :integer
#  title      :string
#  sort_order :integer
#  is_done    :boolean          default(FALSE)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class ProjectTicketStatus < ApplicationRecord
  belongs_to :project

  has_many :tickets, dependent: :nullify
end
