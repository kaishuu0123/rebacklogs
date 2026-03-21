FactoryBot.define do
  factory :task do
    association :project
    association :project_ticket_status
    association :story
    sequence(:title) { |n| "Task #{n}" }
    type { 'Task' }
  end
end
