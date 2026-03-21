# == Schema Information
#
# Table name: projects
#
#  id            :bigint           not null, primary key
#  body          :text
#  is_public     :boolean          default(FALSE)
#  ticket_prefix :string           not null
#  title         :string
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#
# Indexes
#
#  index_projects_on_ticket_prefix  (ticket_prefix) UNIQUE
#
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
