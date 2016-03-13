//  'use strict';

angular.module('starter', ['ionic', 'starter.controllers' , 'starter.services'])

.run(function ($ionicPlatform) {
      $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
          cordova.plugins.Keyboard.disableScroll(true);
        }
        if (window.StatusBar) {
          // org.apache.cordova.statusbar required
          StatusBar.styleDefault();
        }
      })
})

.config(function ($stateProvider, $urlRouterProvider) {
      // url routes/states

      $stateProvider
        // app states
        .state('dashboard', {
          url: '/dashboard',
          templateUrl: 'templates/dashboard.html',
          controller: 'DashboardCtrl'
        })
        .state('results', {
          url: '/results/:search/:satTrans/:wheelChair/:wheelChairLift',
          controller: 'ResultsCtrl',
          templateUrl: 'templates/results.html'
        })
        .state('detail', {
          url: '/detail/:id',
          controller: 'DetailCtrl',
          templateUrl: 'templates/detail.html'
        });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('dashboard');
});