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

require 'test_helper'

class ProjectTicketStatusTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
