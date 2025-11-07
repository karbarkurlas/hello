class AddTeamToShifts < ActiveRecord::Migration[7.1]
  def up
    # 1) Önce nullable ekle (NOT NULL değil)
    add_reference :shifts, :team, foreign_key: true, null: true

    # 2) Eski satırları doldur
    # Model çağırmak migration'da kabul edilebilir; tablo yoksa rescue ile geçilebilir.
    begin
      # Varsayılan takım oluştur / veya ilk takımı kullan
      default_team = Team.first || Team.create!(name: "Default")

      # team_id'si boş tüm eski vardiyalara default team bağla
      Shift.where(team_id: nil).update_all(team_id: default_team.id)
    rescue NameError
      # Team/Shift model isimleri farklıysa veya yüklenmiyorsa tablo düzeyinde doldur
      default_team_id = execute("SELECT id FROM teams LIMIT 1").first&.dig("id")
      unless default_team_id
        execute "INSERT INTO teams (name, created_at, updated_at) VALUES ('Default', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)"
        default_team_id = execute("SELECT id FROM teams WHERE name='Default' ORDER BY id DESC LIMIT 1").first["id"]
      end
      execute "UPDATE shifts SET team_id = #{default_team_id} WHERE team_id IS NULL"
    end

    # 3) Artık NOT NULL yap
    change_column_null :shifts, :team_id, false
  end

  def down
    remove_reference :shifts, :team, foreign_key: true
  end
end
