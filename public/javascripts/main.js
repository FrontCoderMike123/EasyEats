(function(){
	var EASYEATZ = angular.module('EASYEATZ',['ui.router','ngAnimate']);

	EASYEATZ.config(['$stateProvider','$urlRouterProvider',function($stateProvider,$urlRouterProvider){
		$stateProvider.state('new',{
			url: '/new',
			temaplteUrl: 'pages/new.ejs',
			controller: 'newController'
		});
		$stateProvider.state('login',{
			url: '/login',
			temaplteUrl: 'pages/login.ejs',
			controller: 'loginController'
		});
		$stateProvider.state('signup',{
			url: '/signup',
			temaplteUrl: 'pages/signUp.ejs',
			controller: 'signupController'
		});
		$stateProvider.state('budget',{
			url: '/budget',
			temaplteUrl: 'pages/budget.ejs',
			controller: 'budgetController'
		});
		$stateProvider.state('restaurants',{
			url: '/restaurants',
			temaplteUrl: 'pages/restaurants.ejs',
			controller: 'restaurantsController'
		});
		$urlRouterProvider.otherwise('/new');
	}]);

	EASYEATZ.controller('newController',['$scope','$http',function($scope,$http){

	}]);

	EASYEATZ.controller('loginController',['$scope','$http',function($scope,$http){
		
	}]);

	EASYEATZ.controller('signupController',['$scope','$http',function($scope,$http){
		
	}]);

	EASYEATZ.controller('budgetController',['$scope','$http',function($scope,$http){
		
	}]);

	EASYEATZ.controller('restaurantsController',['$scope','$http',function($scope,$http){
		
	}]);

})();