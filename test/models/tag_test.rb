# == Schema Information
#
# Table name: tags
#
#  id         :bigint           not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  project_id :bigint           not null
#
# Indexes
#
#  index_tags_on_id_and_project_id  (id,project_id) UNIQUE
#  index_tags_on_project_id         (project_id)
#
# Foreign Keys
#
#  fk_rails_...  (project_id => projects.id)
#
require 'test_helper'

class TagTest < ActiveSupport::TestCase
  # test "the truth" do
  #   assert true
  # end
end
