var photoAppSpace = photoAppSpace  || {};

(function () {
    'use strict';
    var rootUrl = 'https://api.parse.com/1/';
    var selector = '#container';
    var model = photoAppSpace.model.loadModel(rootUrl);
    var controller = photoAppSpace.controller.loadController(model);
    controller.attachEventHandlers(selector);
}());