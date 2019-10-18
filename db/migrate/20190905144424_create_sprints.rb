class CreateSprints < ActiveRecord::Migration[6.0]
  def change
    create_table :sprints do |t|
      t.references :project, index: true, foreign_key: true

      t.string :title
      t.datetime :start_datetime
      t.datetime :end_datetime
      t.boolean :closed, default: false

      t.timestamps
    end
  end
end
