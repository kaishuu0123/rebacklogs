# == Schema Information
#
# Table name: project_ticket_statuses
#
#  id         :bigint           not null, primary key
#  is_done    :boolean          default(FALSE)
#  sort_order :integer
#  title      :string
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  project_id :bigint
#
# Indexes
#
#  index_project_ticket_statuses_on_project_id  (project_id)
#
# Foreign Keys
#
#  fk_rails_...  (project_id => projects.id)
#
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
