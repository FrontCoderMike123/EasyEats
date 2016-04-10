(function() {

  var status = document.querySelector('.status');
  var infoWindow;
  var markers = [];

  function writeAddress(LatLng){
    var geoCoder = new google.maps.Geocoder();
    geoCoder.geocode({
      "location": LatLng
    },function(results,status){
      if(status == google.maps.GeocoderStatus.OK){
        document.getElementById('userAddress').innerHTML = results[0].formatted_address;
      }else{
        status.innerHTML += 'Unable to retrieve your address';
      }
    });
  }//writes the user address!

  function geolocationSuccess(position){
    var status = document.querySelector('.status');
    var infoWindow;
    var markers = [];
    status.innerHTML = "" + status.classList.add('remove');

  var home = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  function HomeControl(controlDiv, map){
    controlDiv.style.padding = '5px';
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = "#006699";
    controlUI.style.borderRadius = '10px';
    controlUI.style.border = '1px solid #ccc';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = "Send Me Home";
    controlDiv.appendChild(controlUI);
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Lato, sans-serif';
    controlText.style.color = '#ffcc00';
    controlText.style.fontSize = '12px';
    controlText.style.padding = '10px';
    controlText.innerHTML = '<b>HOME<b>';
    controlUI.appendChild(controlText);

    google.maps.event.addDomListener(controlUI,'click',function(){
      map.setCenter(home);
    });
  }

  var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
  writeAddress(latlng);
  var myOptions = {
    zoom: 15,
    center: latlng,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoomControl: false,
    disableDoubleClickZoom: true,
    mapTypeControl: false,
    scaleControl: false,
    scrollwheel: false,
    panControl: false,
    streetViewControl: false,
    draggable : true,
    overviewMapControl: true,
    overviewMapControlOptions: {
    opened: false
  }
  };

  var map = new google.maps.Map(document.getElementById('map'), myOptions);
  var homeControlDiv = document.createElement('div');
  var homeControl = new HomeControl(homeControlDiv,map);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);

  var yourArrow = '/images/icons/maps/urArrow.svg';

  var yourMarker = new google.maps.Marker({
      position: latlng, 
      map: map, 
      icon: yourArrow,
      animation: google.maps.Animation.BOUNCE,
      title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
  });

  var infoWindow = new google.maps.InfoWindow({
      position: latlng,
      maxWidth: 1000
  });

  var service = new google.maps.places.PlacesService(map);
  service.nearbySearch({
    location: latlng,
    radius: 1500,
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
  var icon = '/images/icons/maps/arrow.svg';
    var marker = new google.maps.Marker({
      map: map,
      //label: labels[labelIndex++ % labels.length],
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
    infoWindow.setContent('<div class="infoWindow"><h1>'+ details.name + '</h1>' +
      '<span>Address</span>' +
      '<p>' + details.vicinity + '</p>' +
      '<span>Phone Number</span>' +
      '<p>' + details.international_phone_number + '</p>' +
      '<a href="'+details.url+'" target="onblank">GO EAT!</a>' + '</div>');
    infoWindow.open(map, this);
  });
  });
  }, timeout);
}

    google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      google.maps.event.trigger(map, "resize");
      map.setCenter(center);
    });
  }//success function

  function geolocationError(positionError){
    status.innerHTML += "Error: " + positionError.message;
  }//error function

  function locateUser() {
    if (navigator.geolocation){
      var positionOptions = {
      enableHighAccuracy: true,
      timeout: 10 * 1000
    };
    navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError, positionOptions);
    status.innerHTML += 'Waiting for you...';
    }else{
      status.innerHTML += 'Your browser does not support Geolocation';
    }
  }//window load function

  window.onload = locateUser;
})();