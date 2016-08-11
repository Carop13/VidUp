(function() {
    'use strict';

    angular
        .module('vidUpApp')
        .controller('VideoDetailController', VideoDetailController);

    VideoDetailController.$inject = ['$scope', '$rootScope', '$stateParams', 'previousState', 'entity', 'Video', 'User'];

    function VideoDetailController($scope, $rootScope, $stateParams, previousState, entity, Video, User) {
        var vm = this;

        vm.video = entity;
        vm.previousState = previousState.name;

        var unsubscribe = $rootScope.$on('vidUpApp:videoUpdate', function(event, result) {
            vm.video = result;
        });
        $scope.$on('$destroy', unsubscribe);
    }
})();
