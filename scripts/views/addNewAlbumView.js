var app = app || {};

app.addNewAlbumView = (function () {
    function AddNewAlbumView() {
        //$.get('templates/add-new-album.html', function (template) {
        //    var output = Mustache.render(template, data);
        //    $(selector).html(output);
        //});
    }

    $('#create-album').click(app.model.albums.addAlbum({ title: $('#album-title').val() }));

    return {
        load: function () {
            return AddNewAlbumView();
        }
    }
})();