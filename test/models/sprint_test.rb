# == Schema Information
#
# Table name: sprints
#
#  id             :integer          not null, primary key
#  project_id     :integer
#  title          :string
#  start_datetime :datetime
#  end_datetime   :datetime
#  closed         :boolean          default(FALSE)
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

require 'test_helper'

class SprintTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
