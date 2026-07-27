class Conference < ApplicationRecord
	has_many :bookmarks, dependent: :destroy
	has_many :users, through: :bookmarks

	validates :name, :location, :starts_on, :ends_on, presence: true
	validates :website_url, format: { with: URI::DEFAULT_PARSER.make_regexp(%w[http https]), allow_blank: true }
	validate :ends_on_is_not_before_starts_on

	private
		def ends_on_is_not_before_starts_on
			return if starts_on.blank? || ends_on.blank?
			return unless ends_on < starts_on

			errors.add(:ends_on, "must be on or after the start date")
		end
end
