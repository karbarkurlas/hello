class Team < ApplicationRecord
  has_many :shifts, dependent: :nullify
  validates :name, presence: true, uniqueness: true
end
