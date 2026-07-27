class Bookmark < ApplicationRecord
  belongs_to :user
  belongs_to :conference

  validates :conference_id, uniqueness: { scope: :user_id }
end
