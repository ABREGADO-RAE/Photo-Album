var app = app || {};

app.albumsByCategoryView = (function () {
    function AlbumsByCategoryView(selector, data) {
        $.get('templates/albums-by-category.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }

    return {
        load: function(selector, data) {
            return AlbumsByCategoryView(selector, data);
        }
    }
}());