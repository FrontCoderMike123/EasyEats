(function(){
	var EASYEATZ = angular.module('EASYEATZ',['ui.router']);

EASYEATZ.factory('httpRequestInterceptor', function () {
    return {
        request: function (config) {
        config.headers['x-custom-header-name'] = '/'
        return config
    }
}
});

EASYEATZ.config(['$stateProvider','$urlRouterProvider','$httpProvider',function($stateProvider,$urlRouterProvider,$httpProvider) {
    $httpProvider.interceptors.push('httpRequestInterceptor');
    $stateProvider.state('index',{
		url: '/',
		templateUrl: 'pages/new.ejs',
		controller: 'newCtrl'
	});
	$urlRouterProvider.otherwise('/');
}]);

EASYEATZ.controller('newCtrl',['$scope','$http',function($scope,$http){

}]);

})();