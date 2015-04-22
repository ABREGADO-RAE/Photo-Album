var app = app || {};

app.loggedInHomeView = (function () {
    function LoggedInHomeView(selector) {
        $.get('templates/logged-in-view.html', function (template) {
            var output = Mustache.render(template);
            $(selector).html(output);
        });
    }

    return {
        load:function(selector) {
            return new LoggedInHomeView(selector);
        }
    }
}());