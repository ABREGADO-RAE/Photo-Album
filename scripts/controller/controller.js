var app = app  || {};

app.controller = (function(){
    'use strict';
    function Controller(model){
        this._model = model;
    }

    Controller.prototype.getLoginPage = function(selector) {
        app.loginView.load(selector);
    };

    Controller.prototype.getRegisterPage = function(selector) {
        app.registerView.load(selector);
    };

    Controller.prototype.getHomePage = function(selector) {
        app.homeView.load(selector);
    };

    Controller.prototype.getAlbumPage = function (selector) {
        this._model.albums.getAlbums()
            .then(function(data){
                app.albumsView.load(selector, data)
            }, function(error) {
            console.log(error);
        })
    };

    Controller.prototype.attachEventHandlers = function(selector) {
        attachEventHandlerRegisterNewUser.call(this, selector);
        attachEventHandlerLoginUser.call(this, selector);
        attachEventHandlerShowAddAlbumView.call(this, selector);
        attachEventHandlerAddNewAlbum.call(this, selector);
    };

    var attachEventHandlerRegisterNewUser = function attachEventHandlerRegisterNewUser(selector) {
        var _this = this;
        $(selector).on('click', '#reg-button', function(ev){
            var username = $('#reg-username');
            var password = $('#reg-password');
            var repeatPassword = $('#repeat-password');
            var email = $('#email');
            _this._model.users.register(username.val(), password.val(), repeatPassword.val(), email.val())
                .then(function(data) {
                    console.log(data);
                }, function(error) {
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
        $(selector).on('click', '#login-button', function(ev){
            var username = $('#login-username');
            var password = $('#login-password');
            _this._model.users.login(username.val(), password.val())
                .then(function(data) {
                    console.log('Login successful');
                }, function(error){
                    console.log('Login failed');
                });
            username.val('');
            password.val('');
        });
    };

    var attachEventHandlerShowAddAlbumView = function attachEventHandlerShowAddAlbumView(selector) {
        var _this = this;
        $(selector).on('click', '#btn-show-add-album', function(ev){
            _this._model.categories.getCategory()
                .then(function(data){
                    console.log(data);
                    app.showAddAlbumView.loadShowView(selector, data);
                }, function(error) {
                    console.log(error);
                });
        });
    };

    var attachEventHandlerAddNewAlbum = function attachEventHandlerAddNewAlbum(selector) {
        var _this = this;
        $(selector).on('click', '#create-album', function(ev) {
            var albumTitle = $('#album-title');
            var selectedCategoryId = $('select .categories:selected').data('id');
            var albumData = {"title": albumTitle.val(), "category":{"__type":"Pointer","className":"Category","objectId":selectedCategoryId}};
            _this._model.albums.addAlbum(albumData)
                .then(function(data){
                    console.log(data);
                    console.log('Successfully added new album');
                    window.location.replace('#/Albums');
                    window.location.reload(true);
                    return data;
                }, function(error) {
                    console.log(error);
                });
        });
    };

    return {
        loadController: function(model) {
            return new Controller(model);
        }
    }
}());