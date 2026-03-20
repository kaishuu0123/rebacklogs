FactoryBot.define do
  factory :tag do
    association :project
    sequence(:name) { |n| "tag#{n}" }
  end
end
