User.destroy_all
Team.destroy_all
Shift.destroy_all
Assignment.destroy_all
Leave.destroy_all

u1 = User.create!(name: "Ayşe",   email: "ayse@example.com")
u2 = User.create!(name: "Mehmet", email: "mehmet@example.com")

t1 = Team.create!(name: "A Takımı")
t2 = Team.create!(name: "B Takımı")

today = Date.today

s1 = Shift.create!(team: t1, date: today,     start_time: "09:00", end_time: "17:00")
s2 = Shift.create!(team: t1, date: today,     start_time: "17:00", end_time: "23:00")
s3 = Shift.create!(team: t2, date: today + 1, start_time: "09:00", end_time: "17:00")

Assignment.create!(user: u1, shift: s1)
Assignment.create!(user: u2, shift: s2)

Leave.create!(user: u1, date: today + 1, start_time: "09:00", end_time: "12:00", reason: "Doktor", status: "pending")

puts "Users: #{User.count}, Teams: #{Team.count}, Shifts: #{Shift.count}, Assignments: #{Assignment.count}, Leaves: #{Leave.count}"
