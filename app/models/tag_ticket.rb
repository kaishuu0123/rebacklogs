class TagTicket < ApplicationRecord
  belongs_to :ticket
  belongs_to :tag
end
