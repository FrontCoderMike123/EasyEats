(function() {
	if(navigator.geolocation) {
		console.log('I Know Where You Are.');
		//navigator.geolocation.getCurrentPosition(showPosition, showFail);other file!!!!
	}else{
		console.log("I Can't Find You, Sorry.");
	}

	//var button = document.querySelector('#budgetFinder');

	function getUserPos(){
		var startPos;
		var geoSuccess = function(position){
			startPos = position;
			console.log(startPos.coords.latitude);
			console.log(startPos.coords.longitude);
			document.getElementById('startLat').innerHTML = startPos.coords.latitude;
    		document.getElementById('startLon').innerHTML = startPos.coords.longitude;
		};
		navigator.geolocation.getCurrentPosition(geoSuccess);
	};

	window.addEventListener('load',getUserPos,false);
})();