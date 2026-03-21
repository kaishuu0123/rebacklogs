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
class Tag < ApplicationRecord
  belongs_to :project

  has_many :tag_tickets, dependent: :destroy
  has_many :tickets, through: :tag_tickets
end
