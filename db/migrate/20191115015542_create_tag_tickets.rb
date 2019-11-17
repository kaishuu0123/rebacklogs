class CreateTagTickets < ActiveRecord::Migration[6.0]
  def change
    create_table :tag_tickets do |t|
      t.references :tag, index: true, foreign_key: true
      t.references :ticket, index: true, foreign_key: true

      t.timestamps
    end

    add_index :tag_tickets, [:tag_id, :ticket_id], unique: true
  end
end
