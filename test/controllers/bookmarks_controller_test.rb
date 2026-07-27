require "test_helper"

class BookmarksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
    @conference = conferences(:two)
    @bookmark = bookmarks(:one)
  end

  test "requires authentication for index" do
    get bookmarks_path
    assert_redirected_to new_session_path
  end

  test "signed in user can create bookmark" do
    sign_in_as(@user)

    assert_difference("Bookmark.count", 1) do
      post conference_bookmark_path(@conference)
    end

    assert_redirected_to conference_path(@conference)
  end

  test "signed in user can remove own bookmark" do
    sign_in_as(@user)

    assert_difference("Bookmark.count", -1) do
      delete bookmark_path(@bookmark)
    end

    assert_redirected_to conference_path(@bookmark.conference)
  end

  test "signed in user sees bookmark list" do
    sign_in_as(@user)

    get bookmarks_path
    assert_response :success
  end
end
