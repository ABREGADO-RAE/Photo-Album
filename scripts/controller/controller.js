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

    Controller.prototype.getLatestPhotosPage = function (selector) {
        this._model.pictures.getPhotosByLimit(10)
            .then(function (data) {
                app.showLimitedImageView.load(selector, data);
            }, function (error) {
                console.log(error.responseText);
            });
    };

    Controller.prototype.getUploadPage = function (selector) {
        this._model.albums.getAlbums()
            .then(function (data) {
                app.uploadImageView.load(selector, data);
            }, function (error) {
                console.log(error);
            });

        app.uploadImageView.load(selector);
    };

    //Controller.prototype.logout = function(selector) {
    //    var _this = this;
    //    this._model.users.logout()
    //        .then(function() {
    //            app.homeView.load(selector);
    //            location.href = '#/';
    //            _this.getLoggedOutHomeView('#container');
    //        }, function(error) {
    //            console.log(error.responseText);
    //        });
    //};

    Controller.prototype.getLoggedOutHomeView = function (selector) {
        app.loggedOutHomeView.load(selector);
    };

    Controller.prototype.getLoggedInHomeView = function(selector, data){
        app.loggedInHomeView.load(selector, data, this);
    };

    Controller.prototype.attachEventHandlers = function (selector) {
        attachEventHandlerRegisterNewUser.call(this, selector);
        attachEventHandlerLoginUser.call(this, selector);
        attachEventHandlerLogoutUser.call(this, selector);
        attachEventHandlerShowAddAlbumView.call(this, selector);
        attachEventHandlerAddNewAlbum.call(this, selector);
        attachEventHandlerUploadImage.call(this, selector);
        attachEventHandlerShowPicture.call(this, selector);
    };

    var attachEventHandlerShowPicture = function attachEventHandlerShowPicture(selector) {
        var _this = this;
        $(selector).on('click', '.albums-list', function(ev) {
            var albumId = $(ev.target).data('id');
            _this._model.pictures.getAllPicturesByAlbumId(albumId)
                .then(function(data) {
                    var _selector = '#mainContent';
                    console.log(data);
                    console.log('Successfully showed pictures');
                    app.pictureByAlbumView.loadPictureByAlbum(_selector, data);
                }, function(error){
                    console.log(error.responseText);
                })
        });
    };

    var attachEventHandlerLogoutUser = function attachEventHandlerLogoutUser(selector) {
        var _this = this;
        $(selector).on('click', '#btn-logout', function(ev) {
            _this._model.users.logout()
                .then(function() {
                    location.href = '#/';
                    _this.getLoggedOutHomeView(selector);
                }, function(error) {
                    console.log(error.responseText);
                });
        });
    };

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
                        $selectedFileInput.val('');
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
                    app.loggedInHomeView.load('header', data, _this);
                    location.href = '#/';
                    _this.getLoggedInHomeView('#container', data);
                    console.log('Register succesfful');
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
                    app.loggedInHomeView.load('header', data, _this);
                    location.href = '#/logged-in-view';
                    _this.getLoggedInHomeView('#container', data);
                    sessionStorage.setItem('currentUserName', data.username);
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