class CreateConferences < ActiveRecord::Migration[8.1]
  def change
    create_table :conferences do |t|
      t.string :name, null: false
      t.string :location, null: false
      t.date :starts_on, null: false
      t.date :ends_on, null: false
      t.string :website_url
      t.text :description

      t.timestamps
    end

    add_index :conferences, :starts_on
  end
end
