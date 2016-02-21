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
  
  var mapcanvas = document.querySelector('#map');
  mapcanvas.id = 'mapcanvas';
  //mapcanvas.style.width = '200px';
  //mapcanvas.style.height = '100px';
    
  document.querySelector('#foundYou').appendChild(mapcanvas);

  	console.log(position.coords.latitude);
	console.log(position.coords.longitude);
	console.log(position.coords.accuracy);

    var userSpot = position.coords.latitude || position.coords.longitude || position.coords.accuracy;
    if(userSpot = position){
    	console.log(userSpot);
    }
  
  var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  var myOptions = {
    zoom: 15,
    center: latlng,
    mapTypeControl: false,
    navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };
  var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);
  
  var marker = new google.maps.Marker({
      position: latlng, 
      map: map, 
      title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
  });
}

function error(msg) {
  var status = document.querySelector('#status');
  status.innerHTML = typeof msg == 'string' ? msg : "failed";
}
})();