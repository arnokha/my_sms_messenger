module Api
  module V1
    class MeController < ApplicationController
      include Authenticatable

      # GET /api/v1/me
      def show
        render json: {
          user: {
            id: current_user.id.to_s,
            username: current_user.username
          }
        }, status: :ok
      end
    end
  end
end
