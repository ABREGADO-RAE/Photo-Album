var app = app  || {};

app.ajaxRequester = (function () {
    'use strict';
    function makeRequest(method, url, headers, data, contentType) {
        var defer = Q.defer();

        $.ajax({
            method: method,
            url: url,
            headers: headers,
            processData: false,
            data: data,
            contentType: contentType,
            success: function (data) {
                defer.resolve(data);
            },
            error: function (error) {
                defer.reject(error);
            }
        });

        return defer.promise;
    }

    function getRequest(url, headers, contentType) {
        return makeRequest('GET', url, headers, null, contentType);
    }

    function postRequest(url, headers, data, contentType) {
        return makeRequest('POST', url, headers, data, contentType);
    }

    function putRequest(url, headers, data, contentType) {
        return makeRequest('PUT', url, headers, data, contentType);
    }

    function deleteRequest(url, headers, contentType) {
        return makeRequest('DELETE', url, headers, null, contentType);
    }

    return {
        getRequest: getRequest,
        postRequest: postRequest,
        putRequest: putRequest,
        deleteRequest: deleteRequest
    };
}());