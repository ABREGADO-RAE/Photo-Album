var app = app || {};

app.controller = (function () {
    'use strict';
    var MAIN_CONTAINER_SELECTOR = '#mainContent';
    var MAX_IMAGE_SIZE = 1100000;

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
        this._model.albums.getMostHighlyRankedAlbums()
            .then(function(data){
                //console.log(data);
                app.homeView.load(selector, data);
            }, function(error){
                console.log(error);
            })
    };

    Controller.prototype.getAlbumPage = function (selector) {
        var _this = this;
        this._model.albums.getAlbums()
            .then(function(data) {
                var albums = [];
                data.results.forEach(function(result) {
                    var album = {
                        title: result.title,
                        id: result.objectId,
                        pictureUrl: undefined,
                        likes: result.likes,
                        dislikes: result.dislikes
                    };
                    albums.push(album);
                });
                getLatestPicture(_this, albums, selector)
                    .then(function(data) {
                        //console.log(data);
                        var output = {
                            albums: albums
                        };
                        app.albumsView.load(selector, output);
                    }, function(error) {
                        console.log(error.responseText);
                    }).done();
            }, function(error) {
                console.log(error);
                app.showErrorPopup.showErrorUnableToRetrieveAlbums();
            })
    };

    function getLatestPicture(controller, albums, selector) {
        var defer = Q.defer();
        var promises = [];

        albums.forEach(function(album) {
            var id = album.id;

            promises.push(controller._model.pictures.getAlbumLatestPicture(id));
        });

        Q.allSettled(promises)
                .then(function (results) {
                    results.forEach(function(data) {
                        if(data.value.results.length
                        ) {
                            albums.filter(function(album) {
                                return album.id === data.value.results[0].album.objectId;
                            })[0].pictureUrl = data.value.results[0].picture.url;
                        }
                    });
                    defer.resolve('All pictures loaded successfully!');
                }, function (error) {
                    defer.reject(error.responseText);
                });

        return defer.promise;
    }

    Controller.prototype.getLatestPhotosPage = function (selector) {
        this._model.pictures.getPhotosByLimit(16)
            .then(function (data) {
                app.showLimitedImageView.load(selector, data);
            }, function (error) {
                console.log(error.responseText);
            });
    };

    Controller.prototype.getUploadPage = function (selector) {
        if(isLoggedIn()) {
            this._model.albums.getAlbums()
                .then(function (data) {
                    app.uploadImageView.load(selector, data);
                }, function (error) {
                    console.log(error);
                });

            app.uploadImageView.load(selector);
        }
    };

    Controller.prototype.getPicturesByAlbumPage = function () {
        var albumId = sessionStorage.getItem('AlbumId');
        getPicturesByAlbum(this, albumId);
    };

    Controller.prototype.getLoggedOutHomeView = function (selector) {
        app.loggedOutHomeView.load(selector);
    };

    Controller.prototype.getLoggedInHomeView = function(selector, data){
        app.loggedInHomeView.load('header', data, this);
    };

    Controller.prototype.getCategories = function(selector) {
        this._model.categories.getCategory()
            .then(function(data) {
                app.categoriesView.load(selector, data);
            }, function(error) {
                console.log(error);
            })
    };

    Controller.prototype.addCategory = function() {
        if(isLoggedIn()) {
            var categoryName = $('#categoryName').val();
            var data = {'name': categoryName};
            this._model.categories.addCategory(data)
                .then(function() {
                    location.href = '#/Categories';
                }, function(error) {
                    console.log(error);
                    app.showErrorPopup.showErrorAddCategoryFailed();
                })
        }
    };

    Controller.prototype.attachEventHandlers = function (selector) {
        attachEventHandlerRegisterNewUser.call(this, selector);
        attachEventHandlerLoginUser.call(this, selector);
        attachEventHandlerLogoutUser.call(this, selector);
        attachEventHandlerShowAddAlbumView.call(this, selector);
        attachEventHandlerAddNewAlbum.call(this, selector);
        attachEventHandlerUploadImage.call(this, selector);
        attachEventHandlerShowPicture.call(this, selector);
        attachEventHandlerLoadMorePictures.call(this);
        attachEventLikeAlbum.call(this, selector);
        attachEventDislikeAlbum.call(this, selector);
        attachEventAddAlbumComment.call(this, selector);
        attachEventSelectPictureToUpload.call(this, selector);
        attachEventClearSelectedPicture.call(this, selector);
        attachEventAddPictureComment.call(this, selector);
    };

    var attachEventAddPictureComment = function attachEventAddPictureComment(selector) {
        var _this = this;

    }

    var attachEventAddAlbumComment = function attachEventAddAlbumComment(selector) {
        var _this = this;
        $(selector).on('click', '#btn-add-album-comment', function(ev) {
            var commentArea = $('#commend-area').val();
            var currentAlbumId = sessionStorage['AlbumId'];
            var comment = {"album": {"__type": "Pointer","className": "Album","objectId": currentAlbumId}, "content":commentArea};
            _this._model.comments.addComment(comment)
                .then(function(data) {
                   // console.log(data);
                }, function(error) {
                    console.log(error);
                })
                .then(function(data){
                    var condition = '?where={"album": {"__type":"Pointer", "className" : "Album", "objectId" : "' + currentAlbumId + '"}}';
                   return _this._model.comments.getAllComments(condition)
                }, function(error) {
                    console.log(error);
                })
                .then(function(album) {
                    var selector = '.comments';
                    app.showCommentsView.load(selector, album);
                }, function(err) {
                    console.log(err);
                });
            commentArea.val('');
        });
    };

    var attachEventLikeAlbum = function attachEventLikeAlbum(selector) {
        var _this = this;
        $(selector).on('click', '#btn-like-album', function(ev) {
            if ( $(this).is("span")) {
                var albumId = $(this).parent().parent().data('id');
                var likes = $(ev.target);
                var data = {"likes":{"__op":"Increment","amount":1}, "rating":{"__op":"Increment","amount":1}};
                _this._model.albums.editAlbum(data, albumId)
                    .then(function(data){
                        //console.log(data);
                        var currentLikes = likes.text();
                        likes.text(Number(currentLikes)+1);
                    }, function(error){
                        console.log(error.responseText);
                    })
            }
        })
    };

    var attachEventDislikeAlbum = function attachEventDislikeAlbum(selector) {
        var _this = this;
        $(selector).on('click', '#btn-dislike-album', function(ev) {
            if ( $(this).is("span")) {
                var albumId = $(this).parent().parent().data('id');
                var dislikes = $(ev.target);
                var data = {"dislikes":{"__op":"Increment","amount":-1}, "rating":{"__op":"Increment","amount":-1}};
                _this._model.albums.editAlbum(data, albumId)
                    .then(function(data){
                        //console.log(data);
                        var currentDislikes = dislikes.text();
                        dislikes.text(Number(currentDislikes)-1);
                    }, function(error){
                        console.log(error);
                    })
            }
        })
    };

    var attachEventHandlerLoadMorePictures = function attachEventHandlerLoadMorePictures() {
        var _this = this;
        $(document).scroll(function(){
            if (($(window).scrollTop() + 400 + $(window).height() >= $(document).height()) &&
                 $('#mainContent .image-container').length) {
                _this._model.pictures.loadMorePictures()
                    .then(function (data) {
                        app.loadMorePicturesView.load(MAIN_CONTAINER_SELECTOR, data);
                    }, function (error) {
                        console.log(error);
                    })
            }
        });
    };

    var attachEventHandlerShowPicture = function attachEventHandlerShowPicture(selector) {
        var _this = this;
        $(selector).on('click', '.albums-list > h3', function(ev) {
            var albumId = $(ev.target).data('id');
            sessionStorage.setItem('AlbumId', albumId);
            getPicturesByAlbum(_this, albumId);
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
                    console.log(error);
                });
        });
    };

    var attachEventSelectPictureToUpload = function attachEventSelectPictureToUpload(selector) {
        $(selector).on('change', '#file-select', function (input) {
            var $selectedFileInput = $('#file-select');
            var hasSelectedFile = $.trim(($selectedFileInput).val());
            var $selectedFile = $selectedFileInput.prop('files')[0];
            $('.upload-image-preview').addClass('upload-image-preview-selected').removeClass('upload-image-preview');

            if (hasSelectedFile) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    $('.upload-image-preview-selected').attr('src', e.target.result);
                };

                reader.readAsDataURL($selectedFile);
            }
        })
    };

    var attachEventClearSelectedPicture = function attachEventClearSelectedPicture(selector) {
        $(selector).on('click', '#clear-img-button', function (ev) {
            $("#file-select").val("");
            $('.upload-image-preview-selected').toggleClass('upload-image-preview-selected upload-image-preview');
            $('.upload-image-preview').attr('src', 'http://iconizer.net/files/Sabre/orig/folder_black_web_upload.png');
        })
    };

    var attachEventHandlerUploadImage = function attachEventHandlerUploadImage(selector) {
        var _this = this;

        $(selector).on('click', '#upload-button', function (ev) {
            var $selectedFileInput = $('#file-select');
            var hasSelectedFile = $.trim(($selectedFileInput).val());
            var $selectedFile = $selectedFileInput.prop('files')[0];

            if (hasSelectedFile != '') {
                var $fileName = ($selectedFileInput.val()).split('/').pop().split('\\').pop();
                var selectedAlbumId = $('select .albums:selected').data('id');
                var $imageSize = $selectedFileInput[0].files[0].size;
                var $imageTitle = $('#img-title').val();

                var $imageTags = $('#img-tags').val().split(/','/g);

                if ($imageSize < MAX_IMAGE_SIZE) {
                    _this._model.pictures.uploadPictureData($fileName, $selectedFile)
                        .then(function (data) {
                            var dataToUpload = {
                                'title': $imageTitle,
                                "picture": {
                                    "name": data.name,
                                    "__type": "File"
                                },
                                "likes": 0,
                                "dislikes": 0,
                                "tags": $imageTags,
                                "album": {"__type": "Pointer", "className": "Album", "objectId": selectedAlbumId}
                            };

                            _this._model.pictures.addPicture(JSON.stringify(dataToUpload));
                            $selectedFileInput.val('');
                            $('.upload-image-preview-selected').toggleClass('upload-image-preview-selected upload-image-preview');
                            $('.upload-image-preview').attr('src', 'http://iconizer.net/files/Sabre/orig/folder_black_web_upload.png');
                            $('#img-title').val('');
                            $('#img-tags').val('');
                        }, function (error) {
                            console.log(error.responseText);
                            app.showErrorPopup.showErrorDuringPictureUpload();
                        })
                } else {
                    app.showErrorPopup.showErrorMaximumPictureSizeExceeded();
                }
            } else {
                app.showErrorPopup.showErrorNoPictureWasSelected();
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
                    app.showErrorPopup.showErrorDuringRegister();
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
                    //console.log('Login successful');
                }, function (error) {
                    console.log('Login failed');
                    app.showErrorPopup.showInvalidUserCredentials();
                });
            username.val('');
            password.val('');
        });
    };

    var attachEventHandlerShowAddAlbumView = function attachEventHandlerShowAddAlbumView(selector) {
        var _this = this;
        $(selector).on('click', '#btn-show-add-album', function (ev) {
            location.href = '#/add-new-album';
            if (isLoggedIn()) {
                _this._model.categories.getCategory()
                    .then(function (data) {
                       // console.log(data);
                        app.showAddAlbumView.loadShowView(MAIN_CONTAINER_SELECTOR, data);
                    }, function (error) {
                        console.log(error);
                    });
            }
        });
    };

    var attachEventHandlerAddNewAlbum = function attachEventHandlerAddNewAlbum(selector) {
        var _this = this;
        $(selector).on('click', '#create-album', function (ev) {
            var albumTitle = $('#album-title');
            var selectedCategoryId = $('select .categories:selected').data('id');
            var albumData = {
                "title": albumTitle.val(),
                "likes": 0,
                "dislikes":0,
                "rating": 0,
                "category": {"__type": "Pointer", "className": "Category", "objectId": selectedCategoryId}
            };
            _this._model.albums.addAlbum(albumData)
                .then(function (data) {
                    //console.log(data);
                    console.log('Successfully added new album');
                    location.href = '#/Albums/Create-album';
                    window.location.replace('#/Albums');
                    //window.location.reload(true);
                    return data;
                }, function (error) {
                    console.log(error);
                    app.showErrorPopup.showErrorDuringAddingAlbum();
                });
        });
    };

    function getPicturesByAlbum (controller, albumId) {
        var condition = '?where={"album": {"__type":"Pointer", "className" : "Album", "objectId" : "' + albumId + '"}}';

        controller._model.pictures.getAllPicturesByAlbumId(albumId)
            .then(function(data) {
                location.href = '#/Albums/Pictures-by-album';
                //console.log(data);
                console.log('Successfully showed pictures');
                app.pictureByAlbumView.loadPictureByAlbum(MAIN_CONTAINER_SELECTOR, data);
            }, function(error){
                console.log(error);
            })
            .then(function () {
                return controller._model.comments.getAllComments(condition);
            }, function (error) {
                console.log(error);
            })
            .then(function (data) {
                var selector = '.comments';
                app.showCommentsView.load(selector, data);
            }, function (error) {
                console.log(error);
            })
            .done(function(){
                app.showErrorPopup.showErrorUnableToRetrievePictureForSelectedAlbum();
            });

    }

    function isLoggedIn() {
        if (!sessionStorage['logged-in']) {
            location.href = '#/Login';
            return false;
        }
        return true;
    }

    return {
        loadController: function (model) {
            return new Controller(model);
        }
    }
}());