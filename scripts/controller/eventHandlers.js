var app = app  || {};

app.eventHandlers = (function () {
    function EventHandlers(model) {
        this._model = model;
    }

    var logoutOnWindowClose = function() {
        window.close();
        this._model.logout();
    }();

    return {
        loadEventHandlers: function(model) {
            return new EventHandlers(model);
        }
    }
}());