class LeavesController < ApplicationController

  def index
    render json: Leave.order(created_at: :desc)
  end

  def create
    leave = Leave.new(leave_params)
    if leave.save
      render json: leave, status: :created
    else
      render json: { errors: leave.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def leave_params
    params.require(:leave)
          .permit(:user_id, :date, :start_time, :end_time, :reason, :status)
  end
end
