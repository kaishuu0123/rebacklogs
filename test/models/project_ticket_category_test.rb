# == Schema Information
#
# Table name: project_ticket_categories
#
#  id         :bigint           not null, primary key
#  color      :string
#  sort_order :integer
#  title      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  project_id :bigint
#
# Indexes
#
#  index_project_ticket_categories_on_project_id  (project_id)
#

require 'test_helper'

class ProjectTicketCategoryTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
