(function(){

var budgetOptions = angular.module('budgetOptions', []);

budgetOptions.controller('optionCtrl',['$scope','$http','$interval',function($scope,$http,$interval){
    $http.get('/foodTypes').success(function(data){
    	$scope.types = data;
    	//console.log($scope.types);
    });

    $scope.toggleFav = function(type){
    	type.Favorite = !type.Favorite;
    };

    /*$scope.stop = function() {
      $interval.cancel(Favorite);
    };*/

    $scope.selected = function(){
    	var favs = 0;
    	var favSub = document.querySelector('#favSubmit');
    	angular.forEach($scope.types, function(type){
    		if(type.Favorite){
    			favs++;
    			favSub.classList.add('appear');
    		}
    		if(favs == 0){
    			favSub.classList.remove('appear');
    		}
    	});
    	return favs;
    };

}]);

})();