module Api
  module V1
    class UsersController < ApplicationController
      # POST /api/v1/users (signup)
      def create
        user = User.new(user_params)

        if user.save
          # automatically log in the user by creating an auth token
          auth_token = user.auth_tokens.create!

          render json: {
            user: {
              id: user.id.to_s,
              username: user.username
            },
            token: auth_token.token
          }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_content
        end
      end

      private

      def user_params
        params.require(:user).permit(:username, :password, :password_confirmation)
      end
    end
  end
end
