function initMap(position) {
      navigator.geolocation.getCurrentPosition(function (position){
        let latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        let map = new google.maps.Map(document.getElementById('map'), {
              zoom: 13,
              center: latlng
        }); 
        let markerCurrentPosition = new google.maps.Marker({
          position: latlng,
          map: map,
          title: "Your current location!"
        });
        let infoWindow = new google.maps.InfoWindow({
          content: '<h2>Your current location!</h2>'
        });
        markerCurrentPosition.addListener('click', function () {
          infoWindow.open(map, markerCurrentPosition);
        })
        dataObj(map);
        
        if (map !== undefined) {
          gAutocomplite(map);
          
        }
    })
}

function dataObj(map) {
  fetch("https://restcountries.eu/rest/v2/all")
    .then(res => res.json())
    .then(data => initialize(data))
    .then(res => {
      let markers = res.map(marker => {
        return new google.maps.Marker({
          name: marker.name,
          position: marker.position,
          capital: marker.capital,
          population: marker.population,
          alpha3Code: marker.alpha3Code,
          area: marker.area,
          timezones: marker.timezones,
          coord: marker.position
        });
      });
      markers.forEach(marker => {
        let contentString = `
                  <h2>Country: ${marker.name}</h2>
                <div>Capital: ${marker.capital}</div>
                <div>Population: ${marker.population}</div>
                <div>Alpha3Code: ${marker.alpha3Code}</div>
                <div>Area: ${marker.area} sq. m.</div>
                <div>Timezones: ${marker.timezones} </div>
                <div>Coordinates: Lat ${marker.coord.lat}, Lon ${marker.coord.lng}</div>`;
        let infowindow = new google.maps.InfoWindow({
          content: contentString
        });
        marker.addListener('click', () => {
          infowindow.open(map, marker);
        });
      })
      let markerCluster = new MarkerClusterer(map, markers,
        { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
    })
    .catch(err => console.log("Error:", err));


  const initialize = (countries) => {
    let clasterData = [];
    let data = [];
    countries.forEach((countrie) => {
      if (countrie.latlng[0] && countrie.latlng[1]) {
        data = {
          position: {
            lat: countrie.latlng[0],
            lng: countrie.latlng[1],
          },
          name: countrie.name,
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
}

function gAutocomplite(map){
    let card = document.getElementById('pac-card');
    setTimeout(function () {
      card.style.display = 'inline';
    }, 1000);
    
    let input = document.getElementById('pac-input');
    let rad = document.getElementById('radius');
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(card);
    let autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', map);
    autocomplete.setFields(
      ['address_components', 'geometry', 'name']);

    let infowindow = new google.maps.InfoWindow();
    let infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    let marker = new google.maps.Marker({
      map: map,
    });
    let valueOfRad;
    let circle = new google.maps.Circle({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: 'red',
      fillOpacity: 0.35,
      map: map,
      radius: valueOfRad
    });

    autocomplete.addListener('place_changed', function () {

      infowindow.close();
      circle.setMap(null);
      marker.setVisible(false);

      let place = autocomplete.getPlace();
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

      let address = '';
      if (place.address_components) {

        address = [
          (place.address_components[0] && place.address_components[0].short_name || ''),
          (place.address_components[1] && place.address_components[1].short_name || ''),
          (place.address_components[2] && place.address_components[2].short_name || '')
        ].join(' ');
      }

      rad.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          valueOfRad = parseInt(rad.value, 10);
          if (!valueOfRad) {
            circle.setVisible(false);
            return window.alert("Not a number");
          }
          else {
            circle.setCenter(place.geometry.location);
            circle.setMap(map);
            circle.setRadius(valueOfRad);
          }
        }
      })


      infowindowContent.children['place-name'].textContent = place.name;
      infowindowContent.children['place-address'].textContent = address;
      infowindow.open(map, marker);

      marker.addListener('click', function () {
        infowindow.open(map, marker);
      })

    });
}
      