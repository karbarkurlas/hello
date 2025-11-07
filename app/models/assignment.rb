class Assignment < ApplicationRecord
  belongs_to :user
  belongs_to :shift

  validates :user_id, :shift_id, presence: true
  validates :user_id, uniqueness: { scope: :shift_id } # aynı vardiyaya aynı kişi iki kez atanmasın
  validate  :no_overlap_for_user

  def no_overlap_for_user
    return if shift.blank? || user.blank?
    my_range = shift.range_on
    overlaps = Assignment
      .includes(:shift)
      .where(user_id: user_id)
      .where.not(id: id)
      .select { |a| a.shift.date == shift.date && ranges_overlap?(my_range, a.shift.range_on) }
    errors.add(:base, "Kullanıcının aynı saatte başka vardiyası var") if overlaps.any?
  end

  def ranges_overlap?(r1, r2)
    r1.begin < r2.end && r2.begin < r1.end
  end
end
