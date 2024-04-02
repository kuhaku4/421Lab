var app = angular.module('bloggerApp', ['ngRoute']);

//Router Provider
app.config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'pages/home.html',
        controller: 'HomeController',
        controllerAs: 'vm'
      })
  
      .when('/blogs', {
        templateUrl: 'pages/blogList.html',
        controller : 'ListController',
        controllerAs: 'vm'
      })
  
      .when('/blogs/add', {
        templateUrl: 'pages/blogAdd.html',
        controller: 'AddController',
        controllerAs: 'vm'
      })
  
      .when('/blogs/:id', {
        templateUrl: 'pages/blogEdit.html',
        controller: 'EditController',
        controllerAs: 'vm'
      })
  
      .when('/blogs/delete/:id', {
        templateUrl: 'pages/blogDelete.html',
        controller: 'DeleteController',
        controllerAs: 'vm'
      })
  
      .otherwise({redirectTo: '/'});
  });
  
  //REST API functions
  function getAllBlogs($http) {
    return $http.get('/api/blogs');
  }
  
  function getBlogById($http, id) {
    return $http.get('/api/blogs/' + id);
  }
  
  function addBlog($http, data) {
    return $http.post('/api/blogs/add', data);
        
}
  
  function updateBlogById($http, id, data) {
    return $http.put('/api/blogs/' + id, data);
  }
  
  function deleteBlogById($http, id) {
    return $http.delete('/api/blogs/' + id);
  }
  
  //Controllers
  app.controller('HomeController', function HomeController() {
    var vm = this;
    vm.pageHeader = {
        title: "Eric Almonrode's Blogger App"
    };
    vm.message = "Welcome to a very basic blogger app.";
  });
  
  app.controller('ListController', function ListController($http) {
    var vm = this;
    vm.pageHeader = {
        title: "Blog List"
    };
    vm.message = "Retrieving blogs";
    getAllBlogs($http)
        .then(function (response) {
            vm.blogs = response.data;
            vm.message = "";
        })
        .catch(function (error) {
            console.error("Error fetching blogs:", error);
            vm.message = "No blogs found. Try Adding a Blog First";
        });
  });
  
  app.controller('AddController', ['$http', '$location', function AddController($http, $location) {
    var vm = this;
    vm.blog = {
      blogtitle: '',
      blogtext: ''
    };
    vm.pageHeader = {
      title: 'Blog Add'
    };
    vm.message = "";
  
    vm.submit = function () {
      var data = {
        blogtitle: vm.blog.title,
        blogtext: vm.blog.text
      };
  
      addBlog($http, data)
        .then(function (addedBlog) {
            vm.blog = {};
            vm.message = "";
            $location.path('/blogs'); // Redirect to the blog list after successful addition
        })
        .catch(function (error) {
            console.error("Error adding blog:", error);
            vm.message = "Could not add blog";
        });
    };
}]);

app.controller('EditController', ['$http', '$routeParams', '$location', function EditController($http, $routeParams, $location) {
  var vm = this;
  vm.blog = {};
  vm.id = $routeParams.id;
  vm.pageHeader = {
      title: 'Blog Edit'
  };
  vm.message = "Getting Blog";
  
  // Fetch the blog to edit
  getBlogById($http, vm.id)
  .then(function(response) {
      vm.blog = response.data;
      vm.message = "";
  })
  .catch(function(error) {
      vm.message = "Could not retrieve blog at ID " + vm.id + ". Error: " + error.statusText;
      throw error;
  });

  // Update the blog
  vm.submit = function() {
      updateBlogById($http, vm.id, vm.blog)
          .then(function(response) {
              vm.message = "";
              $location.path('/blogs'); // Redirect to the blog list after successful update
          })
          .catch(function(error) {
              vm.message = "Could not update blog at ID " + vm.id;
          });
  };
}]);

app.controller('DeleteController', [ '$http', '$routeParams', '$location', function DeleteController($http, $routeParams, $location) {
  var vm = this;
  vm.blog = {};
  vm.id = $routeParams.id;
  vm.pageHeader = {
    title: 'Blog Delete'
  };
  vm.message = "Getting Blog";
  getBlogById($http, vm.id)
  .then(function(response) {
      vm.blog = response.data;
      vm.message = "";
  })
  .catch(function(error) {
      vm.message = "Could not retrieve blog at ID " + vm.id + ". Error: " + error.statusText;
      throw error;
  });

  vm.submit = function() {
    deleteBlogById($http, vm.id)
      .then(function() {
        $location.path('/blogs'); // Redirect to the blog list after successful deletion
      })
      .catch(function (error) {
        vm.message = "Could not delete blog";
      });
  }

  vm.cancel = function() {
    $location.path('/blogs'); // Redirect to the blog list if cancel is clicked
  }
}]);