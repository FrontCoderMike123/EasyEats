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

    $scope.selected = function(){
    	var favs = 0;
    	var favSub = document.querySelector('#favSubmit');
        var wordChange = document.querySelector('#wordChange');
    	angular.forEach($scope.types, function(type){
    		if(type.Favorite){
    			favs++;
    			favSub.classList.add('appear');
                wordChange.innerHTML = 'Happy with this '+favs+'?';
                if(favs >= 2){
                    wordChange.innerHTML = 'Happy with these '+favs+'?';
                }
    		}
    		if(favs == 0){
    			favSub.classList.remove('appear');
    		}
            if(favs == 10){
                wordChange.innerHTML = "Craving Everything!";
            }
    	});
    	return favs;
    };

    $scope.profileSelected = function(){
        var favs = 0;
        var proFavs = document.querySelector('#proFavs');
        angular.forEach($scope.types, function(type){
            if(type.Favorite){
                favs++;
                if(favs >= 1){
                    proFavs.classList.add('appear');
                    proFavs.innerHTML = favs + " Favorites Selected";
                }
            }
            if(favs == 1){
                proFavs.innerHTML = "You Have " + favs + " Selected";
            }
            if(favs <= 0){
                proFavs.classList.add('remove');
            }
            if(favs == 0){
                proFavs.classList.remove('appear');
            }
            if(favs == 10){
                proFavs.innerHTML = "Craving Everything!";
            }
        });
        return favs;
    };

}]);

})();