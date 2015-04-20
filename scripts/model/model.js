var app = app  || {};

app.model = (function(){
    'use strict';
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
            return localStorage.getItem('sessionToken');
        }

        function setSessionToken(sessionToken) {
            return localStorage.setItem('sessionToken', sessionToken);
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

        User.prototype.login = function(username, password) {
            var url = this._serviceUrl + 'login?username=' + username + '&password=' + password;
            return app.ajaxRequester.getRequest(url, this._headers)
                .then(function(data){
                    Credentials.setSessionToken(data.sessionToken);
                    console.log(data);
                    return data;
                }, function(error){
                    console.log(error);
                    return error;
                });
        };

        User.prototype.register = function(username, password, repeatedPwrd, email) {
            if (assurePasswordEquality(password, repeatedPwrd)) {
                var userCredentials = {'username': username, 'password': password, 'email': email};
                var url = this._serviceUrl + 'users';
                return app.ajaxRequester.postRequest(url, this._headers, userCredentials)
                    .then(function(data){
                        Credentials.setSessionToken(data.sessionToken);
                        console.log(data);
                        return data;
                    }, function(error){
                        console.log(error);
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

        Unit.prototype.addUnit = function(url, headers, data){
            return app.ajaxRequester.postRequest(url, headers, data)
                .then(function(data){
                    console.log(data);
                }, function(error){
                    console.log(error.responseText);
                });
        };

        Unit.prototype.getUnit = function(url, headers, id){
            var deffer = Q.defer();
            var requestUrl = url;
            if(id){
                requestUrl = url + id;
            }

            app.ajaxRequester.getRequest(requestUrl, headers)
                .then(function(data){
                    console.log(data);
                    deffer.resolve(data);
                }, function(error){
                    console.log(error.responseText);
                    deffer.reject(error);
                });
            return deffer.promise;
        };

        Unit.prototype.updateUnit = function(url, headers, data, id) {
            var requestUrl = url + id;
            return app.ajaxRequester.putRequest(requestUrl, headers, data)
                .then(function(data){
                    console.log(data);
                }, function(error){
                    console.log(error.responseText);
                });
        };

        Unit.prototype.deleteUnit = function(url, headers, id) {
            var requestUrl = url + id;
            return app.ajaxRequester.deleteRequest(requestUrl, headers)
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
            this._serviceUrl = baseUrl + 'classes/Album/';
            this._headers = Credentials.getHeaders();
            this._unit = new Unit();
        }

        Album.prototype.addAlbum = function(data) {
            return this._unit.addUnit(this.serviceUrl, this._headers, data);
        };

        Album.prototype.getAlbums = function(id) {
            return this._unit.getUnit(this._serviceUrl, this._headers, id)
        };

        Album.prototype.editAlbum = function(data, id) {
            return this._unit.updateUnit(this._serviceUrl, this._headers, data, id);
        };

        Album.prototype.deleteAlbum = function(id) {
            return this._unit.deleteUnit(this._serviceUrl, this._headers, id);
        };

        return Album;
    }());

    var Picture = (function(){
        function Picture(baseUrl){
            this._serviceUrl = baseUrl + 'classes/Picture/';
            this._headers = Credentials.getHeaders();
            this._unit = new Unit();
        }

        Picture.prototype.addPicture = function(data) {
            return this._unit.addUnit(this._serviceUrl, this._headers, data);
        };

        Picture.prototype.getPicture = function(id) {
            return this._unit.getUnit(this._serviceUrl, this._headers, id);
        };

        Picture.prototype.editPicture = function(data, id) {
            return this._unit.updateUnit(this._serviceUrl, this._headers, data, id);
        };

        Picture.prototype.deletePicture = function(id) {
            return this._unit.deleteUnit(this._serviceUrl, this._headers, id);
        };

        return Picture;
    }());

    var Category = (function(){
        function Category(baseUrl){
            this._serviceUrl = baseUrl + 'classes/Category/';
            this._headers = Credentials.getHeaders();
        }

        Category.prototype.addCategory = function(data) {
            return this._unit.addUnit(this._serviceUrl, this._headers, data);
        };

        Category.prototype.getCategory = function(id) {
            return this._unit.getUnit(this._serviceUrl, this._headers, id);
        };

        Category.prototype.editCategory = function(data, id) {
            return this._unit.updateUnit(this._serviceUrl, this._headers, data, id);
        };

        Category.prototype.deleteCategory = function(id) {
            return this._unit.deleteUnit(this._serviceUrl, this._headers, id);
        };

        return Category;
    }());

    var Comment = (function(){
        function Comment(baseUrl){
            this._serviceUrl = baseUrl + 'classes/Comment/';
            this._headers = Credentials.getHeaders();
        }

        Comment.prototype.addComment = function(data) {
            return this._unit.addUnit(this._serviceUrl, this._headers, data);
        };

        Comment.prototype.getComment = function(id) {
            return this._unit.getUnit(this._serviceUrl, this._headers, id);
        };

        Comment.prototype.editComment = function(data, id) {
            return this._unit.updateUnit(this._serviceUrl, this._headers, data, id);
        };

        Comment.prototype.deleteComment = function(id) {
            return this._unit.deleteUnit(this._serviceUrl, this._headers, id);
        };

        return Comment;
    }());

    return {
        loadModel: function(baseUrl) {
            return new Model(baseUrl);
        }
    }
}());