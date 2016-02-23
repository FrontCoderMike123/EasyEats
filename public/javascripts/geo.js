(function() {

	if (navigator.geolocation) {
  		navigator.geolocation.getCurrentPosition(success, error);
	} else {
  		error('Geolocation is not supported. Please update.');
	}

	function success(position) {
  		var status = document.querySelector('#status');
  		var P = document.querySelector('#foundYou p');
  		var budget = document.querySelector('#budgetWrapper');
  
  status.innerHTML = "Let's Eat!";
  P.classList.add('remove');
  budget.classList.add('appear');
    
  document.querySelector('#foundYou');//.appendChild(mapcanvas);

  console.log(position.coords.latitude);
	console.log(position.coords.longitude);
	console.log(position.coords.accuracy);

    var userSpot = position.coords.latitude || position.coords.longitude || position.coords.accuracy;
    if(userSpot = position){
    	console.log(userSpot);
    }
}

function error(msg) {
  var status = document.querySelector('#status');
  status.innerHTML = typeof msg == 'string' ? msg : "failed";
}
})();