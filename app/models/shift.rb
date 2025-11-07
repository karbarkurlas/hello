class Shift < ApplicationRecord
  belongs_to :team, optional: true

  has_many :assignments, dependent: :destroy
  has_many :users, through: :assignments

  validates :date, :start_time, :end_time, presence: true
  validate :end_after_start

  def end_after_start
    return unless start_time && end_time
    errors.add(:end_time, "başlangıçtan sonra olmalı") if end_time <= start_time
  end

  def range_on(date = self.date)
    d = date.is_a?(Date) ? date : Date.parse(date.to_s)
    s = compose_datetime(d, start_time)
    e = compose_datetime(d, end_time)
    s...e
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
