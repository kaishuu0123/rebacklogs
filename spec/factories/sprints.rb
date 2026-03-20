FactoryBot.define do
  factory :sprint do
    association :project
    sequence(:title) { |n| "Sprint #{n}" }
    closed { false }
  end
end
