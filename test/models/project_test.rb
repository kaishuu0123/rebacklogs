# == Schema Information
#
# Table name: projects
#
#  id            :bigint           not null, primary key
#  body          :text
#  is_public     :boolean          default(FALSE)
#  ticket_prefix :string           not null
#  title         :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_projects_on_ticket_prefix  (ticket_prefix) UNIQUE
#

require 'test_helper'

class ProjectTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
