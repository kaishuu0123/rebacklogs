FactoryBot.define do
  factory :group do
    sequence(:name) { |n| "Group #{n}" }
  end
end
