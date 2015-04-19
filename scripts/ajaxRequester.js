var photoAppSpace = photoAppSpace  || {};

photoAppSpace.ajaxRequester = (function () {
    'use strict';
    function AjaxRequester() {
        this.get = getRequest();
        this.post = postRequest();
        this.put = putRequest();
        this.delete = deleteRequest();
    }

    function makeRequest(method, url, headers, data) {
        var defer = Q.defer();

        $.ajax({
            method: method,
            url: url,
            headers: headers,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: function ajaxSuccess(success) {
                defer.resolve(success);
            },
            error: function ajaxError(error) {
                defer.reject(error);
            }
        });

        return defer.promise;
    }

    function getRequest(url, headers) {
        return makeRequest('GET', url, headers, null);
    }

    function postRequest(url, headers, data) {
        return makeRequest('POST', url, headers, data);
    }

    function putRequest(url, headers, data) {
        return makeRequest('PUT', url, headers, data);
    }

    function deleteRequest(url, headers) {
        return makeRequest('DELETE', url, headers, null);
    }

//    return {
//        getRequest: getRequest,
//        postRequest: postRequest,
//        putRequest: putRequest,
//        deleteRequest: deleteRequest
//    }

    return {
        initAjax: function(){
            return new AjaxRequester();
        }
    }
}());