# == Schema Information
#
# Table name: sprints
#
#  id             :bigint           not null, primary key
#  closed         :boolean          default(FALSE)
#  end_datetime   :datetime
#  start_datetime :datetime
#  title          :string
#  created_at     :datetime         not null
#  updated_at     :datetime         not null
#  project_id     :bigint
#
# Indexes
#
#  index_sprints_on_project_id  (project_id)
#
# Foreign Keys
#
#  fk_rails_...  (project_id => projects.id)
#

class Sprint < ApplicationRecord
  include Broadcastable

  belongs_to :project
  has_many :stories, -> { order(sort_order: :asc) }

  scope :opening, -> { where(closed: false) }
  scope :closed, -> { where(closed: true) }
end
