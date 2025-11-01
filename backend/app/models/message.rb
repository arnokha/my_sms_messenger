class Message
  include Mongoid::Document
  include Mongoid::Timestamps

  field :sid, type: String
  field :to, type: String
  field :from, type: String
  field :body, type: String
  field :status, type: String

  belongs_to :user

  validates :to, :body, :user, presence: true

  index({ sid: 1 }, { unique: true })
  index({ user_id: 1 })
end