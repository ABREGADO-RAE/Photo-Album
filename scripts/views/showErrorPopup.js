var app = app || {};

app.showErrorPopup = (function () {
    var DEFAULT_ERROR_TIMEOUT = 3000;

    function showErrorDuringRegister() {
        return noty({
            text: 'Registration failed. Please try again',
            type: 'error',
            layout: 'topCenter',
            timeout:DEFAULT_ERROR_TIMEOUT
        });
    }

    function showErrorUnableToRetrieveAlbums() {
        return noty({
            text: 'Unable to retrieve albums. Please try again',
            type: 'error',
            layout: 'topCenter',
            timeout:DEFAULT_ERROR_TIMEOUT
        });
    }

    function showErrorDuringAddingAlbum() {
        return noty({
            text: 'Adding album failed. Please try again.',
            type: 'error',
            layout: 'topCenter',
            timeout:DEFAULT_ERROR_TIMEOUT
        });
    }

    function showErrorDuringPictureUpload() {
        return noty({
            text: 'Picture upload failed!',
            type: 'error',
            layout: 'topCenter',
            timeout:DEFAULT_ERROR_TIMEOUT
        });
    }

    function showErrorInvalidPictureFormat(){
        return noty({
            text: 'Invalid file format. Selected file must be in format gif, jpg, jpeg, tiff or png)',
            type: 'error',
            layout: 'topCenter',
            timeout:DEFAULT_ERROR_TIMEOUT
        });
    }

    function showErrorMaximumPictureSizeExceeded() {
        return noty({
            text: 'Maximum image size exceeded! Maximum size is 1mb',
            type: 'error',
            layout: 'topCenter',
            timeout:DEFAULT_ERROR_TIMEOUT
        });
    }

    function showErrorNoPictureWasSelected() {
        return noty({
            text: 'Upload failed! No file has been selected',
            type: 'error',
            layout: 'topCenter',
            timeout:DEFAULT_ERROR_TIMEOUT
        });
    }

    function showErrorAddCategoryFailed() {
        return noty({
            text: 'Adding category failed. Please try again.',
            type: 'error',
            layout: 'topCenter',
            timeout:DEFAULT_ERROR_TIMEOUT
        });
    }

    return {
        showErrorDuringRegister: showErrorDuringRegister,
        showErrorDuringAddingAlbum: showErrorDuringAddingAlbum,
        showErrorDuringPictureUpload: showErrorDuringPictureUpload,
        showErrorMaximumPictureSizeExceeded: showErrorMaximumPictureSizeExceeded,
        showErrorNoPictureWasSelected: showErrorNoPictureWasSelected,
        showErrorAddCategoryFailed:showErrorAddCategoryFailed,
        showErrorUnableToRetrieveAlbums:showErrorUnableToRetrieveAlbums,
        showErrorInvalidPictureFormat: showErrorInvalidPictureFormat
    }
}());