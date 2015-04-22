var app = app || {};

app.uploadImageView = (function () {
    function UploadImageView(selector, data) {
        $.get('templates/upload-image.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }

    return {
        load: function(selector, data) {
            return UploadImageView(selector, data);
        }
    }
}());