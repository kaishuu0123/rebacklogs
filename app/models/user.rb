# == Schema Information
#
# Table name: users
#
#  id                     :integer          not null, primary key
#  email                  :string           default(""), not null
#  encrypted_password     :string           default(""), not null
#  reset_password_token   :string
#  reset_password_sent_at :datetime
#  remember_created_at    :datetime
#  created_at             :datetime         not null
#  updated_at             :datetime         not null
#  username               :string
#

class User < ApplicationRecord
  rolify
  after_commit :create_default_group, on: [:create]
  after_create :assign_default_role

  attr_writer :login

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable

  validates :username, presence: true, uniqueness: { case_sensitive: false }
  validates_format_of :username, with: /^[a-zA-Z0-9_-]*$/, :multiline => true
  validate :validate_username

  has_many :group_users, dependent: :destroy
  has_many :groups, through: :group_users
  has_many :tickets, foreign_key: :assignee_id, dependent: :nullify
  has_one_attached :image

  def validate_username
    if User.where(email: username).exists?
      errors.add(:username, :invalid)
    end
  end

  def login
    @login || self.username || self.email
  end

  def self.find_for_database_authentication(warden_conditions)
    conditions = warden_conditions.dup
    if login = conditions.delete(:login)
      where(conditions.to_h).where(['lower(username) = :value OR lower(email) = :value', { :value => login.downcase }]).first
    elsif conditions.has_key?(:username) || conditions.has_key?(:email)
      where(conditions.to_h).first
    end
  end

  def create_default_group
    groups.create(name: username)
  end

  def user_image_url
    if image.present?
      base64 = Base64.strict_encode64(image.download)

      return "data:#{image.blob.content_type};base64,#{base64}"
    end

    Identicon.data_url_for(email, 180)
  rescue ActiveStorage::FileNotFoundError
    Identicon.data_url_for(email, 180)
  end

  def assign_default_role
    self.add_role(:developer) if self.roles.blank?
  end
end
