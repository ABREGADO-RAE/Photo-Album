var app = app || {};

app.categoriesView = (function () {
    function renderCategoriesView(selector, data) {
        $.get('templates/categories.html', function (template) {
            var output = Mustache.render(template, data);
            $(selector).html(output);
        });
    }

    return {
        load: function (selector, data) {
            return renderCategoriesView(selector, data);
        }
    }
})();