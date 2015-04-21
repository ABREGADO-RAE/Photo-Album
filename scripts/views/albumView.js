var app = app || {};

app.albumsView = (function () {
    function AlbumsView(selector, data) {
        $.get('templates/albums.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }

    return {
        load: function (selector, data) {
            return AlbumsView(selector, data);
        }
    }
})();