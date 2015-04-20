var app = app || {};

(function () {
    'use strict';
    var rootUrl = 'https://api.parse.com/1/';
    var selector = '#container';
    var model = app.model.loadModel(rootUrl);
    var controller = app.controller.loadController(model);
    controller.attachEventHandlers(selector);

    app.router = Sammy(function () {
        this.get('#/', function () {
            controller.getRegisterPage();
            controller.getLoginPage();
        });

        this.get('#/Albums', function () {
            controller.getAlbumPage();
        })
    });

    app.router.run('#/');
}());