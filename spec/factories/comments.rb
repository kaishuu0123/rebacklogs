# == Schema Information
#
# Table name: comments
#
#  id         :bigint           not null, primary key
#  body       :text
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  ticket_id  :bigint           not null
#  user_id    :bigint           not null
#
# Indexes
#
#  index_comments_on_ticket_id  (ticket_id)
#  index_comments_on_user_id    (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (ticket_id => tickets.id)
#  fk_rails_...  (user_id => users.id)
#
FactoryBot.define do
  factory :comment do
    association :ticket, factory: :story
    association :user
    sequence(:body) { |n| "Comment body #{n}" }
  end
end
