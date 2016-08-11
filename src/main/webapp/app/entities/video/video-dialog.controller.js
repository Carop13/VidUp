(function() {
    'use strict';

    angular
        .module('vidUpApp')
        .controller('VideoDialogController', VideoDialogController);

    VideoDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Video', 'User'];

    function VideoDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Video, User) {
        var vm = this;

        vm.video = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.users = User.query();
        vm.setImage = setImage;
        

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.video.id !== null) {
                console.log(vm.video);
                Video.update(vm.video, onSaveSuccess, onSaveError);
            } else {
                Video.save(vm.video, onSaveSuccess, onSaveError);
            }
        }

        function onSaveSuccess (result) {
            $scope.$emit('vidUpApp:videoUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.createdDate = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }

     
     function setImage ($files, video) {
         if ($files[0]) {
             var file = $files[0];
             var fileReader = new FileReader();
             fileReader.readAsDataURL(file);
             fileReader.onload = function (e) {
                 var data = e.target.result;
                 var base64Data = data.substr(data.indexOf('base64,') + 'base64,'.length);
                 $scope.$apply(function() {
                     video.image = base64Data;
                 });
             };
         }
     };
    }
})();
