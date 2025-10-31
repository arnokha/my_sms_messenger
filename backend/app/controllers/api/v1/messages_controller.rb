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
                # Construct the StatusCallback URL for Twilio webhooks
                status_callback_url = "#{ENV['API_BASE_URL']}/api/v1/webhooks/twilio/status"

                twilio_message = client.messages.create(
                    from: ENV['TWILIO_PHONE_NUMBER'],
                    to: message_params[:to],
                    body: message_params[:body],
                    status_callback: status_callback_url
                )

                message = Message.create!(
                    sid: twilio_message.sid,
                    to: twilio_message.to,
                    from: twilio_message.from,
                    body: message_params[:body],
                    status: twilio_message.status,
                    session_id: message_params[:session_id]
                )

                render json: message, status: :created
                rescue => e
                    Rails.logger.error("error: #{e.class} - #{e.message}")
                    render json: { error: e.message }, status: :unprocessable_content
                end
            end

            # GET /api/v1/messages
            def index
                messages = Message.where(session_id: params[:session_id]).order_by(created_at: :desc)
                # messages = Message.order_by(created_at: :desc)
                render json: messages
            end

            private

            # only allow to, body, session_id
            def message_params
                params.require(:message).permit(:to, :body, :session_id)
            end
        end
    end
end
