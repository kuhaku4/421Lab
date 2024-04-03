var app = angular.module('bloggerApp');

app.service('authentication', authentication);
    authentication.$inject = ['$window', '$http'];
    function authentication ($window, $http) {

        var saveToken = function (token) {
          console.log("Saving token to local storage:", token);
            $window.localStorage['blog-token'] = token;
        };

        var getToken = function () {
          var token = $window.localStorage['blog-token'];
          console.log("Retrieving token from local storage:", token);
          return token;
      };

        var register = function(user) {
            console.log('Registering user ' + user.email + ' ' + user.password);
            return $http.post('/api/register', user).then(function(data){
              saveToken(data.data.token);
          });
        };

        var login = function(user) {
           console.log('Attempting to login user ' + user.email + ' ' + user.password);
            return $http.post('/api/login', user).then(function(data) {

              saveToken(data.data.token);
           });
        };

        var logout = function() {
            console.log("Logging out");
            $window.localStorage.removeItem('blog-token');
        };

        var isLoggedIn = function() {
          var token = getToken();

          if(token){
            var payload = JSON.parse($window.atob(token.split('.')[1]));

            return payload.exp > Date.now() / 1000;
          } else {
            return false;
          }
        };

        var currentUser = function() {
          if(isLoggedIn()){
            var token = getToken();
            var payload = JSON.parse($window.atob(token.split('.')[1]));
            return {
              email : payload.email,
              name : payload.name
            };
          }
        };

        return {
          saveToken : saveToken,
          getToken : getToken,
          register : register,
          login : login,
          logout : logout,
          isLoggedIn : isLoggedIn,
          currentUser : currentUser
        };
}

app.controller('LoginController', ['$location', 'authentication', function LoginController($location, authentication) {
    var vm = this;

    vm.pageHeader = {
      title: 'Sign in to Blogger'
    };

    vm.credentials = {
      email : "",
      password : ""
    };

    vm.returnPage = $location.search().page || '/';

    vm.onSubmit = function () {
      vm.formError = "";
      if (!vm.credentials.email || !vm.credentials.password) {
           vm.formError = "All fields required, please try again";
        return false;
      } else {
           vm.doLogin();
      }
    };

    vm.doLogin = function() {
      console.log("DoLogin Ran");
      vm.formError = "";
      authentication
        .login(vm.credentials)
        .then(function(){
          $location.path('blogs');
        }
        , (function(err){
          var obj = err;
          console.log(obj.message);
          //vm.formError = obj.message;
          vm.formError = "Login failed. Email or password maybe incorrect.";
        }));
    };
 }]);

app.controller('RegisterController', ['$location', 'authentication', function RegisterController($location, authentication) {
    var vm = this;

    vm.pageHeader = {
      title: 'Create a new Blogger account'
    };

    vm.credentials = {
      name : "",
      email : "",
      password : ""
    };

    vm.onSubmit = function () {
      vm.formError = "";
      if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
        vm.formError = "All fields required, please try again";
        return false;
      } else {
        vm.doRegister();
      }
    };

    vm.doRegister = function() {
      vm.formError = "";
      authentication
        .register(vm.credentials)
        .then(function(){
          $location.path('blogs');
        }
        , (function(err){
          vm.formError = "Error registering. Try again with a different email address."
        }));
    };


}]);