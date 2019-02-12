function initMap() {
   
    navigator.geolocation.getCurrentPosition(function(position) {
        var latlng = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);
        var map = new google.maps.Map(document.getElementById('map'), {
          zoom: 2,
          center: latlng
        });
        marker = new google.maps.Marker({
            position: latlng,
            map: map,
            title: "Your current location!"
            });
       
    
        var locations = [];
        
        var names = [];
        fetch("https://restcountries.eu/rest/v2/all")
          .then(res => res.json())
          .then(data => initialize(data))
          .then(res => {
              
            var markers = res.map(function(location, i) {
                return new google.maps.Marker({
                  position: location,
                  
                });
              });
              var markerCluster = new MarkerClusterer(map, markers,
                {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
          })
          .catch(err => console.log("Error:", err));
        function initialize(countries) {
          // console.log(countries)
          let clasterData = [];
          let data = [];
           countries.forEach((countrie) => {
               if(countrie.latlng[0] && countrie.latlng[1]){
                console.log(countrie.latlng);
                data={
                    lat: countrie.latlng[0],
                    lng: countrie.latlng[1]
                   };
                   clasterData.push(data);
                }
            })
           
           return clasterData;
        }
    });
}