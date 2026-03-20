FactoryBot.define do
  factory :project do
    sequence(:title)         { |n| "Project #{n}" }
    sequence(:ticket_prefix) { |n| "PRJ#{n}" }
    body { 'A test project.' }

    trait :with_group do
      transient { group { nil } }
      after(:create) do |project, evaluator|
        g = evaluator.group || create(:group)
        project.groups << g
      end
    end
  end
end
