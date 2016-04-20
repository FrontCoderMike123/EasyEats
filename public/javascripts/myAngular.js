(function(){

    //very simply controller to get my foods! and save the selections to the users system

var budgetOptions = angular.module('budgetOptions', ['ngStorage']);

budgetOptions.controller('optionCtrl',['$scope','$http','$localStorage',function($scope,$http,$localStorage){
    $http.get('/foodTypes').success(function(data){
    	$scope.types = data;
    });

    $scope.$storage = $localStorage.$default({ userFav: {} });
}]);

})();