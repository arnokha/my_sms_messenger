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
                    body: twilio_message.body,
                    status: twilio_message.status
                )

                render json: message, status: :created
                rescue => e
                render json: { error: e.message }, status: :unprocessable_entity
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
