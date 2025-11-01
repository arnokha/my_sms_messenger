class AuthToken
  include Mongoid::Document
  include Mongoid::Timestamps

  field :token, type: String
  field :expires_at, type: Time

  belongs_to :user

  validates :token, presence: true, uniqueness: true
  validates :expires_at, presence: true

  index({ token: 1 }, { unique: true })
  index({ expires_at: 1 }, { expire_after_seconds: 0 })

  before_validation :generate_token, on: :create
  before_validation :set_expiration, on: :create

  scope :active, -> { where(:expires_at.gt => Time.current) }

  def active?
    expires_at > Time.current
  end

  def invalidate
    destroy
  end

  private

  def generate_token
    self.token ||= SecureRandom.urlsafe_base64(32)
  end

  def set_expiration
    self.expires_at ||= 24.hours.from_now
  end
end
