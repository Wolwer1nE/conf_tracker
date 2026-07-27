module Api
  class ConferencesController < ApplicationController
    allow_unauthenticated_access only: :index

    def index
      conferences = Conference.all

      conferences = conferences.where("name LIKE :q OR description LIKE :q OR location LIKE :q", q: "%#{params[:q].to_s.strip}%") if params[:q].present?
      conferences = conferences.where(location: params[:location]) if params[:location].present?

      if parsed_from_date
        conferences = conferences.where("starts_on >= ?", parsed_from_date)
      end

      if parsed_to_date
        conferences = conferences.where("ends_on <= ?", parsed_to_date)
      end

      conferences = apply_sort(conferences)

      render json: {
        conferences: conferences.limit(200).map { |conference| conference_payload(conference) },
        available_locations: Conference.distinct.order(:location).pluck(:location)
      }
    end

    private
      def parsed_from_date
        @parsed_from_date ||= Date.parse(params[:from_date]) if params[:from_date].present?
      rescue ArgumentError
        nil
      end

      def parsed_to_date
        @parsed_to_date ||= Date.parse(params[:to_date]) if params[:to_date].present?
      rescue ArgumentError
        nil
      end

      def apply_sort(scope)
        case params[:sort]
        when "name_asc"
          scope.order(name: :asc)
        when "name_desc"
          scope.order(name: :desc)
        when "date_desc"
          scope.order(starts_on: :desc, created_at: :desc)
        when "recently_added"
          scope.order(created_at: :desc)
        else
          scope.order(starts_on: :asc, created_at: :desc)
        end
      end

      def conference_payload(conference)
        {
          id: conference.id,
          name: conference.name,
          location: conference.location,
          starts_on: conference.starts_on,
          ends_on: conference.ends_on,
          website_url: conference.website_url,
          description: conference.description,
          duration_days: (conference.ends_on - conference.starts_on).to_i + 1,
          bookmarks_count: conference.bookmarks.count
        }
      end
  end
end
