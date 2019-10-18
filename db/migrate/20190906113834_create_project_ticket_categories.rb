class CreateProjectTicketCategories < ActiveRecord::Migration[6.0]
  def change
    create_table :project_ticket_categories do |t|
      t.references :project

      t.string :title
      t.integer :sort_order
      t.string :color

      t.timestamps
    end
  end
end
