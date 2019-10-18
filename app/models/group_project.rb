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

class GroupProject < ApplicationRecord
  belongs_to :group
  belongs_to :project
end
