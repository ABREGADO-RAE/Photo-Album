var app = app || {};

app.loginView = (function () {
    function LoginView() {
        $.get('templates/login.html', function (template) {
            var output = Mustache.render(template);
            var $main = $('main');
           
            if ($main.find('#login-box').length) {
                selector = $('#login-box');
            } else {
                selector = $('<div>');
                selector.attr('id', 'login-box');
                selector.appendTo($main)
            }

            $(selector).html(output);
        })
    }

    return {
        load: function () {
            return LoginView();
        }
    }
})();