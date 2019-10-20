class ApplicationController < ActionController::Base
  include SwitchLocale

  before_action :installed?

  protect_from_forgery
  check_authorization unless: :devise_controller?

  # authenticate_user! より前に実行させるため around_action を利用する
  around_action :switch_locale

  before_action :authenticate_user!, unless: :devise_controller?
  before_action :configure_permitted_parameters, if: :devise_controller?

  rescue_from CanCan::AccessDenied, with: :handle_access_denied

  protected

  def configure_permitted_parameters
    added_attrs = [:username, :email, :password, :password_confirmation, :remember_me]
    devise_parameter_sanitizer.permit :sign_up, keys: added_attrs
    devise_parameter_sanitizer.permit :account_update, keys: added_attrs
  end

  def handle_access_denied(exception)
    logger.error 'Access Denied'
    logger.error "Subject: #{exception.subject.class}"
    logger.error "Action: #{exception.action}"
    logger.error "#{exception.class}: #{exception.message}"
    logger.error exception.backtrace.join("\n")

    respond_to do |format|
      format.json { head :forbidden, content_type: 'text/html' }
      format.html { redirect_to main_app.root_url, alert: exception.message }
      format.js   { head :forbidden, content_type: 'text/html' }
    end
  end

  def installed?
    redirect_to installer_path unless Setting.installed
  end
end
