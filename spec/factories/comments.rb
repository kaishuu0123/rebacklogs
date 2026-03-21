FactoryBot.define do
  factory :comment do
    association :ticket, factory: :story
    association :user
    sequence(:body) { |n| "Comment body #{n}" }
  end
end
