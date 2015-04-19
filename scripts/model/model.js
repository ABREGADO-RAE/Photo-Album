var photoAppSpace = photoAppSpace  || {};

photoAppSpace.model = (function(){
    function Model(baseUrl){
        this._baseUrl = baseUrl;
        this.users = new User(baseUrl);
        this.albums = new Album(baseUrl);
        this.pictures = new Picture(baseUrl);
        this.comments = new Comment(baseUrl);
        this.categories = new Category(baseUrl);
    }

    var User = (function(){
        function User(baseUrl){
            this._serviceUrl = baseUrl;
        }

        User.prototype.login = function(username, password) {

        };

        User.prototype.register = function(username, password, repeatedPwrd, email) {

        };

        return User;
    }());

    var Album = (function(){
        function Album(baseUrl){
            this._serviceUrl = baseUrl + '/classes/Album';
        }

        Album.prototype.addAlbum = function(data) {

        };

        Album.prototype.getAlbums = function() {

        };

        Album.prototype.editAlbum = function(data, id) {

        };

        Album.prototype.deleteAlbum = function(id) {

        };

        return Album;
    }());

    var Picture = (function(){
        function Picture(baseUrl){
            this._serviceUrl = baseUrl + '/classes/Picture';
        }

        Picture.prototype.addPicture = function(data) {

        };

        Picture.prototype.getPicture = function() {

        };

        Picture.prototype.editPicture = function(data, id) {

        };

        Picture.prototype.deletePicture = function(id) {

        };

        return Picture;
    }());

    var Category = (function(){
        function Category(baseUrl){
            this._serviceUrl = baseUrl + '/classes/Category';
        }

        Category.prototype.addCategory = function(data) {

        };

        Category.prototype.getCategory = function() {

        };

        Category.prototype.editCategory = function(data, id) {

        };

        Category.prototype.deleteCategory = function(id) {

        };

        return Category;
    }());

    var Comment = (function(){
        function Comment(baseUrl){
            this._serviceUrl = baseUrl + '/classes/Comment';
        }

        Comment.prototype.addComment = function(data) {

        };

        Comment.prototype.getComment = function() {

        };

        Comment.prototype.editComment = function(data, id) {

        };

        Comment.prototype.deleteComment = function(id) {

        };

        return Comment;
    }());

    return {
        loadModel: function(baseUrl) {
            return new Model(baseUrl);
        }
    }
}());