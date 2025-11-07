class Leave < ApplicationRecord
  belongs_to :user
  validates :date, :start_time, :end_time, :status, presence: true
  validates :status, inclusion: { in: %w[pending approved rejected] }
  validate  :end_after_start
  validate  :no_overlap_with_assignments, if: -> { status == "approved" }

  def end_after_start
    return unless start_time && end_time
    errors.add(:end_time, "başlangıçtan sonra olmalı") if end_time <= start_time
  end

  def my_range
    d = date.is_a?(Date) ? date : Date.parse(date.to_s)
    s = compose_datetime(d, start_time)
    e = compose_datetime(d, end_time)
    s...e
  end

  def no_overlap_with_assignments
    overlaps = Assignment.includes(:shift)
      .where(user_id: user_id)
      .select { |a| a.shift && a.shift.date == date && ranges_overlap?(my_range, a.shift.range_on) }
    errors.add(:base, "Onaylı izin, kullanıcının vardiyasıyla çakışıyor") if overlaps.any?
  end

  def ranges_overlap?(r1, r2)
    r1.begin < r2.end && r2.begin < r1.end
  end

  private

  def compose_datetime(date, t)
    if t.respond_to?(:hour) && t.respond_to?(:min)
      hh = t.hour
      mm = t.min
    else
      hh, mm = t.to_s.split(":").map(&:to_i)
    end
    Time.zone.local(date.year, date.month, date.day, hh, mm)
  end
end
