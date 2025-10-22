class Like < ApplicationRecord
  belongs_to :user
  belongs_to :post

  # Enforce one like per (user, post)
  validates :user_id, uniqueness: { scope: :post_id }
end