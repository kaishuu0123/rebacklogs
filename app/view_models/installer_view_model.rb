class InstallerViewModel
  include ActiveModel::Model

  attr_accessor :username, :email, :password, :password_confirmation, :locale

  validates :username, presence: true
  validates :email, presence: true, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, presence: true, confirmation: true
  validates :locale, presence: true
end
