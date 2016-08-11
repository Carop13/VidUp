(function() {
    'use strict';

    angular
        .module('vidUpApp')
        .controller('VideoController', VideoController);

    VideoController.$inject = ['$scope', '$state', 'Video', 'ParseLinks', 'AlertService', 'pagingParams', 'paginationConstants'];

    function VideoController ($scope, $state, Video, ParseLinks, AlertService, pagingParams, paginationConstants) {
        var vm = this;
        
        vm.loadPage = loadPage;
        vm.predicate = pagingParams.predicate;
        vm.reverse = pagingParams.ascending;
        vm.transition = transition;
        vm.itemsPerPage = paginationConstants.itemsPerPage;
        /*vm.abbreviate = abbreviate;
        vm.byteSize = byteSize;
        vm.setImage = setImage;*/

        loadAll();

        function loadAll () {
            Video.query({
                page: pagingParams.page - 1,
                size: vm.itemsPerPage,
                sort: sort()
            }, onSuccess, onError);
            function sort() {
                var result = [vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc')];
                if (vm.predicate !== 'id') {
                    result.push('id');
                }
                return result;
            }
            function onSuccess(data, headers) {
                vm.links = ParseLinks.parse(headers('link'));
                vm.totalItems = headers('X-Total-Count');
                vm.queryCount = vm.totalItems;
                vm.videos = data;
                vm.page = pagingParams.page;
            }
            function onError(error) {
                AlertService.error(error.data.message);
            }
        }

        function loadPage (page) {
            vm.page = page;
            vm.transition();
        }

        function transition () {
            $state.transitionTo($state.$current, {
                page: vm.page,
                sort: vm.predicate + ',' + (vm.reverse ? 'asc' : 'desc'),
                search: vm.currentSearch
            });
        }

    // function abbreviate (text) {
    //      if (!angular.isString(text)) {
    //          return '';
    //      }
    //      if (text.length < 30) {
    //          return text;
    //      }
    //      return text ? (text.substring(0, 15) + '...' + text.slice(-10)) : '';
    //  };

    //  function byteSize (base64String) {
    //      if (!angular.isString(base64String)) {
    //          return '';
    //      }
    //      function endsWith(suffix, str) {
    //          return str.indexOf(suffix, str.length - suffix.length) !== -1;
    //      }
    //      function paddingSize(base64String) {
    //          if (endsWith('==', base64String)) {
    //              return 2;
    //          }
    //          if (endsWith('=', base64String)) {
    //              return 1;
    //          }
    //          return 0;
    //      }
    //      function size(base64String) {
    //          return base64String.length / 4 * 3 - paddingSize(base64String);
    //      }
    //      function formatAsBytes(size) {
    //          return size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " bytes";
    //      }

    //      return formatAsBytes(size(base64String));
    //  };
     
    //  function setImage ($files, adoption) {
    //      if ($files[0]) {
    //          var file = $files[0];
    //          var fileReader = new FileReader();
    //          fileReader.readAsDataURL(file);
    //          fileReader.onload = function (e) {
    //              var data = e.target.result;
    //              var base64Data = data.substr(data.indexOf('base64,') + 'base64,'.length);
    //              $scope.$apply(function() {
    //                  adoption.image = base64Data;
    //              });
    //          };
    //      }
    //  };
    }
})();
