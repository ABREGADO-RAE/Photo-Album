var app = app || {};

app.pictureByAlbumView = (function () {
    function PictureByAlbum(selector, data) {
        $.get('templates/picture-by-album-view.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }

    return {
        loadPictureByAlbum: function(selector, data) {
            return PictureByAlbum(selector, data);
        }
    }
}());