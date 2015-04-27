var app = app || {};

(function () {
    'use strict';
    var rootUrl = 'https://api.parse.com/1/';
    var selector = '#mainContent';
    var model = app.model.loadModel(rootUrl);
    //var eventHandlers = app.eventHandlers.loadEventHandlers(model);
    var controller = app.controller.loadController(model);
    controller.attachEventHandlers(selector);

    app.router = Sammy(function () {
        this.before(function() {
            if(sessionStorage['logged-in']) {
                var _selector = $('#container header');
                controller.getLoggedInHomeView(_selector);
            }
        });

        this.get('#/', function () {
            controller.getHomePage(selector);
        });

        this.get('#/Albums', function () {
            controller.getAlbumPage(selector);
        });

        this.get('#/Albums/Create-album', function () {
            this.redirect('#/Albums');
        });

        this.get('#/Albums/Pictures-by-album', function () {
            controller.getPicturesByAlbumPage();
        });

        this.get('#/Login', function () {
            controller.getLoginPage(selector);
        });

        this.get('#/Register', function () {
            controller.getRegisterPage(selector);
        });

        this.get('#/Latest', function () {
            controller.getLatestPhotosPage(selector);
        });

        this.get('#/Random', function () {
        });

        this.get('#/Upload', function () {
            controller.getUploadPage(selector);
        });

        this.get('#/Comments', function () {
        });

        this.get('#/logged-in-view', function() {
            location.href = '#/';
        })
    });

    app.router.run('#/');
}());