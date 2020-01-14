# == Schema Information
#
# Table name: groups
#
#  id         :integer          not null, primary key
#  name       :string           not null
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class Group < ApplicationRecord
  has_many :group_users, dependent: :destroy
  has_many :users, through: :group_users

  has_many :group_projects, dependent: :destroy
  has_many :projects, through: :group_projects

  validates :name, presence: true

  accepts_nested_attributes_for :group_users

  def group_image_url
    InitialAvatar.avatar_data_uri(name.chars.first, size: 64)
  end
end
