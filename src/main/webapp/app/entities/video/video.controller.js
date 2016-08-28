(function() {
    'use strict';

    angular
        .module('vidUpApp')
        .controller('VideoController', VideoController);

    VideoController.$inject = ['$scope', '$state', 'DataUtils', 'Video'];

    function VideoController ($scope, $state, DataUtils, Video) {
        var vm = this;
        
        vm.videos = [];
        vm.openFile = DataUtils.openFile;
        vm.byteSize = DataUtils.byteSize;
        vm.searchText = '';

        loadAll();

        function loadAll() {
            Video.query(function(result) {
                vm.videos = result;
            });
        }
    }
})();
