class ApplicationSettings::DashboardController < ApplicationController
  authorize_resource class: false

  def index
  end

  def update
    settings_params.keys.each do |key|
      Setting.send("#{key}=", settings_params[key].strip) unless settings_params[key].nil?
    end

    redirect_to application_settings_path, notice: 'Setting was successfully updated.'
  end

  private

  def settings_params
    params.require(:settings).permit(:site_title, :head_custom_script, :body_custom_script)
  end
end
