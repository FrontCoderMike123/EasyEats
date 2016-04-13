(function(){

var budgetOptions = angular.module('budgetOptions', ['ngStorage']);

budgetOptions.controller('optionCtrl',['$scope','$http','$localStorage',function($scope,$http,$localStorage){
    $http.get('/foodTypes').success(function(data){
    	$scope.types = data;
    });

    $scope.$storage = $localStorage.$default({ userFav: {} });

    $scope.toggleFav = function(type){
    	type.Favorite = !type.Favorite;
    };

    $scope.checkAll = function() {
        var P = document.querySelector('#cravingAll p');
        if ($scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.types, function (type) {
            type.Favorite = $scope.selectedAll;
            if(type.Favorite){
                P.innerHTML = 'Craving It All!';
            }else{
                P.innerHTML = 'I Want Everything!';
            }
        });
    };

    /*
    $scope.selected = function(){
    	var favs = 0;
        var wordChange = document.querySelector('#wordChange');
    	angular.forEach($scope.types, function(type){
    		if(type.Favorite){
    			favs++;
                wordChange.innerHTML = "Submit Changes " + favs;
    		}
            if(favs == 0){
                wordChange.innerHTML = "No Changes";
            }
            if(type.Favorite === false){
                wordChange.innerHTML = "Submit Changes " + favs;
            }
    	});
    	return favs;
    };
    */
}]);

})();