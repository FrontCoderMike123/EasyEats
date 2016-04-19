(function() {
    //From here until the map code starts, are the arrays to tell WHAT the user has typed.
    //Then run that number with the corresponding fundtion. 
    var budget = document.querySelector('#userBudget').innerHTML;
    //console.log(budget);
    var minPriceZero = new Array();
      minPriceZero[0] = '$0';
      minPriceZero[1] = '$1';
      minPriceZero[2] = '$2';
      minPriceZero[3] = '$3';
      minPriceZero[4] = '$4';
      minPriceZero[5] = '$5';
      minPriceZero[6] = '$6';
      minPriceZero[7] = '$7';
      minPriceZero[8] = '$8';
      minPriceZero[9] = '$9';
      minPriceZero[10] = '$10';
      minPriceZero[11] = '$11';
      minPriceZero[12] = '$12';
      minPriceZero[13] = '$13';
      minPriceZero[14] = '$14';
      minPriceZero[15] = '$15';
      minPriceZero[16] = '$16';
      minPriceZero[17] = '$17';
      minPriceZero[18] = '$18';
      minPriceZero[19] = '$19';
      minPriceZero[20] = '$20';
      minPriceZero[21] = '$21';
      minPriceZero[22] = '$22';
      minPriceZero[23] = '$23';
      minPriceZero[24] = '$24';
      minPriceZero[25] = '$25';
    //console.log(minPriceZero);

    var minPriceOne = new Array();
      minPriceOne[26] = '$26';
      minPriceOne[27] = '$27';
      minPriceOne[28] = '$28';
      minPriceOne[29] = '$29';
      minPriceOne[30] = '$30';
      minPriceOne[31] = '$31';
      minPriceOne[32] = '$32';
      minPriceOne[33] = '$33';
      minPriceOne[34] = '$34';
      minPriceOne[35] = '$35';
      minPriceOne[36] = '$36';
      minPriceOne[37] = '$37';
      minPriceOne[38] = '$38';
      minPriceOne[39] = '$39';
      minPriceOne[40] = '$40';
      minPriceOne[41] = '$41';
      minPriceOne[42] = '$42';
      minPriceOne[43] = '$43';
      minPriceOne[44] = '$44';
      minPriceOne[45] = '$45';
      minPriceOne[46] = '$46';
      minPriceOne[47] = '$47';
      minPriceOne[48] = '$48';
      minPriceOne[49] = '$49';
      minPriceOne[50] = '$50';
    //console.log(minPriceOne);

    var minPriceTwo = new Array();
      minPriceTwo[51] = '$51';
      minPriceTwo[52] = '$52';
      minPriceTwo[53] = '$53';
      minPriceTwo[54] = '$54';
      minPriceTwo[55] = '$55';
      minPriceTwo[56] = '$56';
      minPriceTwo[57] = '$57';
      minPriceTwo[58] = '$58';
      minPriceTwo[59] = '$59';
      minPriceTwo[60] = '$60';
      minPriceTwo[61] = '$61';
      minPriceTwo[62] = '$62';
      minPriceTwo[63] = '$63';
      minPriceTwo[64] = '$64';
      minPriceTwo[65] = '$65';
      minPriceTwo[66] = '$66';
      minPriceTwo[67] = '$67';
      minPriceTwo[68] = '$68';
      minPriceTwo[69] = '$69';
      minPriceTwo[70] = '$70';
      minPriceTwo[71] = '$71';
      minPriceTwo[72] = '$72';
      minPriceTwo[73] = '$73';
      minPriceTwo[74] = '$74';
      minPriceTwo[75] = '$75';
    //console.log(minPriceTwo);

    var minPriceThree = new Array();
      minPriceThree[76] = '$76';
      minPriceThree[77] = '$77';
      minPriceThree[78] = '$78';
      minPriceThree[79] = '$79';
      minPriceThree[80] = '$80';
      minPriceThree[81] = '$81';
      minPriceThree[82] = '$82';
      minPriceThree[83] = '$83';
      minPriceThree[84] = '$84';
      minPriceThree[85] = '$85';
      minPriceThree[86] = '$86';
      minPriceThree[87] = '$87';
      minPriceThree[88] = '$88';
      minPriceThree[89] = '$89';
      minPriceThree[90] = '$90';
      minPriceThree[91] = '$91';
      minPriceThree[92] = '$92';
      minPriceThree[93] = '$93';
      minPriceThree[94] = '$94';
      minPriceThree[95] = '$95';
      minPriceThree[96] = '$96';
      minPriceThree[97] = '$97';
      minPriceThree[98] = '$98';
      minPriceThree[99] = '$99';

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
        status.innerHTML = 'Unable to retrieve your address';
      }
    });
  }//writes the user address!

  function geolocationSuccess(position){
    status.innerHTML = "" + status.classList.add('remove');
    //var lat = 43.655009; var lng = -79.386365;
    //var latlng = new google.maps.LatLng(lat,lng);
    var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
    writeAddress(latlng);
    //Styles For The Map
    var styles = [
  {
    "featureType":"road.local",
    "elementType":"labels.text.fill",
    "stylers":[{ "color":"#006699", "weight":8 }]
  },{
    "featureType":"road.local",
    "elementType":"labels.text.stroke",
    "stylers":[{ "visibility":"off" }]
  },{
    "featureType": "road.arterial",
    "elementType": "geometry.fill",
    "stylers": [{ "color": "#ffcc00" }]
  },{
    "featureType":"road.arterial",
    "elementType":"labels.text.fill",
    "stylers":[{ "color":"#006699", "weight":8 }]
  },{
    "featureType":"road.arterial",
    "elementType":"labels.text.stroke",
    "stylers":[{ "visibility":"off" }]
  },{
    "featureType":"road.highway",
    "elementType":"geometry.fill",
    "stylers":[{ "color":"#ffcc00" }]
  },{
    "featureType":"road.highway",
    "elementType":"labels.text.fill",
    "stylers":[{ "color":"#006699", "weight":10 }]
  },{
    "featureType":"road.highway",
    "elementType":"labels.text.stroke",
    "stylers":[{ "visibility":"off" }]
  },{
    "featureType":"administrative.locality",
    "elementType":"labels.text.stroke",
    "stylers":[{ "color":"#006699" }]
  },{
    "featureType":"administrative.locality",
    "elementType":"labels.text.fill",
    "stylers":[{ "visibility":"off" }]
  },{
    "featureType":"water",
    "elementType":"geometry.fill",
    "stylers": [{ "color": "#006699" }]
  },{
    "featureType":"water",
    "elementType":"labels.text.fill",
    "stylers":[{ "color":"#ffffff", "weight":8 }]
  },{
    "featureType":"water",
    "elementType":"labels.text.stroke",
    "stylers":[{ "color":"#006699","weight":6 }]
  }
];
    var styledMap = new google.maps.StyledMapType(styles,{name: "Easy Map"});

    var myOptions = {
      zoom: 15,
      center: latlng,
      scrollwheel: false,
      mapTypeControlOptions: {
        mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
      }
    };

    var map = new google.maps.Map(document.getElementById('map'), myOptions);
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');

    var service = new google.maps.places.PlacesService(map);
    var key = 'AIzaSyAMMAihXyTWvALvpK_I6csYCv_rt0eivnA';
    var radius = 1500;
    var type = ['restaurant'];

    for(var a = 0; a < minPriceZero.length; a++){
      if(budget == minPriceZero[a]){
        console.log('Spending ($'+a+'/$25) - Max Price Zero');
          service.radarSearch({
            key: key,
            location: latlng,
            radius: radius,
            type: type,
            maxprice: 0
        },callback);
      }
    }

    for(var b = 0; b < minPriceOne.length; b++){
      if(budget == minPriceOne[b]){
        console.log('Spending ($'+b+'/$50) - Max Price One');
          service.radarSearch({
            key: key,
            location: latlng,
            radius: radius,
            type: type,
            maxprice: 1
        },callback);
      }
    }

    for(var c = 0; c < minPriceTwo.length; c++){
      if(budget == minPriceTwo[c]){
        console.log('Spending ($'+c+'/$75) - Max Price Two');
          service.radarSearch({
            key: key,
            location: latlng,
            radius: radius,
            type: type,
            maxprice: 2
        },callback);
      }
    }

    for(var d = 0; d < minPriceThree.length; d++){
      if(budget == minPriceThree[d]){
        console.log('Spending ($'+d+'/$99) - Max Price Three');
          service.radarSearch({
            key: key,
            location: latlng,
            radius: radius,
            type: type,
            maxprice: 3
        },callback);
      }
    }

  var home = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

  function HomeControl(controlDiv, map){
    controlDiv.style.padding = '0px';
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = "#006699";
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.style.width = "80px";
    controlUI.style.borderBottomLeftRadius = '10px';
    controlUI.title = "Send Me Home";
    controlDiv.appendChild(controlUI);
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Lato, sans-serif';
    controlText.style.color = '#ffcc00';
    controlText.style.fontSize = '13px';
    controlText.style.paddingTop = '15px';
    controlText.style.paddingBottom = '15px';
    controlText.innerHTML = '<b>HOME<b>';
    controlUI.appendChild(controlText);

    google.maps.event.addDomListener(controlUI,'click',function(){
      map.setCenter(home);
      map.setZoom(15);
    });
  }

  var homeControlDiv = document.createElement('div');
  var homeControl = new HomeControl(homeControlDiv,map);
  map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);

  var yourArrow = '/images/icons/maps/userMarker.svg';

  var yourMarker = new google.maps.Marker({
      position: latlng, 
      map: map, 
      icon: yourArrow,
      animation: google.maps.Animation.BOUNCE,
      title:"You are here! (at least within a "+position.coords.accuracy+" meter radius)"
  });

  var infoWindow = new InfoBox({
      position: latlng,
      maxWidth: 350,
      boxClass: 'infoWindow',
      closeBoxMargin: '0px',
      //pixelOffset: new google.maps.Size(-175,2), 
      closeBoxURL: '/images/icons/maps/exit.svg',
      visible: true,
      pane: 'floatPane'
  });

