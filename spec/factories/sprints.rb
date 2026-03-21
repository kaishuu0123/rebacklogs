# == Schema Information
#
# Table name: sprints
#
#  id             :bigint           not null, primary key
#  closed         :boolean          default(FALSE)
#  end_datetime   :datetime
#  start_datetime :datetime
#  title          :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  project_id     :bigint
#
# Indexes
#
#  index_sprints_on_project_id  (project_id)
#
# Foreign Keys
#
#  fk_rails_...  (project_id => projects.id)
#
FactoryBot.define do
  factory :sprint do
    association :project
    sequence(:title) { |n| "Sprint #{n}" }
    closed { false }
  end
end
