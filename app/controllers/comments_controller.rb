class CommentsController < ApplicationController

  def create
    @post = Post.find(params[:post_id])
    @comment = @post.comments.create!(comment_params)
    redirect_to @post, :notice => "Comment created"
  end

  private
    def comment_params
      params.require(:comment).permit(:by, :published_on, :body)
    end

end
