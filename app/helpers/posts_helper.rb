module PostsHelper

  def post_gravatar(post)
    gravatar_id = Digest::MD5::hexdigest(post.email.downcase)
    gravatar_url = "https://secure.gravatar.com/avatar/#{gravatar_id}"
    image_tag(gravatar_url, alt: post.by, class:"gravatar")
  end  
end
