FactoryBot.define do
  factory :story do
    association :project
    association :project_ticket_status
    sequence(:title) { |n| "Story #{n}" }
    type { 'Story' }
  end
end
