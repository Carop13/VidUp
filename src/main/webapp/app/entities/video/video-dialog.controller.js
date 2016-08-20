(function() {
    'use strict';

    angular
        .module('vidUpApp')
        .controller('VideoDialogController', VideoDialogController);

    VideoDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'DataUtils', 'entity', 'Video', 'User', 'Account'];

    function VideoDialogController ($timeout, $scope, $stateParams, $uibModalInstance, DataUtils, entity, Video, User, Account) {
        var vm = this;

        vm.video = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.byteSize = DataUtils.byteSize;
        vm.openFile = DataUtils.openFile;
        vm.save = save;
        Account.get(function(result){
            User.get({login: result.data.login}, function(result){
                vm.video.user = result;
            })
        })

        $timeout(function (){
            angular.element('.form-group:eq(1)>input').focus();
        });

        function clear () {
            $uibModalInstance.dismiss('cancel');
        }

        function save () {
            vm.isSaving = true;
            if (vm.video.id !== null) {
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


        vm.setUploadVideo = function ($file, video) {
            if ($file) {
                DataUtils.toBase64($file, function(base64Data) {
                    $scope.$apply(function() {
                        video.uploadVideo = base64Data;
                        video.uploadVideoContentType = $file.type;
                    });
                });
            }
        };
        vm.datePickerOpenStatus.createdDate = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }
    }
})();
