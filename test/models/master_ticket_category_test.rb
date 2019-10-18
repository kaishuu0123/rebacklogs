# == Schema Information
#
# Table name: master_ticket_categories
#
#  id         :integer          not null, primary key
#  title      :string
#  sort_order :integer
#  color      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'test_helper'

class MasterTicketCategoryTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
