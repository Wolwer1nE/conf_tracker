class ConferencesController < ApplicationController
  allow_unauthenticated_access only: %i[index show]
  before_action :set_conference, only: %i[show edit update destroy]
  before_action :require_admin!, only: %i[new create edit update destroy]

  def index
    @conferences = Conference.order(starts_on: :asc, created_at: :desc)
    @bookmarks_by_conference_id = current_user&.bookmarks&.where(conference_id: @conferences.map(&:id))&.index_by(&:conference_id) || {}
  end

  def show
    @bookmark = current_user&.bookmarks&.find_by(conference: @conference)
  end

  def new
    @conference = Conference.new
  end

  def create
    @conference = Conference.new(conference_params)

    if @conference.save
      redirect_to @conference, notice: "Conference created successfully."
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @conference.update(conference_params)
      redirect_to @conference, notice: "Conference updated successfully."
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @conference.destroy
    redirect_to conferences_path, notice: "Conference removed."
  end

  private
    def set_conference
      @conference = Conference.find(params[:id])
    end

    def conference_params
      params.require(:conference).permit(:name, :location, :starts_on, :ends_on, :website_url, :description)
    end

    def require_admin!
      return if current_user&.admin?

      redirect_to conferences_path, alert: "You are not authorized to perform this action."
    end
end
