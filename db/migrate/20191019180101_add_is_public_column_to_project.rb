class AddIsPublicColumnToProject < ActiveRecord::Migration[6.0]
  def change
    add_column :projects, :is_public, :boolean, default: false
  end
end
