/**
 * Created by thomasmundt on 04.01.16.
 */
var appName = 'invinoveritas';
var app = angular.module(appName, ['ui.router', 'ui.bootstrap', 'uiGmapgoogle-maps','toastr']);
angular.element(document).ready(function() {
    angular.bootstrap(document, [appName]);
});

app.config(function(uiGmapGoogleMapApiProvider, $stateProvider, $urlRouterProvider, $locationProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyCifkkPKHgFZnxPK37mIEcfhr1BG1EJSCA',
            v: '3.20', //defaults to latest 3.X anyhow
            libraries: 'weather,geometry,visualization'
        });

    $stateProvider
    // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/',
            templateUrl: 'app/views/home.html',
            controller: 'homeCtrl'
            //resolve: {
            //    currentUser : function(AuthService) {
            //        return AuthService.identity();
            //    }
            //}
        })

        // ABOUT PAGE AND OTHERS =================================
        .state('about-idea', {
            url: '/about-idea',
            templateUrl: 'app/views/about-idea.html'
        })
        .state('about-project', {
            url: '/about-project',
            templateUrl: 'app/views/about-project.html'
        })
        .state('imprint', {
            url: '/imprint',
            templateUrl: 'app/views/imprint.html'
        })
        .state('depot' , {
            url: '/depot',
            templateUrl: 'app/views/depot.html',
            controller: 'depotCtrl',
            cache: false,
            resolve: {
                currentUser : function(AuthService) {
                    console.log('state-provider, depot, getting user');
                    return AuthService.getCurrentUser();
                }
            }
        });
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(false);
});