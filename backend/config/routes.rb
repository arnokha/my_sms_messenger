Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :messages, only: [:create, :index]

      namespace :webhooks do
        post 'twilio/status', to: 'twilio#status'
      end
    end
  end
end