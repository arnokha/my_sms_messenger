module Api
  module V1
    class SessionsController < ApplicationController
      include Authenticatable

      skip_before_action :authenticate_request, only: [:create]

      # POST /api/v1/sessions (login)
      def create
        user = User.find_by(username: session_params[:username])

        if user&.authenticate(session_params[:password])
          auth_token = user.auth_tokens.create!

          render json: {
            user: {
              id: user.id.to_s,
              username: user.username
            },
            token: auth_token.token
          }, status: :created
        else
          render json: { error: 'Invalid username or password' }, status: :unauthorized
        end
      end

      # DELETE /api/v1/sessions/current (logout)
      def destroy
        if current_auth_token
          current_auth_token.invalidate
          render json: { message: 'Logged out successfully' }, status: :ok
        else
          render json: { error: 'No active session found' }, status: :not_found
        end
      end

      private

      def session_params
        params.require(:session).permit(:username, :password)
      end
    end
  end
end
