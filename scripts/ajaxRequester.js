var PhotoAppSpace = PhotoAppSpace  || {};

PhotoAppSpace.ajaxRequester = (function () {
    'use strict';
    var headers = {
        "X-Parse-Application-Id": "HdOp9MTDbFyibXNxEV9eTLCDmLpHAKarj7CJ8EkF",
        "X-Parse-REST-API-Key": "8fugchnAdU25Qs8vLVigbO8kjxaS2JgAOExIXmRy"
    };

    function makeRequest(method, url, data, success, error) {
        return $.ajax({
            method: method,
            headers: headers,
            url: url,
            data: JSON.stringify(data),
            contentType: 'application/json',
            success: success,
            error: error
        });
    }

    function getRequest(url, success, error) {
        makeRequest('GET', url, null, success, error);
    }

    function postRequest(url, data, success, error) {
        makeRequest('POST', url, data, success, error);
    }

    function putRequest(url, data, success, error) {
        makeRequest('PUT', url, data, success, error);
    }

    function deleteRequest(url, success, error) {
        makeRequest('DELETE', url,null, success, error);
    }

    return {
        getRequest: getRequest,
        postRequest: postRequest,
        putRequest: putRequest,
        deleteRequest: deleteRequest
    }
}());