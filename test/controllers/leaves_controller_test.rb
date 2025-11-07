require "test_helper"

class LeavesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @leafe = leaves(:one)
  end

  test "should get index" do
    get leaves_url, as: :json
    assert_response :success
  end

  test "should create leafe" do
    assert_difference("Leave.count") do
      post leaves_url, params: { leafe: { date: @leafe.date, end_time: @leafe.end_time, reason: @leafe.reason, start_time: @leafe.start_time, status: @leafe.status, user_id: @leafe.user_id } }, as: :json
    end

    assert_response :created
  end

  test "should show leafe" do
    get leafe_url(@leafe), as: :json
    assert_response :success
  end

  test "should update leafe" do
    patch leafe_url(@leafe), params: { leafe: { date: @leafe.date, end_time: @leafe.end_time, reason: @leafe.reason, start_time: @leafe.start_time, status: @leafe.status, user_id: @leafe.user_id } }, as: :json
    assert_response :success
  end

  test "should destroy leafe" do
    assert_difference("Leave.count", -1) do
      delete leafe_url(@leafe), as: :json
    end

    assert_response :no_content
  end
end
