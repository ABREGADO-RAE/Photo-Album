var app = app || {};

app.loggedInHomeView = (function () {
    function LoggedInHomeView(selector, data) {
        $.get('templates/logged-in-view.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }

    return {
        load:function(selector, data) {
            return new LoggedInHomeView(selector, data);
        }
    }
}());