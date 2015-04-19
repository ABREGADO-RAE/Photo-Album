var photoAppSpace = photoAppSpace  || {};

photoAppSpace.controller = (function(){
    function Controller(model){
        this._model = model;
    }

    Controller.prototype.getLoginPage = function() {

    };

    Controller.prototype.getRegisterPage = function() {

    };

    Controller.prototype.attachEventHandlers = function() {

    };

    return {
        loadController: function(model) {
            return new Controller(model);
        }
    }
}());