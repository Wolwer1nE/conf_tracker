# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

admin_email = ENV.fetch("SEED_ADMIN_EMAIL", "admin@conf-tracker.local")
admin_password = ENV.fetch("SEED_ADMIN_PASSWORD", "admin12345")

scientist_email = ENV.fetch("SEED_SCIENTIST_EMAIL", "scientist@conf-tracker.local")
scientist_password = ENV.fetch("SEED_SCIENTIST_PASSWORD", "science12345")

conferences = [
	{
		name: "NeurIPS",
		location: "Vancouver, Canada",
		starts_on: Date.new(2024, 12, 10),
		ends_on: Date.new(2024, 12, 15),
		website_url: "https://neurips.cc/",
		description: "Conference on Neural Information Processing Systems."
	},
	{
		name: "ICML",
		location: "Vienna, Austria",
		starts_on: Date.new(2024, 7, 21),
		ends_on: Date.new(2024, 7, 27),
		website_url: "https://icml.cc/",
		description: "International Conference on Machine Learning."
	},
	{
		name: "ICLR",
		location: "Vienna, Austria",
		starts_on: Date.new(2024, 5, 7),
		ends_on: Date.new(2024, 5, 11),
		website_url: "https://iclr.cc/",
		description: "International Conference on Learning Representations."
	},
	{
		name: "AAAI Conference on Artificial Intelligence",
		location: "Vancouver, Canada",
		starts_on: Date.new(2024, 2, 20),
		ends_on: Date.new(2024, 2, 27),
		website_url: "https://aaai.org/conference/",
		description: "Annual AAAI Conference on Artificial Intelligence."
	},
	{
		name: "CVPR",
		location: "Seattle, USA",
		starts_on: Date.new(2024, 6, 17),
		ends_on: Date.new(2024, 6, 21),
		website_url: "https://cvpr.thecvf.com/",
		description: "IEEE/CVF Conference on Computer Vision and Pattern Recognition."
	},
	{
		name: "ECCV",
		location: "Milan, Italy",
		starts_on: Date.new(2024, 9, 29),
		ends_on: Date.new(2024, 10, 4),
		website_url: "https://eccv.ecva.net/",
		description: "European Conference on Computer Vision."
	},
	{
		name: "ACL",
		location: "Bangkok, Thailand",
		starts_on: Date.new(2024, 8, 11),
		ends_on: Date.new(2024, 8, 16),
		website_url: "https://2024.aclweb.org/",
		description: "Annual Meeting of the Association for Computational Linguistics."
	},
	{
		name: "EMNLP",
		location: "Miami, USA",
		starts_on: Date.new(2024, 11, 12),
		ends_on: Date.new(2024, 11, 16),
		website_url: "https://2024.emnlp.org/",
		description: "Conference on Empirical Methods in Natural Language Processing."
	},
	{
		name: "KDD",
		location: "Barcelona, Spain",
		starts_on: Date.new(2024, 8, 25),
		ends_on: Date.new(2024, 8, 29),
		website_url: "https://kdd.org/kdd2024/",
		description: "ACM SIGKDD Conference on Knowledge Discovery and Data Mining."
	},
	{
		name: "WWW (The Web Conference)",
		location: "Singapore",
		starts_on: Date.new(2024, 5, 13),
		ends_on: Date.new(2024, 5, 17),
		website_url: "https://www2024.thewebconf.org/",
		description: "International World Wide Web Conference."
	}
]

conferences.each do |attrs|
	conference = Conference.find_or_initialize_by(name: attrs[:name])
	conference.update!(attrs)
end

admin = User.find_or_initialize_by(email_address: admin_email)
admin.password = admin_password
admin.password_confirmation = admin_password
admin.admin = true
admin.save!

scientist = User.find_or_initialize_by(email_address: scientist_email)
scientist.password = scientist_password
scientist.password_confirmation = scientist_password
scientist.admin = false
scientist.save!

puts "Seeded #{Conference.count} conferences"
puts "Admin: #{admin.email_address}"
puts "Scientist: #{scientist.email_address}"
