var app = app || {};

app.controller = (function () {
    'use strict';
    function Controller(model) {
        this._model = model;
    }

    Controller.prototype.getLoginPage = function (selector) {
        app.loginView.load(selector);
    };

    Controller.prototype.getRegisterPage = function (selector) {
        app.registerView.load(selector);
    };

    Controller.prototype.getHomePage = function (selector) {
        app.homeView.load(selector);
    };

    Controller.prototype.getAlbumPage = function (selector) {
        this._model.albums.getAlbums()
            .then(function (data) {
                console.log(data);
                app.albumsView.load(selector, data)
            }, function (error) {
                console.log(error);
            })
    };

    Controller.prototype.getUploadPage = function (selector) {
        app.uploadImageView.load(selector);
    };

    Controller.prototype.logout = function(selector) {
        var _this = this;
        this._model.users.logout()
            .then(function() {
                app.homeView.load(selector);
                location.href = '#/';
                _this.getLoggedOutHomeView('#container');
            }, function(error) {
                console.log(error.responseText);
            });
    };

    Controller.prototype.getLoggedOutHomeView = function (selector) {
        app.loggedOutHomeView(selector);
    };

    Controller.prototype.getLoggedInHomeView = function(selector, data){
        app.loggedInHomeView(selector, data);
    };

    Controller.prototype.attachEventHandlers = function (selector) {
        attachEventHandlerRegisterNewUser.call(this, selector);
        attachEventHandlerLoginUser.call(this, selector);
        attachEventHandlerShowAddAlbumView.call(this, selector);
        attachEventHandlerAddNewAlbum.call(this, selector);
        attachEventHandlerUploadImage.call(this, selector);
    };

    //window.onunload(this._model.logout());

    var attachEventHandlerUploadImage = function attachEventHandlerUploadImage(selector) {
        var _this = this;

        $(selector).on('click', '#upload-button', function (ev) {
            var $selectedFileInput = $('#file-select');
            var hasSelectedFile = $.trim(($selectedFileInput).val());
            var $selectedFile = $selectedFileInput.prop('files')[0];

            if (hasSelectedFile != '') {
                var $fileName = ($selectedFileInput.val()).split('/').pop().split('\\').pop();
                _this._model.pictures.uploadPictureData($fileName, $selectedFile)
                    .then(function (data) {
                        var dataToUpload = {
                            'title': 'photo_title',
                            "picture": {
                                "name": data.name,
                                "__type": "File"
                            }
                        };

                        _this._model.pictures.addPicture(JSON.stringify(dataToUpload));
                    }, function (error) {
                        console.log(error.responseText);
                    })
            } else {
                console.log('No file selected');
            }
        })
    };

    var attachEventHandlerRegisterNewUser = function attachEventHandlerRegisterNewUser(selector) {
        var _this = this;
        $(selector).on('click', '#reg-button', function (ev) {
            var username = $('#reg-username');
            var password = $('#reg-password');
            var repeatPassword = $('#repeat-password');
            var email = $('#email');
            _this._model.users.register(username.val(), password.val(), repeatPassword.val(), email.val())
                .then(function (data) {
                    console.log(data);
                }, function (error) {
                    console.log(error);
                });
            username.val('');
            password.val('');
            repeatPassword.val('');
            email.val('');
        });
    };

    var attachEventHandlerLoginUser = function attachEventHandlerLoginUser(selector) {
        var _this = this;
        $(selector).on('click', '#login-button', function (ev) {
            var username = $('#login-username');
            var password = $('#login-password');
            _this._model.users.login(username.val(), password.val())
                .then(function (data) {
                    app.loggedInHomeView.load('header', data);
                    location.href = '#/';
                    _this.getLoggedInHomeView('#container', data);
                    console.log('Login successful');
                }, function (error) {
                    console.log('Login failed');
                });
            username.val('');
            password.val('');
        });
    };

    var attachEventHandlerShowAddAlbumView = function attachEventHandlerShowAddAlbumView(selector) {
        var _this = this;
        $(selector).on('click', '#btn-show-add-album', function (ev) {
            _this._model.categories.getCategory()
                .then(function (data) {
                    console.log(data);
                    app.showAddAlbumView.loadShowView(selector, data);
                }, function (error) {
                    console.log(error);
                });
        });
    };

    var attachEventHandlerAddNewAlbum = function attachEventHandlerAddNewAlbum(selector) {
        var _this = this;
        $(selector).on('click', '#create-album', function (ev) {
            var albumTitle = $('#album-title');
            var selectedCategoryId = $('select .categories:selected').data('id');
            var albumData = {
                "title": albumTitle.val(),
                "category": {"__type": "Pointer", "className": "Category", "objectId": selectedCategoryId}
            };
            _this._model.albums.addAlbum(albumData)
                .then(function (data) {
                    console.log(data);
                    console.log('Successfully added new album');
                    location.href = '#/Albums/Create-album';
                    //window.location.replace('#/Albums');
                    //window.location.reload(true);
                    return data;
                }, function (error) {
                    console.log(error);
                });
        });
    };

    return {
        loadController: function (model) {
            return new Controller(model);
        }
    }
}());