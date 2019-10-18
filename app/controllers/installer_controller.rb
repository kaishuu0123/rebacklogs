class InstallerController < ActionController::Base
  include SwitchLocale

  before_action :installed?
  around_action :switch_locale

  layout 'installer'

  def index
    @installer = InstallerViewModel.new
  end

  def update
    @installer = InstallerViewModel.new(installer_params)
    if @installer.valid?
      Role.create([
        {
          name: 'admin'
        },
        {
          name: 'developer'
        }
      ])

      admin = User.create!(
        username: 'admin',
        email: 'admin@example.com',
        password: @installer.password
      )

      admin.remove_role(:developer)
      admin.add_role(:admin)

      case @installer.locale
      when 'en'
        MasterTicketCategory.create_default_en
        MasterTicketStatus.create_default_en
      when 'ja'
        MasterTicketCategory.create_default_ja
        MasterTicketStatus.create_default_ja
      end

      sign_in(admin, bypass: true)

      Setting.installed = true

      redirect_to root_path
    else
      render :index
    end
  end

  private

  def installed?
    redirect_to root_path if Setting.installed
  end

  def installer_params
    params.permit(:password, :password_confirmation, :locale)
  end
end
