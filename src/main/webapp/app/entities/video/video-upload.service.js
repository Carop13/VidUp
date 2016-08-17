/**
 * Created by CaroP on 8/12/16.
 */
(function() {
  'use strict';
  angular
    .module('vidUpApp')
    .factory('VideoUpload', VideoUpload);

  VideoUpload.$inject = ['$http', 'DateUtils', '$resource'];

  function VideoUpload ($http, DateUtils, $resource) {
   // var resourceUrl =  '/api/videosUpload?videoId=:videoId&caption=:caption';

    return $resource('api/videosUpload?videoId=:videoId&caption=:caption', {videoId: '@videoId', caption: '@caption'}, {
      'save': {
        method: 'POST',
        headers:{
          'Content-Type': 'multipart/form-data',
          'Accept': '*/*'
        }
      }
    });

    /*function postVideo(data){
      console.log(data);
      var params = '?videoId=' + data.videoId;
      params += '&caption=' + data.caption;
      console.log(resourceUrl + params);
      console.log(data);
      return $http.post(resourceUrl + params, data).then(function (response) {
        console.log(response);
          return response;
        }, function(error){
          return error;
        });
    }

    return {
      'postVideo': postVideo
    };*/

  }
})();
