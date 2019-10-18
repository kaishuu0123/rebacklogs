# == Schema Information
#
# Table name: sprints
#
#  id             :integer          not null, primary key
#  project_id     :integer
#  title          :string
#  start_datetime :datetime
#  end_datetime   :datetime
#  closed         :boolean          default(FALSE)
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#

class Sprint < ApplicationRecord
  belongs_to :project
  has_many :stories, -> { order(sort_order: :asc) }

  scope :opening, -> { where(closed: false) }
  scope :closed, -> { where(closed: true) }
end
