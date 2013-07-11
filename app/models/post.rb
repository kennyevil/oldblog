class Post
  include Mongoid::Document

  field :title
  field :published, type: DateTime, :default => Proc.new {  DateTime.now }
  field :by
  field :body

  index({published:1})

  default_scope order_by(:published => :desc)

  embeds_many :comments
end

