var app = app || {};

app.homeView = (function () {
    function HomeView(selector) {
        $.get('templates/home-gallery.html', function (template) {
            var output = Mustache.render(template);
            $(selector).html(output);
        });
    }

    return {
        load:function(selector) {
            return new HomeView(selector);
        }
    }
}());