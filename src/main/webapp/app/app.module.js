(function() {
    'use strict';

    angular
        .module('vidUpApp', [
            'ngStorage',
            'ngResource',
            'ngCookies',
            'ngAria',
            'ngCacheBuster',
            'ngFileUpload',
            'ui.bootstrap',
            'ui.bootstrap.datetimepicker',
            'ui.router',
            'infinite-scroll',
            // jhipster-needle-angularjs-add-module JHipster will add new module here
            'angular-loading-bar'
        ])
        .run(run);

    run.$inject = ['stateHandler'];

    function run(stateHandler, $http) {
        stateHandler.initialize();
        //$http.defaults.headers.common['Content-Type'] = 'multipart/form-data';
    }
})();
