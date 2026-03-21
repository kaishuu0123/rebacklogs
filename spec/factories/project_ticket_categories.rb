# == Schema Information
#
# Table name: project_ticket_categories
#
#  id         :bigint           not null, primary key
#  color      :string
#  sort_order :integer
#  title      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  project_id :bigint
#
# Indexes
#
#  index_project_ticket_categories_on_project_id  (project_id)
#
FactoryBot.define do
  factory :project_ticket_category do
    association :project
    sequence(:title) { |n| "Category #{n}" }
    color { '#aabbcc' }
  end
end
