Rails.application.routes.draw do
  resources :users
  resources :teams
  resources :categories
  resources :posts
  resources :shifts
  resources :assignments
  resources :leaves, only: [:index, :create]
end
