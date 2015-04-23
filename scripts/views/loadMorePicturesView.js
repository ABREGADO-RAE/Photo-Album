var app = app || {};

app.loadMorePicturesView = (function () {
    function LoadMorePicturesView(selector, data) {
        $.get('templates/load-more-pictures.html', function (template) {
            var output = Mustache.render(template, data);
            var $picturesToAppend = $.parseHTML(output);
            $('.image-container').append($picturesToAppend);
        });
    }

    return {
        load: function(selector, data) {
            return LoadMorePicturesView(selector, data);
        }
    }
}());


//var newContent = $('<section>').html(output);
//console.log('problemche');
//selector.append(newContent);

//'#mainContent .image-container').length
//$(selector).replaceWith(selector.html() + output)