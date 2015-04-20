var app = app || {};

(function () {
    'use strict';
    var rootUrl = 'https://api.parse.com/1/';
    var selector = '#mainContent';
    var model = app.model.loadModel(rootUrl);
    var controller = app.controller.loadController(model);
    controller.attachEventHandlers(selector);

    app.router = Sammy(function () {
        this.get('#/', function () {
            controller.getHomePage(selector);
        });

        this.get('#/Albums', function () {
            controller.getAlbumPage(selector);
        });

        this.get('#/Login', function () {
            controller.getLoginPage(selector);
        });

        this.get('#/Register', function () {
            controller.getRegisterPage(selector);
        });
    });

    app.router.run('#/');
}());