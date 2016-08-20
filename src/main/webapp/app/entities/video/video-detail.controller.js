(function() {
    'use strict';

    angular
        .module('vidUpApp')
        .controller('VideoDetailController', VideoDetailController);

    VideoDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'DataUtils', 'entity', 'Video', 'User'];

    function VideoDetailController($scope, $rootScope, $stateParams, previousState, DataUtils, entity, Video, User) {
        var vm = this;

        vm.video = entity;
        vm.previousState = previousState.name;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;

        var unsubscribe = $rootScope.$on('vidUpApp:videoUpdate', function(event, result) {
            vm.video = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
