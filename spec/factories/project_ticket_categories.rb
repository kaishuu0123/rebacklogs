FactoryBot.define do
  factory :project_ticket_category do
    association :project
    sequence(:title) { |n| "Category #{n}" }
    color { '#aabbcc' }
  end
end
