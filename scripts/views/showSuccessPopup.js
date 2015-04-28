var app = app || {};

app.showSuccessPopup = (function () {
    var DEFAULT_SUCCESS_TIMEOUT = 2000;
    function showAddAlbumSuccess() {
        return noty({
            text: 'Successfully added an album!',
            type: 'success',
            layout: 'topCenter',
            timeout:DEFAULT_SUCCESS_TIMEOUT
        });
    }

    function showRegistrationSuccess() {
        return noty({
            text: 'Registration was successful. You are now a member!',
            type: 'success',
            layout: 'topCenter',
            timeout:DEFAULT_SUCCESS_TIMEOUT
        });
    }

    function showPictureUploadSuccess() {
        return noty({
            text: 'You successfully uploaded a picture!',
            type: 'success',
            layout: 'topCenter',
            timeout:DEFAULT_SUCCESS_TIMEOUT
        });
    }

    function showPostCommentSuccess() {
        return noty({
            text: 'You successfully posted your comment',
            type: 'success',
            layout: 'topCenter',
            timeout:DEFAULT_SUCCESS_TIMEOUT
        });
    }

    function showAddCategorySuccess() {
        return noty({
            text: 'You successfully added category',
            type: 'success',
            layout: 'topCenter',
            timeout:DEFAULT_SUCCESS_TIMEOUT
        });
    }

    return {
        showAddAlbumSuccess: showAddAlbumSuccess,
        showRegistrationSuccess: showRegistrationSuccess,
        showPictureUploadSuccess: showPictureUploadSuccess,
        showPostCommentSuccess: showPostCommentSuccess,
        showAddCategorySuccess: showAddCategorySuccess
    }
}());