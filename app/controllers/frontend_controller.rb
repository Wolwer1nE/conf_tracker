class FrontendController < ApplicationController
  allow_unauthenticated_access only: :conferences_hub
  before_action :require_admin!, only: :admin_spa

  def conferences_hub
  end

  def admin_spa
  end

  private
    def require_admin!
      return if current_user&.admin?

      redirect_to conferences_path, alert: "You are not authorized to access the admin SPA."
    end
end
