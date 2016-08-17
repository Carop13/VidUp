(function() {
    'use strict';

    angular
        .module('vidUpApp')
        .controller('VideoDialogController', VideoDialogController);

    VideoDialogController.$inject = ['$timeout', '$scope', '$stateParams', '$uibModalInstance', 'entity', 'Video', 'User', 'VideoUpload'];

    function VideoDialogController ($timeout, $scope, $stateParams, $uibModalInstance, entity, Video, User, VideoUpload) {
        var vm = this;

        vm.video = entity;
        vm.clear = clear;
        vm.datePickerOpenStatus = {};
        vm.openCalendar = openCalendar;
        vm.save = save;
        vm.users = User.query();
        vm.setImage = setImage;
        vm.byteSize = byteSize;


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
          console.log(result);
          console.log(vm.video.image);
          vm.data = {
            videoId: result.id,
            caption: result.title,
            file: vm.video.image
          };
         /* console.log(vm.data);*/
          VideoUpload.save(vm.data, function(){
            $scope.$emit('vidUpApp:videoUpdate', result);
            $uibModalInstance.close(result);
            vm.isSaving = false;
          });
        }

        function onSaveError () {
            vm.isSaving = false;
        }

        vm.datePickerOpenStatus.createdDate = false;

        function openCalendar (date) {
            vm.datePickerOpenStatus[date] = true;
        }


     function setImage ($files, image) {
       console.log('llego a imagen');
       console.log(image);
         if ($files[0]) {
             var file = $files[0];
             var fileReader = new FileReader();
             fileReader.readAsDataURL(file);
             fileReader.onload = function (e) {
                 var data = e.target.result;
                 var base64Data = data.substr(data.indexOf('base64,') + 'base64,'.length);
                 /*$scope.$apply(function() {*/
                     vm.video.image = base64Data;
                 /*});*/
             };
         }
       console.log(vm.video.image);
     };

      function byteSize (base64String) {
        if (!angular.isString(base64String)) {
          return '';
        }
        function endsWith(suffix, str) {
          return str.indexOf(suffix, str.length - suffix.length) !== -1;
        }
        function paddingSize(base64String) {
          if (endsWith('==', base64String)) {
            return 2;
          }
          if (endsWith('=', base64String)) {
            return 1;
          }
          return 0;
        }
        function size(base64String) {
          return base64String.length / 4 * 3 - paddingSize(base64String);
        }
        function formatAsBytes(size) {
          return size.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " bytes";
        }

        return formatAsBytes(size(base64String));
      };
    }
})();