function callback(results, status) {
  if (status === google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var placeLoc = place.geometry.location;
  var icon = '/images/icons/maps/restaurantMarker.svg';

  service.getDetails({placeId: place.place_id},function(place,status){
    if(status === google.maps.places.PlacesServiceStatus.OK){
      var marker = new google.maps.Marker({
        map: map,
        animation: google.maps.Animation.DROP,
        position: placeLoc,
        icon: icon,
        title: place.name
      });
    google.maps.event.addListener(marker,'click',function(){
      infoWindow.setContent('<div class="infoWindow">'+
      '<h1>'+ place.name + '</h1>' +
      '<span>Address</span>' +
      '<p>' + place.vicinity + '</p>' +
      '<span>Phone Number</span>' +
      '<p>' + place.international_phone_number + '</p>' +
      //'<span>' + place.price_level + '</span>' + //some are undefined, some show a number
      '<a href="'+place.url+'" target="onblank">Get Directions</a>' + 
      '<a href="'+place.website+'" target="onblank">Visit Website</a>' +
      '</div>');
      infoWindow.open(map,this);
      map.setCenter(placeLoc);
      map.setZoom(15);
    });
    }
  });
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

  google.maps.event.addDomListener(window, "load", locateUser);
  //window.onload = locateUser;
})();