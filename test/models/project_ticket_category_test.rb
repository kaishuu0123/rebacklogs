# == Schema Information
#
# Table name: project_ticket_categories
#
#  id         :integer          not null, primary key
#  project_id :integer
#  title      :string
#  sort_order :integer
#  color      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'test_helper'

class ProjectTicketCategoryTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
