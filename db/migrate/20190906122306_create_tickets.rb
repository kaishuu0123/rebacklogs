class CreateTickets < ActiveRecord::Migration[6.0]
  def change
    create_table :tickets do |t|
      t.references :project, foreign_key: true
      t.references :sprint, null: true, foreign_key: true
      t.references :ticket, null: true, foreign_key: true
      t.references :project_ticket_category, null: true, foreign_key: true
      t.references :project_ticket_status, null: true, foreign_key: true
      t.references :assignee, null: true, foreign_key: { to_table: :users }

      t.string :type

      t.integer :ticket_number
      t.string :title
      t.text :body
      t.float :point
      t.boolean :is_done, default: false

      t.integer :sort_order, null: true

      t.timestamps
    end
  end
end
