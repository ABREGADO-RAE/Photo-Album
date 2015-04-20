var app = app || {};

app.addNewAlbumView = (function () {
    function AddNewAlbumView() {
        $.get('templates/add-new-album.html', function (template) {
            app.model.categories.getCategory()
                .then(function (data) {
                    var output = Mustache.render(template, data);
                    $('main').html(output);
                }, function (error) {
                    console.log(error);
                })
        })
    }

    $('#create-album').click(app.model.albums.addAlbum({ title: $('#album-title').val() }));

    return {
        load: function () {
            return AddNewAlbumView();
        }
    }
})();