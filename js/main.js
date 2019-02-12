function initMap() {
    navigator.geolocation.getCurrentPosition(function(position) {
        var latlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        var markers = [];
        var element = document.getElementById('map');
        var options = {
          zoom: 2,
          center: latlng,
          
        };
        
        var map = new google.maps.Map(element, options);

        marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Your current location!"
            });
        if(latlng){
            var InfoWindow = new google.maps.InfoWindow({
                content: '<h2>Your current location!</h2>'               
                });
            marker.addListener('click', function(){
                InfoWindow.open(Map, marker);
                });
        }

        // console.log(latlng);
        
        fetch("https://restcountries.eu/rest/v2/all")
        .then(res => res.json())
        .then(data => initialize(data))
        .catch(err => console.log("Error:", err));

        function initialize(countriesData) {
            countries = countriesData;
            countries.forEach(function (latlng, i, alpha3Code){
                addMarker(countries[i], countries[i].name, countries[i].population, countries[i].alpha3Code, countries[i].area, countries[i].capital, countries[i].timezones);
             
             });
             
        }   

        function addMarker(latlng, name, population, alpha3Code, area, capital, timezones) {
            
            var position = new google.maps.LatLng(latlng.latlng[0], latlng.latlng[1]);
            var marker = new google.maps.Marker({
                position: position,
                map: map,
                });
                markers.push(latlng);
                // console.log(markers);

            if(name){
            
                var InfoWindow = new google.maps.InfoWindow({
                    content: '<h2>Country: '+name+'</h2>'
                    +'<div>Capital: '+capital+'</div>'
                    +'<div>Population: '+population+'</div>'
                    +'<div>alpha3Code: '+alpha3Code+'</div>'
                    +'<div>Area: '+area+' sq. m.</div>'
                    +'<div>Timezones: '+timezones+'</div>'
                    +'<div>Coordinates: '+latlng.latlng[0]+', '+latlng.latlng[1]+'</div>'                    
                    });
            marker.addListener('click', function(){
                    InfoWindow.open(map, marker);
                    });
            
            }
                    
        }     
        var markerCluster = new MarkerClusterer(map, markers,
            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    })
}
      
  