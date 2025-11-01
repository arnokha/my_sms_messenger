module Authenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request
    attr_reader :current_user
  end

  private

  def authenticate_request
    token = extract_token_from_header
    return render_unauthorized unless token

    auth_token = AuthToken.active.find_by(token: token)
    return render_unauthorized unless auth_token

    @current_user = auth_token.user
  rescue Mongoid::Errors::DocumentNotFound
    render_unauthorized
  end

  def extract_token_from_header
    header = request.headers['Authorization']
    return nil unless header

    header.split(' ').last if header.start_with?('Bearer ')
  end

  def render_unauthorized
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end

  def current_auth_token
    @current_auth_token ||= AuthToken.active.find_by(token: extract_token_from_header)
  end
end
