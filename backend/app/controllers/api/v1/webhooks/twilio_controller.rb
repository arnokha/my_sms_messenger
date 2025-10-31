module Api
  module V1
    module Webhooks
      class TwilioController < ApplicationController
        skip_before_action :verify_authenticity_token, raise: false
        before_action :verify_twilio_signature

        def status
          message_sid = params['MessageSid']
          message_status = params['MessageStatus']

          Rails.logger.info("Twilio webhook received - SID: #{message_sid}, Status: #{message_status}")

          message = Message.find_by(sid: message_sid)

          if message
            message.update!(status: message_status)
            Rails.logger.info("Message status updated: #{message.id} -> #{message_status}")
            head :ok
          else
            Rails.logger.warn("Message not found for SID: #{message_sid}")
            head :not_found
          end
        rescue => e
          Rails.logger.error("Twilio webhook error: #{e.class} - #{e.message}")
          Rails.logger.error(e.backtrace.join("\n"))
          head :internal_server_error
        end

        private

        def verify_twilio_signature
          validator = Twilio::Security::RequestValidator.new(ENV['TWILIO_AUTH_TOKEN'])

          url = request.original_url
          signature = request.headers['X-Twilio-Signature']
          post_params = request.request_parameters

          unless validator.validate(url, post_params, signature)
            Rails.logger.warn("Invalid Twilio signature for webhook request")
            head :forbidden
          end
        end
      end
    end
  end
end
