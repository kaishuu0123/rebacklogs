# == Schema Information
#
# Table name: group_users
#
#  id         :integer          not null, primary key
#  user_id    :integer
#  group_id   :integer
#  created_at :datetime         not null
#  updated_at :datetime         not null
#

class GroupUser < ApplicationRecord
  belongs_to :user
  belongs_to :group
end
