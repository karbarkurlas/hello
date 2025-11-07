class CreateLeaves < ActiveRecord::Migration[8.1]
  def change
    create_table :leaves do |t|
      t.references :user, null: false, foreign_key: true
      t.date :date
      t.time :start_time
      t.time :end_time
      t.string :reason
      t.string :status

      t.timestamps
    end
  end
end
