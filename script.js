// initialize the map 
var map = L.map('map').setView([40.7128, -74.0060], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

function fetchFoursquareData(category) {
  var latitude = map.getCenter().lat;
  var longitude = map.getCenter().lng;
  
  // Foursquare API request
  var url = `https://api.foursquare.com/v2/venues/explore?client_id=ZGFXOLYUP2T0W4T1TMUVHWHFALHTT1ZBOFDFBDZJ5PNHGPGG&client_secret=4HYXPU5IDMRYVW1HL01Y0XLHZL3GAWD2SFJQ5X0AGUW5NAEI&v=20220101&ll=${latitude},${longitude}&query=${category}&radius=500&limit=10`;

  // fetch data (API)
  fetch(url)
    .then(response => response.json())
    .then(data => {
      // Clear existing markers
      map.eachLayer(function(layer) {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // map marking
      data.response.groups[0].items.forEach(item => {
        var venue = item.venue;
        L.marker([venue.location.lat, venue.location.lng]).addTo(map)
          .bindPopup(`<b>${venue.name}</b><br>${venue.location.address}<br>${venue.location.city}`);
      });
    })
    .catch(error => console.error('Error fetching data:', error));
}

// form sub
document.getElementById('business-submit').addEventListener('click', function(event) {
  event.preventDefault(); // prevent default form submission

  // dropdown menu
  var category = document.getElementById('business-select').value;
  
  // fetch data for selected category
  fetchFoursquareData(category);
});

// get user's location 
function getUserLocation() {
    navigator.geolocation.getCurrentPosition(position => {
      var userLatitude = position.coords.latitude;
      var userLongitude = position.coords.longitude;
      
      // marker for user's location
      L.marker([userLatitude, userLongitude]).addTo(map)
        .bindPopup('Your Location').openPopup();
    }, error => {
      console.error('Error getting user location:', error);
    });
}

// handle map click event
function onMapClick(event) {
    // log the coordinates of the clicked location
    console.log('Map clicked at:', event.latlng);
}

// get user's location
getUserLocation();

map.on('click', onMapClick);
