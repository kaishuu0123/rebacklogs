class CreateProjects < ActiveRecord::Migration[6.0]
  def change
    create_table :projects do |t|
      t.string :title
      t.text :body
      t.string :ticket_prefix, null: false

      t.timestamps
    end

    add_index :projects, :ticket_prefix, unique: true
  end
end
