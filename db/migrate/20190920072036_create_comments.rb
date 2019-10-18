class CreateComments < ActiveRecord::Migration[6.0]
  def change
    create_table :comments do |t|
      t.references :user, null: false, foreign_key: true
      t.references :ticket, null: false, foreign_key: true

      t.text :body

      t.timestamps
    end
  end
end
