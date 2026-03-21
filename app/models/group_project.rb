# == Schema Information
#
# Table name: group_projects
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  group_id   :bigint           not null
#  project_id :bigint           not null
#
# Indexes
#
#  index_group_projects_on_group_id                 (group_id)
#  index_group_projects_on_group_id_and_project_id  (group_id,project_id) UNIQUE
#  index_group_projects_on_project_id               (project_id)
#
# Foreign Keys
#
#  fk_rails_...  (group_id => groups.id)
#  fk_rails_...  (project_id => projects.id)
#

class GroupProject < ApplicationRecord
  belongs_to :group
  belongs_to :project
end
