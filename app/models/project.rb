# == Schema Information
#
# Table name: projects
#
#  id            :integer          not null, primary key
#  title         :string
#  body          :text
#  ticket_prefix :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#

class Project < ApplicationRecord
  has_many :group_projects, dependent: :destroy
  has_many :groups, through: :group_projects
  has_many :users, -> { distinct }, through: :groups
  has_many :sprints, -> { order(created_at: :asc) }
  has_many :project_ticket_statuses
  has_many :project_ticket_categories
  has_many :tags
  has_one_attached :image

  validates :title, presence: true
  validates :ticket_prefix, presence: true, uniqueness: true, format: { with: /[a-zA-Z]/}

  scope :search_by_keyword, -> (keywords) {
    if keywords.present?
      columns = %i[title body]
      where(keywords.split(/[[:space:]]/).reject(&:empty?).map { |keyword|
        columns.map { |a| arel_table[a].matches("%#{keyword}%") }.inject(:or)
      }.inject(:and))
    end
  }

  def project_image_url
    if image.present?
      base64 = Base64.strict_encode64(image.download)

      return "data:#{image.blob.content_type};base64,#{base64}"
    end

    InitialAvatar.avatar_data_uri(title.chars.first, size: 64)
  rescue ActiveStorage::FileNotFoundError
    InitialAvatar.avatar_data_uri(title.chars.first, size: 64)
  end
end
