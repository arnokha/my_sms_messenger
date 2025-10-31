class Message
  include Mongoid::Document
  include Mongoid::Timestamps

  field :sid, type: String
  field :to, type: String
  field :from, type: String
  field :body, type: String
  field :status, type: String
  field :session_id, type: String

  validates :to, :body, :session_id, presence: true

  index({ sid: 1 }, { unique: true })
end