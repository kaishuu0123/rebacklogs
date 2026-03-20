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
      begin
        Role.create([{ name: 'admin' }, { name: 'developer' }])

        admin = User.create!(
          username: @installer.username,
          email: @installer.email,
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
      rescue ActiveRecord::RecordInvalid => e
        e.record.errors.each do |error|
          @installer.errors.add(error.attribute, error.message)
        end
        render :index, status: :unprocessable_entity
      end
    else
      render :index, status: :unprocessable_entity
    end
  end

  private

  def installed?
    redirect_to root_path if Setting.installed
  end

  def installer_params
    params.permit(:username, :email, :password, :password_confirmation, :locale)
  end
end
