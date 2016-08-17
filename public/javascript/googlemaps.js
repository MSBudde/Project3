var geoLocation = {
  getLocation: function() {
    var deferred = $.Deferred();
    // if geo location is supported
    if(navigator.geolocation) {
      // get current position and pass the results to getPostalCode or time out after 5 seconds if it fails
      navigator.geolocation.getCurrentPosition(deferred.resolve, this.geoLocationError, {
          timeout: 5000
      });
    } else {
      //geo location isn't supported
      console.log('Your browser does not support Geo Location.');
    }
    return deferred.promise();
  },
  geoLocationError: function() {
    console.log('Geo Location failed.');
  }
};
$.when(geoLocation.getLocation()).then(function(data){
  var pos = {
    lat: data.coords.latitude,
    lng: data.coords.longitude
  };
  console.log(pos);

  var directionsDisplay = new google.maps.DirectionsRenderer();
  var directionsService = new google.maps.DirectionsService();

  var mapOptions = {
    center: new google.maps.LatLng(pos.lat, pos.lng),
    zoom: 12,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  };

  var map = new google.maps.Map(document.getElementById('map'), mapOptions);
  directionsDisplay.setMap(map);

  geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'address': startingLoc }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
      console.log(startingLoc + ' latitude: ' + results[0].geometry.bounds.b.b)
      console.log(startingLoc + ' longitude: ' + results[0].geometry.bounds.f.b)
  }});
  geocoder.geocode({ 'address': destination }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
      console.log(destination + ' latitude: ' + results[0].geometry.bounds.b.b)
      console.log(destination + ' longitude: ' + results[0].geometry.bounds.f.b)
  }});

  if (startingLoc) {
    var req = {
      origin: startingLoc,
      destination: destination,
      travelMode: 'DRIVING'
    }
  } else {
    var req = {
      origin: pos,
      destination: destination,
      travelMode: 'DRIVING'
    }
  }


  directionsService.route(req, function(res, status) {
    if (status == 'OK') {
      directionsDisplay.setDirections(res);
    }
  })
});