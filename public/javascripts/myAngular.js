(function(){

var budgetOptions = angular.module('budgetOptions', []);

budgetOptions.controller('optionCtrl',['$scope','$http','$interval',function($scope,$http,$interval){
    $http.get('/foodTypes').success(function(data){
    	$scope.types = data[0].Foods;
    	//console.log($scope.types);
        //to me...how the scope above makes sense. is clear NOW... but it didnt at the time...
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
        var myChoice = document.querySelector('#favoriteSelector').value;
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
            if(myChoice == 'Anything'){
                proFavs.innerHTML = "You want me to decide!";
            }
        });
        return favs;
    };

    $("#favoriteSelector").mousedown(function(e){
        e.preventDefault();
        var select = this;
        e.target.selected = !e.target.selected;
    $(select).focus();
    }).mousemove(function(e){e.preventDefault()});
    //Hello Sir(s)...
    //PLEASE AND I ReAllY MEAN PLEEEEAASE.... BEFORE YOU TAKE A MARK OFF BEVAUSE IM USING JQUERY FOR THIS..
    //I HAVE LITERALLY WASTED AN EEENNNTTTIIIRRREEE NIGHT RESEARCHING AND CODING AND DECODING A GOSH DARN
    //CORE FUNCTION.... NOTHIN TO HELP ME OUT...... IM TELLING YOU! I SEARCH EVERYWHERE, READ EVERYTHING...
    //UNTIL FINALLY I RAN INTO AN ARTICLE WHERE SOMEONE WAS TRYING TO DO THE SAME AS ME... BUT IN JQUERY...
    //I GAVE IN LOL.... SO NOW!!!!!! I CAN HAVE MULIPLE SELECTIONS IN MY FAVORITES SELECTIONS OPTIONS IN
    //SIGN UP FORM....
    //tHANK YOU GENTLEMEN!!

}]);

})();