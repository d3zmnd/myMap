function initMap() {
   
  navigator.geolocation.getCurrentPosition(function(position) {
      var latlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
      var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 4,
        center: latlng
      });
      var marker1 = new google.maps.Marker({
          position: latlng,
          map: map,
          title: "Your current location!"
          });

      var infoWindow = new google.maps.InfoWindow({
          content:'<h2>Your current location!</h2>'
      });
      marker1.addListener('click', function(){
         infoWindow.open(map, marker1); 
      })
      
      
         
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


          var card = document.getElementById('pac-card');
          var input = document.getElementById('pac-input');
          var rad = document.getElementById('radius');
          map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
          var autocomplete = new google.maps.places.Autocomplete(input);         
          
          autocomplete.bindTo('bounds', map);
          autocomplete.setFields(
              ['address_components', 'geometry', 'name']);

          var infowindow = new google.maps.InfoWindow();
          var infowindowContent = document.getElementById('infowindow-content');
          infowindow.setContent(infowindowContent);
          var marker = new google.maps.Marker({
            map: map,
            anchorPoint: new google.maps.Point(0, -29)
          });

          autocomplete.addListener('place_changed', function() {
            infowindow.close();
            marker.setVisible(false);

            var place = autocomplete.getPlace();
            if (!place.geometry) {
              window.alert("No details available for input: '" + place.name + "'");
              return;
              
            }
            if (place.geometry.viewport) {
              map.fitBounds(place.geometry.viewport);

            } else {
              map.setCenter(place.geometry.location);
              map.setZoom(8);  

            }
            marker.setPosition(place.geometry.location);
            marker.setVisible(true);

            var address = '';
            if (place.address_components) {

              address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
              ].join(' ');
            }

            rad.addEventListener("keydown", function(event) {
                
              if (event.key === "Enter") {


                var valueOfRad = parseInt(rad.value, 10);

                
                if(!valueOfRad) {
                    
                  return window.alert("Not a number");
                  // circle.setVisible(false); 

                } 

                else {
                        
                    var circle = new google.maps.Circle({
                        strokeColor: '#FF0000',
                        strokeOpacity: 0.8,
                        strokeWeight: 2,
                        fillColor: 'red',
                        fillOpacity: 0.35,
                        map: map,
                        center: place.geometry.location,
                        radius: valueOfRad
                      });
                    
                
                        
                  }

                }
              // circle.setMap(null);

            }) 

            infowindowContent.children['place-name'].textContent = place.name;
            infowindowContent.children['place-address'].textContent = address;
            infowindow.open(map, marker);

            
        
 
          marker.addListener('click', function(){

              infowindow.open(map, marker);
          })

      });
  });
}