class Post
  include Mongoid::Document
  include Mongoid::Timestamps

  field :title
  field :by
  field :body
  field :created_at, type: DateTime
  field :_id, type: String, default: ->{ title.to_s.parameterize }

  index({created_at:1})

  default_scope order_by(:created_at => :desc)

  embeds_many :comments

end

