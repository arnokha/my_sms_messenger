module Api
    module V1
        class MessagesController < ApplicationController
            require 'twilio-ruby'

            # POST /api/v1/messages
            def create
                client = Twilio::REST::Client.new(
                ENV['TWILIO_ACCOUNT_SID'],
                ENV['TWILIO_AUTH_TOKEN']
                )

                begin
                twilio_message = client.messages.create(
                    from: ENV['TWILIO_PHONE_NUMBER'],
                    to: message_params[:to],
                    body: message_params[:body]
                )

                message = Message.create!(
                    to: twilio_message.to,
                    from: twilio_message.from,
                    body: message_params[:body],
                    status: twilio_message.status,
                    # session_id: message_params[:session_id]
                )

                render json: message, status: :created
                rescue => e
                    Rails.logger.error("error: #{e.class} - #{e.message}")
                    render json: { error: e.message }, status: :unprocessable_content
                end
            end

            # GET /api/v1/messages
            def index
                messages = Message.order_by(created_at: :desc)
                render json: messages
            end

            private

            # only allow to and body
            def message_params
                params.require(:message).permit(:to, :body)
            end
        end
    end
end
