# == Schema Information
#
# Table name: group_projects
#
#  id         :integer          not null, primary key
#  group_id   :integer          not null
#  project_id :integer          not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

require 'test_helper'

class GroupProjectTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
