class CreateMasterTicketCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :master_ticket_categories do |t|
      t.string :title
      t.integer :sort_order
      t.string :color

      t.timestamps
    end
  end
end
