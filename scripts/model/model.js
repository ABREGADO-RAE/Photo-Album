var app = app  || {};

app.model = (function(){
    'use strict';
    var IMAGE_CONTENT_TYPE = 'image/jpeg';
    var JSON_CONTENT_TYPE = 'application/json';

    function Model(baseUrl){
        this._baseUrl = baseUrl;
        this.users = new User(baseUrl);
        this.albums = new Album(baseUrl);
        this.pictures = new Picture(baseUrl);
        this.comments = new Comment(baseUrl);
        this.categories = new Category(baseUrl);
    }

    var Credentials = (function () {
        var headers = {
            "X-Parse-Application-Id": "HdOp9MTDbFyibXNxEV9eTLCDmLpHAKarj7CJ8EkF",
            "X-Parse-REST-API-Key": "8fugchnAdU25Qs8vLVigbO8kjxaS2JgAOExIXmRy",
            "X-Parse-Session-Token": getSessionToken()
        };

        function getHeaders() {
            return headers;
        }

        function getSessionToken(){
            return sessionStorage.getItem('sessionToken');
        }

        function setSessionToken(sessionToken) {
            return sessionStorage.setItem('sessionToken', sessionToken);
        }

        return {
            getHeaders: getHeaders,
            getSessionToken: getSessionToken,
            setSessionToken: setSessionToken
        }
    }());


    var User = (function(){
        function User(baseUrl){
            this._serviceUrl = baseUrl;
            this._headers = Credentials.getHeaders();
        }

        User.prototype.logout = function () {
            this._headers = Credentials.getHeaders();
            var _this = this;
            var url = 'https://api.parse.com/1/logout';
            return app.ajaxRequester.postRequest(url, this._headers, JSON.stringify({}), JSON_CONTENT_TYPE)
                .then(function () {
                    sessionStorage.clear();
                }, function (error) {
                    console.log(error.responseText);
                })
        };

        User.prototype.login = function(username, password) {
            var url = this._serviceUrl + 'login?username=' + username + '&password=' + password;
            var _this = this;
            return app.ajaxRequester.getRequest(url, this._headers, JSON_CONTENT_TYPE)
                .then(function(data){
                    Credentials.setSessionToken(data.sessionToken);
                    _this._headers['X-Parse-Session-Token'] = data.sessionToken;
                    sessionStorage['logged-in'] = true;
                    //_this.logout();
                    console.log(data);
                    return data;
                }, function(error){
                    console.log(error.responseText);
                    return error;
                });
        };

        User.prototype.register = function(username, password, repeatedPwrd, email) {
            if (assurePasswordEquality(password, repeatedPwrd)) {
                var userCredentials = {'username': username, 'password': password, 'email': email};
                var url = this._serviceUrl + 'users';
                return app.ajaxRequester.postRequest(url, this._headers, JSON.stringify(userCredentials), JSON_CONTENT_TYPE)
                    .then(function(data){
                        Credentials.setSessionToken(data.sessionToken);
                        sessionStorage['logged-in'] = true;
                        console.log(data);
                        return data;
                    }, function(error){
                        console.log(error.responseText);
                        return error;
                    });
            } else {
                alert('Passwords does not match!');     // Add noty popup later
            }
        };

        function assurePasswordEquality(password, repeatPassword) {
            return password === repeatPassword;
        }

        return User;
    }());

    var Unit = (function(){
        function Unit() {

        }

        Unit.prototype.addUnit = function(url, headers, data, contentType){
            return app.ajaxRequester.postRequest(url, headers, data, contentType)
                .then(function(data){
                    console.log(data);
                    return data;
                }, function(error){
                    console.log(error.responseText);
                    return error;
                });
        };

        Unit.prototype.getUnit = function(url, headers, id, contentType){
            var deffer = Q.defer();
            var requestUrl = url;
            if(id){
                requestUrl = url + id;
            }

            app.ajaxRequester.getRequest(requestUrl, headers, contentType)
                .then(function(data){
                    console.log(data);
                    deffer.resolve(data);
                    return data;
                }, function(error){
                    console.log(error.responseText);
                    deffer.reject(error);
                });
            return deffer.promise;
        };

        Unit.prototype.updateUnit = function(url, headers, data, contentType) {
            return app.ajaxRequester.putRequest(url, headers, data, contentType)
                .then(function(data){
                    console.log(data);
                    return data;
                }, function(error){
                    console.log(error.responseText);
                    return error;
                });
        };

        Unit.prototype.deleteUnit = function(url, headers, id, contentType) {
            var requestUrl = url + id;
            return app.ajaxRequester.deleteRequest(requestUrl, headers, contentType)
                .then(function(data){
                    console.log(data);
                }, function(error){
                    console.log(error.responseText);
                });
        };
        return Unit;
    }());

    var Album = (function(){
        function Album(baseUrl){
            this._serviceUrl = baseUrl + 'classes/Album';
            this._headers = Credentials.getHeaders();
            this._unit = new Unit();
        }

        Album.prototype.addAlbum = function(data) {
            return this._unit.addUnit(this._serviceUrl, this._headers, JSON.stringify(data), JSON_CONTENT_TYPE);
        };

        Album.prototype.getAlbums = function() {
            return this._unit.getUnit(this._serviceUrl, this._headers, null, JSON_CONTENT_TYPE)
        };

        Album.prototype.getAlbumById = function(id) {
            //return this._unit.getUnit(this._serviceUrl, this._headers, id, JSON_CONTENT_TYPE)
        };

        Album.prototype.editAlbum = function(data, id) {
            var url = this._serviceUrl + '/' + id;
            return this._unit.updateUnit(url, this._headers, JSON.stringify(data), JSON_CONTENT_TYPE)
                .then(function(data){
                    console.log(data);
                    return data;
                }, function(error){
                    console.log(error.responseText);
                });
        };

        Album.prototype.deleteAlbum = function(id) {
            return this._unit.deleteUnit(this._serviceUrl, this._headers, id, JSON_CONTENT_TYPE);
        };

        return Album;
    }());

    var Picture = (function(){
        function Picture(baseUrl){
            this._serviceUrl = baseUrl + 'classes/Picture';
            this._uploadDataServiceUrl = baseUrl + 'files/';
            this._headers = Credentials.getHeaders();
            this._unit = new Unit();
        }

        Picture.prototype.addPicture = function(data) {
            return this._unit.addUnit(this._serviceUrl, this._headers, data, JSON_CONTENT_TYPE);
        };

        Picture.prototype.uploadPictureData = function (fileName, file) {
            var url = this._uploadDataServiceUrl + fileName;
            return this._unit.addUnit(url, this._headers, file, IMAGE_CONTENT_TYPE);
        };

        Picture.prototype.getPictureById = function(id) {
            return this._unit.getUnit(this._serviceUrl, this._headers, id,IMAGE_CONTENT_TYPE);
        };

        Picture.prototype.getPhotosByLimit = function (limit) {
            var url = this._serviceUrl + '?order=-createdAt&limit=' + limit;
            return this._unit.getUnit(url, this._headers, null, IMAGE_CONTENT_TYPE);
        };

        Picture.prototype.editPicture = function(data, id) {
            return this._unit.updateUnit(this._serviceUrl, this._headers, data, id,IMAGE_CONTENT_TYPE);
        };

        Picture.prototype.deletePicture = function(id) {
            return this._unit.deleteUnit(this._serviceUrl, this._headers, id, IMAGE_CONTENT_TYPE);
        };

        return Picture;
    }());

    var Category = (function(){
        function Category(baseUrl){
            this._serviceUrl = baseUrl + 'classes/Category';
            this._headers = Credentials.getHeaders();
            this._unit = new Unit();
        }

        Category.prototype.addCategory = function(data) {
            return this._unit.addUnit(this._serviceUrl, this._headers, JSON.stringify(data), JSON_CONTENT_TYPE);
        };

        Category.prototype.getCategory = function(id) {
            return this._unit.getUnit(this._serviceUrl, this._headers, id, JSON_CONTENT_TYPE);
        };

        Category.prototype.editCategory = function(data, id) {
            return this._unit.updateUnit(this._serviceUrl, this._headers, JSON.stringify(data), id, JSON_CONTENT_TYPE);
        };

        Category.prototype.deleteCategory = function(id) {
            return this._unit.deleteUnit(this._serviceUrl, this._headers, id, JSON_CONTENT_TYPE);
        };

        return Category;
    }());

    var Comment = (function(){
        function Comment(baseUrl){
            this._serviceUrl = baseUrl + 'classes/Comment';
            this._headers = Credentials.getHeaders();
        }

        Comment.prototype.addComment = function(data) {
            return this._unit.addUnit(this._serviceUrl, this._headers, JSON.stringify(data), JSON_CONTENT_TYPE);
        };

        Comment.prototype.getComment = function(id) {
            return this._unit.getUnit(this._serviceUrl, this._headers, id, JSON_CONTENT_TYPE);
        };

        Comment.prototype.editComment = function(data, id) {
            return this._unit.updateUnit(this._serviceUrl, this._headers, JSON.stringify(data), id, JSON_CONTENT_TYPE);
        };

        Comment.prototype.deleteComment = function(id) {
            return this._unit.deleteUnit(this._serviceUrl, this._headers, id, JSON_CONTENT_TYPE);
        };

        return Comment;
    }());

    return {
        loadModel: function(baseUrl) {
            return new Model(baseUrl);
        }
    }
}());