var app = app || {};

app.registerView = (function () {
    function RegisterView() {
        $.get('templates/register.html', function (template) {
            var output = Mustache.render(template);
            var $main = $('main');
            var selector = $('<div>');
            selector.attr('id', 'register-box');
            selector.appendTo($main);

            $(selector).html(output);
        })
    }

    return {
        load: function () {
            return RegisterView();
        }
    }
})();