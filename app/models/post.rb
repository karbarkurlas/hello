class Post < ApplicationRecord
  belongs_to :user
  belongs_to :category
  has_many :comments, dependent: :destroy
  has_many :likes,    dependent: :destroy

  validates :title, :body, presence: true
end