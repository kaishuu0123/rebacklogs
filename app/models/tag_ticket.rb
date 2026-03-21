# == Schema Information
#
# Table name: tag_tickets
#
#  id         :bigint           not null, primary key
#  created_at :datetime         not null
#  updated_at :datetime         not null
#  tag_id     :bigint
#  ticket_id  :bigint
#
# Indexes
#
#  index_tag_tickets_on_tag_id                (tag_id)
#  index_tag_tickets_on_tag_id_and_ticket_id  (tag_id,ticket_id) UNIQUE
#  index_tag_tickets_on_ticket_id             (ticket_id)
#
# Foreign Keys
#
#  fk_rails_...  (tag_id => tags.id)
#  fk_rails_...  (ticket_id => tickets.id)
#
class TagTicket < ApplicationRecord
  belongs_to :ticket
  belongs_to :tag
end
