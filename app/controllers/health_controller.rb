class HealthController < ActionController::Base
  def health
    render plain: 'ok'
  end
end
