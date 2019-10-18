class InstallerViewModel
  include ActiveModel::Model

  attr_accessor :password, :password_confirmation, :locale

  validates :password, presence: true, confirmation: true
  validates :locale, presence: true
end
