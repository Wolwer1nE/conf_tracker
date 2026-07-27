require "test_helper"

class RegistrationsControllerTest < ActionDispatch::IntegrationTest
  test "new" do
    get new_registration_path
    assert_response :success
  end

  test "create registers and signs in user" do
    assert_difference("User.count", 1) do
      post registration_path, params: {
        user: {
          email_address: "new-user@example.com",
          password: "password",
          password_confirmation: "password"
        }
      }
    end

    assert_redirected_to conferences_path
    assert cookies[:session_id]
  end

  test "create with invalid params renders new" do
    assert_no_difference("User.count") do
      post registration_path, params: {
        user: {
          email_address: "",
          password: "password",
          password_confirmation: "different"
        }
      }
    end

    assert_response :unprocessable_entity
  end
end
