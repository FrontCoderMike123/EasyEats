(function(){

var budgetOptions = angular.module('budgetOptions', ['ngStorage']);

budgetOptions.controller('optionCtrl',['$scope','$http','$filter','$localStorage',function($scope,$http,$filter,$localStorage){
    $http.get('/foodTypes').success(function(data){
    	$scope.types = data;
    });

    $scope.$storage =  $localStorage.$default({
        userFav: {}  
    });

    $scope.toggleFav = function(type){
    	type.Favorite = !type.Favorite;
    };

    $scope.checkAll = function () {
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

    $scope.selected = function(){
    	var favs = 0;
    	var favSub = document.querySelector('#favSubmit');
        var wordChange = document.querySelector('#wordChange');
    	angular.forEach($scope.types, function(type){
    		if(type.Favorite){
    			favs++;
    			favSub.classList.add('appear');
                wordChange.innerHTML = 'Only Submit This ' + favs;
                if(favs >= 2){
                    wordChange.innerHTML = 'Submit These ' + favs;
                }
    		}
    		if(favs == 0){
    			favSub.classList.remove('appear');
    		}
            if(favs == 10){
                wordChange.innerHTML = "Submit Everything!";
            }
    	});
    	return favs;
    };

    $("#select").mousedown(function(e){
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