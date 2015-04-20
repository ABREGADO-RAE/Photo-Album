var app = app  || {};

app.controller = (function(){
    'use strict';
    function Controller(model){
        this._model = model;
    }

    Controller.prototype.getLoginPage = function() {
        app.loginView.load();
    };

    Controller.prototype.getRegisterPage = function() {
        app.registerView.load();
    };

    Controller.prototype.attachEventHandlers = function(selector) {
        attachEventHandlerRegisterNewUser.call(this, selector);
        attachEventHandlerLoginUser.call(this, selector);
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

    return {
        loadController: function(model) {
            return new Controller(model);
        }
    }
}());