(function() {
    'use strict';

    angular
        .module('vidUpApp')
        .config(stateConfig);

    stateConfig.$inject = ['$stateProvider'];

    function stateConfig($stateProvider) {
        $stateProvider
        .state('video', {
            parent: 'entity',
            url: '/video',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Videos'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/video/videos.html',
                    controller: 'VideoController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
            }
        })
        .state('video-detail', {
            parent: 'entity',
            url: '/video/{id}',
            data: {
                authorities: ['ROLE_USER'],
                pageTitle: 'Video'
            },
            views: {
                'content@': {
                    templateUrl: 'app/entities/video/video-detail.html',
                    controller: 'VideoDetailController',
                    controllerAs: 'vm'
                }
            },
            resolve: {
                entity: ['$stateParams', 'Video', function($stateParams, Video) {
                    return Video.get({id : $stateParams.id}).$promise;
                }],
                previousState: ["$state", function ($state) {
                    var currentStateData = {
                        name: $state.current.name || 'video',
                        params: $state.params,
                        url: $state.href($state.current.name, $state.params)
                    };
                    return currentStateData;
                }]
            }
        })
        .state('video-detail.edit', {
            parent: 'video-detail',
            url: '/detail/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/video/video-dialog.html',
                    controller: 'VideoDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Video', function(Video) {
                            return Video.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('^', {}, { reload: false });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('video.new', {
            parent: 'video',
            url: '/new',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/video/video-dialog.html',
                    controller: 'VideoDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: function () {
                            return {
                                uploadVideo: null,
                                uploadVideoContentType: null,
                                title: null,
                                description: null,
                                createdDate: null,
                                author: null,
                                id: null
                            };
                        }
                    }
                }).result.then(function() {
                    $state.go('video', null, { reload: true });
                }, function() {
                    $state.go('video');
                });
            }]
        })
        .state('video.edit', {
            parent: 'video',
            url: '/{id}/edit',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/video/video-dialog.html',
                    controller: 'VideoDialogController',
                    controllerAs: 'vm',
                    backdrop: 'static',
                    size: 'lg',
                    resolve: {
                        entity: ['Video', function(Video) {
                            return Video.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('video', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        })
        .state('video.delete', {
            parent: 'video',
            url: '/{id}/delete',
            data: {
                authorities: ['ROLE_USER']
            },
            onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                $uibModal.open({
                    templateUrl: 'app/entities/video/video-delete-dialog.html',
                    controller: 'VideoDeleteController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        entity: ['Video', function(Video) {
                            return Video.get({id : $stateParams.id}).$promise;
                        }]
                    }
                }).result.then(function() {
                    $state.go('video', null, { reload: true });
                }, function() {
                    $state.go('^');
                });
            }]
        });
    }

})();
