var app = app || {};

app.showAddAlbumView = (function () {
    function ShowAddAlbumView(selector, data) {
        $.get('templates/add-new-album.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }

    return {
        loadShowView: function(selector, data) {
            return ShowAddAlbumView(selector, data);
        }
    }
}());