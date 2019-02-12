function initMap() {
   
    navigator.geolocation.getCurrentPosition(function(position) {
        var latlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 10,
          center: latlng
        });
        marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Your current location!"
            });
       
    
       function initialize(countries) {
            var clasterData = [];
            var data = [];
             countries.forEach(function(countrie) {
                 if(countrie.latlng[0] && countrie.latlng[1]) {
                  data={
                      position: {
                          lat: countrie.latlng[0],
                          lng: countrie.latlng[1],
                      },
                      name:countrie.name,
                      capital: countrie.capital,
                      population: countrie.population,
                      alpha3Code: countrie.alpha3Code,
                      area: countrie.area,
                      timezones: countrie.timezones,
                  };
                 clasterData.push(data);
              }
             })
             return clasterData;
        }

        fetch("https://restcountries.eu/rest/v2/all")
          .then(res => res.json())
          .then(data => initialize(data))
          .then(res => {
            var markers = res.map(function (marker) {
                return new google.maps.Marker({
                  name:marker.name,
                  position: marker.position,
                  capital: marker.capital,
                  population: marker.population,
                  alpha3Code: marker.alpha3Code,
                  area: marker.area,
                  timezones: marker.timezones,
                  coord: marker.position
                });
              });

              markers.forEach(function(marker) {
                var contentString = `
                <h2>Country: ${marker.name}</h2>
                <div>Capital: ${marker.capital}</div>
                <div>Population: ${marker.population}</div>
                <div>Alpha3Code: ${marker.alpha3Code}</div>
                <div>Area: ${marker.area} sq. m.</div>
                <div>Timezones: ${marker.timezones} </div>
                <div>Coordinates: Lat ${marker.coord.lat}, Lon ${marker.coord.lng}</div>`;
                
                var infowindow = new google.maps.InfoWindow({
                    content: contentString
                  });
                    marker.addListener('click', function() {
                      infowindow.open(map, marker);
                  });
              })

              var markerCluster = new MarkerClusterer(map, markers,
                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
          })
          .catch(err => console.log("Error:", err));
    });
}
      










    
