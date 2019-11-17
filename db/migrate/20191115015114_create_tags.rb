class CreateTags < ActiveRecord::Migration[6.0]
  def change
    create_table :tags do |t|
      t.string :name, null: false
      t.references :project, null: false, foreign_key: true

      t.timestamps
    end

    add_index :tags, [:id, :project_id], unique: true
  end
end
