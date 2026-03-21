# == Schema Information
#
# Table name: master_ticket_statuses
#
#  id         :bigint           not null, primary key
#  is_done    :boolean          default(FALSE)
#  sort_order :integer          default(0)
#  title      :string           default("")
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'test_helper'

class MasterTicketStatusTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
