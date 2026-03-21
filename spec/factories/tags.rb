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
FactoryBot.define do
  factory :tag do
    association :project
    sequence(:name) { |n| "tag#{n}" }
  end
end
