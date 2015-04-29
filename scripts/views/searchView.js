var app = app || {};

app.searchView = (function () {
    function SearchView(selector, data) {
        $.get('templates/search.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
            if (!data.albums.length) {
                $('.page-title').text('Sorry, no wallpapers found!');
            }
        });
    }

    return {
        load: function (selector, data) {
            return SearchView(selector, data);
        }
    }
})();