class CreateMasterTicketStatuses < ActiveRecord::Migration[6.0]
  def change
    create_table :master_ticket_statuses do |t|
      t.string :title, default: ''
      t.integer :sort_order, default: 0
      t.boolean :is_done, default: false

      t.timestamps
    end
  end
end
