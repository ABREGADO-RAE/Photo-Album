var app = app || {};

app.albumsView = (function () {
    function AlbumsView(json) {
        $.get('templates/albums.html', function (template) {
            var output = Mustache.render(template, json);
            $('main').html(output);
        })
    }

    $('#addAlbum').click(app.addNewAlbumView);

    return {
        load: function (json) {
            return AlbumsView(json);
        }
    }
})();