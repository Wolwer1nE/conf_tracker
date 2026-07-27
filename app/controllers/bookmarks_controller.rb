class BookmarksController < ApplicationController
  def index
    @bookmarks = current_user.bookmarks.includes(:conference).order(created_at: :desc)
  end

  def create
    conference = Conference.find(params[:conference_id])
    current_user.bookmarks.find_or_create_by!(conference: conference)

    redirect_back fallback_location: conference_path(conference), notice: "Conference bookmarked."
  end

  def destroy
    bookmark = current_user.bookmarks.find(params[:id])
    conference = bookmark.conference
    bookmark.destroy

    redirect_back fallback_location: conference_path(conference), notice: "Bookmark removed."
  end
end
