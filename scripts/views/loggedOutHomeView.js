var app = app || {};

app.loggedOutHomeView = (function () {
    function LoggedOutHomeView(selector) {
        $.get('templates/logged-out-view.html', function (template) {
            var output = Mustache.render(template);
            $(selector).html('');
            $(selector).html(output);
        });
    }

    return {
        load:function(selector) {
            return new LoggedOutHomeView(selector);
        }
    }
}());