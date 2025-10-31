class Message
  include Mongoid::Document
  include Mongoid::Timestamps

  field :to, type: String
  field :from, type: String
  field :body, type: String
  field :status, type: String

  validates :to, :body, presence: true
end