class CreateProjectTicketStatuses < ActiveRecord::Migration[6.0]
  def change
    create_table :project_ticket_statuses do |t|
      t.references :project, index: true, foreign_key: true

      t.string :title
      t.integer :sort_order
      t.boolean :is_done, default: false

      t.timestamps
    end
  end
end
