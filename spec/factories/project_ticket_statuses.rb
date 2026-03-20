FactoryBot.define do
  factory :project_ticket_status do
    association :project
    sequence(:title) { |n| "Status #{n}" }
    is_done { false }

    trait :done do
      is_done { true }
    end
  end
end
