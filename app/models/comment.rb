class Comment
  include Mongoid::Document
  field :by, type: String 
  field :published_on, type: DateTime, :default => Proc.new{ DateTime.now }
  field :body, type: String

  embedded_in :post, :inverse_of => :comments
end
