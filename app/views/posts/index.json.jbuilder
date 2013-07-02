json.array!(@posts) do |post|
  json.extract! post, :title, :published, :by, :body
  json.url post_url(post, format: :json)
end
