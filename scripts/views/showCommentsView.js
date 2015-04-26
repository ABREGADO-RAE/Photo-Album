var app = app || {};

app.showCommentsView = (function () {
    function ShowCommentsView(selector, data) {
        $.get('templates/show-comments.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }

    return {
        load: function (selector, data) {
            return ShowCommentsView(selector, data);
        }
    }
}());
