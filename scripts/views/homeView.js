var app = app || {};

app.homeView = (function () {
    function HomeView(selector, data) {
        $.get('templates/home-gallery.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }

    return {
        load:function(selector, data) {
            return new HomeView(selector, data);
        }
    }
}());