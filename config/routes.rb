Blog::Application.routes.draw do
  devise_for :users, path_names: {sign_in: "login", sign_out: "logout" }
  resources :posts do
    resources :comments
  end

  root :to => 'posts#index'

end
