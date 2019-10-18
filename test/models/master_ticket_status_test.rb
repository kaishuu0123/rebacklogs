# == Schema Information
#
# Table name: master_ticket_statuses
#
#  id         :integer          not null, primary key
#  title      :string           default("")
#  sort_order :integer          default(0)
#  is_done    :boolean          default(FALSE)
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'test_helper'

class MasterTicketStatusTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
