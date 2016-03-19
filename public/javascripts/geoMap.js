(function() {

	if (navigator.geolocation) {
  		navigator.geolocation.getCurrentPosition(success, error);
	} else {
  		error('Geolocation is not supported. Please update.');
	}

	function success(position) {
  		var status = document.querySelector('.status');
  		var P = document.querySelector('.foundYou p');
      var infoWindow;
      var labels = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var labelIndex = 0;
      var markers = [];
  
  status.innerHTML = "";
  
  var mapcanvas = document.querySelector('#map');
  mapcanvas.id = 'mapcanvas';
  mapcanvas.classList.add('mapGrow');
  document.querySelector('.mapHolder').appendChild(mapcanvas);
  
  var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  var myOptions = {
    zoom: 16,
    center: latlng,
    mapTypeIds: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById("mapcanvas"), myOptions);

  var yourArrow = '/images/icons/urArrow.svg';

  var yourMarker = new google.maps.Marker({
      position: latlng, 
      map: map, 
      icon: yourArrow,
      animation: google.maps.Animation.BOUNCE,
      title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
  });

  var infoWindow = new google.maps.InfoWindow({
    maxWidth: 200
    });

  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: latlng,
    radius: 500,
    types: ['restaurant']
  },callback);

  function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i], i * 200);
    }
  }
}

function createMarker(place, timeout) {
  var placeLoc = place.geometry.location;

 window.setTimeout(function() {
  var icon = '/images/icons/arrow.svg';
    var marker = new google.maps.Marker({
      map: map,
      label: labels[labelIndex++ % labels.length],
      animation: google.maps.Animation.DROP,
      position: placeLoc,
      icon: icon
    });
  marker.addListener('click', toggleBounce);

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}
  
  var request = { reference: place.reference };
  service.getDetails(request, function(details) {
    google.maps.event.addListener(marker, 'click', function() {
    infoWindow.setContent('<div class="infoWindow"><h1>'+ details.name + '</h1>'+
      //'<img src="'+place.icon+'">' +
      '<span>' + 'Address' + '</span>' + '<p>' + details.vicinity + '</p>' +
      '<span>' + 'Phone Number' + '</span>' + '<p>' + details.international_phone_number + '</p>' +
      '<a href="'+details.url+'" target="onblank">' + 'View Website' + '</a>' + '</div>');
    infoWindow.open(map, this);
  });
  });
  }, timeout);
}
}

function error(msg) {
  var status = document.querySelector('.status');
  status.innerHTML = typeof msg == 'string' ? msg : "FAILED!!!!";
}

/*console.log(position.coords.latitude);
  console.log(position.coords.longitude);
  console.log(position.coords.accuracy);
  var userSpot = position.coords.latitude || position.coords.longitude || position.coords.accuracy;
    if(userSpot = position){
      console.log(userSpot);
    }*/
})();