Rails.application.routes.draw do
  resources :users
  resources :categories
  resources :posts do
    resources :comments, only: [:index, :create]
    resources :likes,    only: [:index, :create]
  end
  resources :comments, only: [:show, :update, :destroy]
  resources :likes,    only: [:show, :destroy]
end