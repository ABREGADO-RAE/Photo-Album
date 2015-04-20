var app = app || {};

app.albumsView = (function () {
    function AlbumsView(json) {
        $.get('templates/albums.html', function (template) {
            var output = Mustache.render(template, json);
            $('main').html(output);
            var $main = $('main');
            var selector;
            $('#login-box').remove();
            $('#register-box').remove();

            if ($main.find('#albums-box').length) {
                selector = $('#albums-box');
            } else {
                selector = $('<div>');
                selector.attr('id', 'albums-box');
                selector.appendTo($main)
            }

            $(selector).html(output);
        })
    }

    $('#addAlbum').click(app.addNewAlbumView);

    return {
        load: function (json) {
            return AlbumsView(json);
        }
    }
})();