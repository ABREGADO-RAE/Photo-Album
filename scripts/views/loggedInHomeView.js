var app = app || {};

app.loggedInHomeView = (function () {
    function LoggedInHomeView(selector, data, controller) {
        $.get('templates/logged-in-view.html', function (template) {
            if (!data) {
                data = {
                    username: sessionStorage['currentUserName']
                }
            }
            var output = Mustache.render(template, data);
            $(selector).html(output);
            $('#login-box').hide();
        })
            .then(function(data) {
                controller.attachEventHandlers(selector);
            });
    }

    return {
        load:function(selector, data, controller) {
            return new LoggedInHomeView(selector, data, controller);
        }
    }
}());