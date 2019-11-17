class Tag < ApplicationRecord
  belongs_to :project

  has_many :tag_tickets, dependent: :destroy
  has_many :tickets, through: :tag_tickets
end
