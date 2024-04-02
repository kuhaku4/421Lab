var app = angular.module('bloggerApp');

app.directive('navigation', function() {
    return {
      restrict: 'EA',
      templateUrl: '/nav/navigation.html',
      controller: 'NavigationController',
      controllerAs: 'navvm'
    };
});

app.controller('NavigationController', ['$location', 'authentication', function NavigationController($location, authentication) {
    var navvm = this;
    navvm.currentPath = $location.path();
    navvm.currentUser = function()  {
        return authentication.currentUser();
    }
    navvm.isLoggedIn = function() {
        return authentication.isLoggedIn();
    }
    navvm.logout = function() {
      authentication.logout();
      $location.path('/');
    };
}]);