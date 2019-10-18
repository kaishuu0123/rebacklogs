class CreateGroupProjects < ActiveRecord::Migration[6.0]
  def change
    create_table :group_projects do |t|
      t.references :group, null: false, foreign_key: true
      t.references :project, null: false, foreign_key: true

      t.timestamps
    end

    add_index :group_projects, [:group_id, :project_id], unique: true
  end
end
