# == Schema Information
#
# Table name: tickets
#
#  id                         :integer          not null, primary key
#  project_id                 :integer
#  sprint_id                  :integer
#  ticket_id                  :integer
#  project_ticket_category_id :integer
#  project_ticket_status_id   :integer
#  assignee_id                :integer
#  type                       :string
#  ticket_number              :integer
#  title                      :string
#  body                       :text
#  point                      :float
#  is_done                    :boolean          default(FALSE)
#  sort_order                 :integer
#  created_at                 :datetime         not null
#  updated_at                 :datetime         not null
#

require 'test_helper'

class StoryTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
