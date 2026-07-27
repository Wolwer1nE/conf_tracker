module Api
  module Admin
    class ConferencesController < ApplicationController
      before_action :require_admin!
      before_action :set_conference, only: %i[update destroy]

      def index
        conferences = Conference.order(starts_on: :asc, created_at: :desc)

        render json: {
          conferences: conferences.map { |conference| conference_payload(conference) }
        }
      end

      def create
        conference = Conference.new(conference_params)

        if conference.save
          render json: { conference: conference_payload(conference) }, status: :created
        else
          render json: { errors: conference.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update
        if @conference.update(conference_params)
          render json: { conference: conference_payload(@conference) }
        else
          render json: { errors: @conference.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def destroy
        @conference.destroy
        head :no_content
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

          render json: { error: "Forbidden" }, status: :forbidden
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
            created_at: conference.created_at
          }
        end
    end
  end
end
