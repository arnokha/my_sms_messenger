Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :messages, only: [:create, :index]

      # Authentication routes
      resources :users, only: [:create]
      resources :sessions, only: [:create]
      delete 'sessions/current', to: 'sessions#destroy'
      get 'me', to: 'me#show'

      namespace :webhooks do
        post 'twilio/status', to: 'twilio#status'
      end
    end
  end
end