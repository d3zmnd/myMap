function initMap() {

        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 2,
          center: {lat: -28.024, lng: 140.887}
        });

               
          var markers = locations.map(function(location, i) {
          var position = new google.maps.LatLng(location[0], location[1]);

          // console.log(location[0]);
          return new google.maps.Marker({
            position: position,
            });

            // if(position){
            
            //     var InfoWindow = new google.maps.InfoWindow({
            //         content: '<h2>Country: '+names+'</h2>'
            //         +'<div>Capital: '+capital+'</div>'
            //         +'<div>Population: '+population+'</div>'
            //         +'<div>alpha3Code: '+alpha3Code+'</div>'
            //         +'<div>Area: '+area+' sq. m.</div>'
            //         +'<div>Timezones: '+timezones+'</div>'
            //         +'<div>Coordinates: '+location[0]+', '+location[1]+'</div>'                    
            //         });
            // marker.addListener('click', function(){
            //         InfoWindow.open(map, google.maps.Marker);
            //         });
            
            // }
        });

       
        var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
      }
          var locations = [];
          var names = [];
          fetch("https://restcountries.eu/rest/v2/all")
            .then(res => res.json())
            .then(data => initialize(data))
            .catch(err => console.log("Error:", err));
        function initialize(countriesData) {
            countries = countriesData;
            
            countries.forEach(function (latlng, i, alpha3Code){
                locations.push(countries[i].latlng);
                names.push(countries[i].name);
                // console.log(countries[i].latlng);
             
             });
            
        } 
        