# == Schema Information
#
# Table name: group_users
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  group_id   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'test_helper'

class GroupUserTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
