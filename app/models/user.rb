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
  # GRAVATAR のデフォルトアイコン (電源ボタンっぽいやつ)
  GRAVATAR_DEFAULT_ICON_BASE64 = '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'

  rolify
  attribute :skip_create_default_group, :boolean, default: false
  # XXX: set_gravatar_icon を create_default_group より後の行に書くと処理が継続されない問題を調べる必要がある
  # after_create_commit :set_gravatar_icon, if: Proc.new {
  #   skip_create_default_group == false
  # }
  after_create_commit :create_default_group, if: Proc.new {
    skip_create_default_group == false
  }
  after_create_commit :assign_default_role

  attr_writer :login

  TEMP_EMAIL_PREFIX = 'change@me'.freeze
  TEMP_EMAIL_REGEX = /\Achange@me/.freeze

  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable, :omniauthable

  validates :username, presence: true, uniqueness: { case_sensitive: false }
  validates_format_of :username, with: /^[a-zA-Z0-9_-]*$/, :multiline => true
  validate :validate_username

  has_many :group_users, dependent: :destroy
  has_many :groups, through: :group_users
  has_many :tickets, foreign_key: :assignee_id, dependent: :nullify
  has_one_attached :image, dependent: :purge
  has_many :social_profiles, dependent: :destroy

  # emailの登録状況を判定するカスタムvalidatorを使用するためのおまじない。
  validates :email, presence: true, email: true

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

  # ユーザ作成時に呼び出される Gravatar アイコンを設定するフック
  def set_gravatar_icon
    use_gravatar_icon(false)
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

  # 現在のアイコンを Gravatar アイコンにセットする
  # use_default_icon を false にすると、 gravatar 公式のデフォルトアイコンと合致した場合には何もしないようになっている
  def use_gravatar_icon(use_default_icon = true)
    require 'open-uri'

    # Gravatar の デフォルトアイコンを使わない場合
    unless use_default_icon
      image_url = ApplicationController.helpers.gravatar_image_url(
        email
      )
      image_data = nil
      URI.open(image_url) do |file|
        image_data = file.read
      end

      return if GRAVATAR_DEFAULT_ICON_BASE64 == Base64.strict_encode64(image_data)
    end

    image_url = ApplicationController.helpers.gravatar_image_url(
      email,
      size: 180,
      secure: true
    )

    URI.open(image_url) do |file|
      image.purge
      image.attach(
        io: file,
        filename: "#{username}-gravatar.#{File.basename(file.meta['content-type'])}",
        content_type: file.meta['content-type']
      )
    end
  end

  ###
  # refs: https://qiita.com/mnishiguchi/items/e15bbef61287f84b546e
  ###
  def social_profile(provider)
    social_profiles.select { |sp| sp.provider == provider.to_s }.first
  end

  # 本物の email がセットされているか確認。
  def email_verified?
    self.email && self.email !~ TEMP_EMAIL_REGEX
  end

  # email 確認がされていない状態にする。
  # def reset_confirmation!
  #   self.update_column(:confirmed_at, nil)
  # end

  # Userモデル経由でcurrent_userを参照できるようにする。
  def self.current_user=(user)
    # Set current user in Thread.
    Thread.current[:current_user] = user
  end

  # Userモデル経由でcurrent_userを参照する。
  def self.current_user
    # Get current user from Thread.
    Thread.current[:current_user]
  end
end
