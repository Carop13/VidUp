(function() {
    'use strict';
    angular
        .module('vidUpApp')
        .factory('Video', Video);

    Video.$inject = ['$resource', 'DateUtils'];

    function Video ($resource, DateUtils) {
        var resourceUrl =  'api/videos/:id';

        return $resource(resourceUrl, {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    if (data) {
                        data = angular.fromJson(data);
                        data.createdDate = DateUtils.convertLocalDateFromServer(data.createdDate);
                    }
                    return data;
                }
            },
            'update': {
                method: 'PUT',
                transformRequest: function (data) {
                    data.createdDate = DateUtils.convertLocalDateToServer(data.createdDate);
                    return angular.toJson(data);
                }
            },
            'save': {
                method: 'POST',
                transformRequest: function (data) {
                    data.createdDate = DateUtils.convertLocalDateToServer(data.createdDate);
                    return angular.toJson(data);
                }
            }
        });
    }
})();
