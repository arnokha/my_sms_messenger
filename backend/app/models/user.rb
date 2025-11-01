class User
  include Mongoid::Document
  include Mongoid::Timestamps
  include ActiveModel::SecurePassword

  field :username, type: String
  field :password_digest, type: String

  has_secure_password

  has_many :auth_tokens, dependent: :destroy
  has_many :messages, dependent: :destroy

  validates :username, presence: true, uniqueness: true
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }

  index({ username: 1 }, { unique: true })
end
