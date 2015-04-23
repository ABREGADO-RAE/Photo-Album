var app = app || {};

app.showLimitedImageView = (function () {
    function ShowLimitedImageView(selector, data) {
        $.get('templates/show-image-by-limit.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }

    return {
        load: function (selector, data) {
            return ShowLimitedImageView(selector, data);
        }
    }
}());
