/* maps.js - holds the interactive map with two locations */
/* the two places that will be shown on the map */

var places = [
    {name: 'Cape Town City Centre', lat: -33.9249, lng: 18.4241, info: 'Our head office in the city centre.' },
    {name: 'V&A Waterfront', lat: -33.9036, lng: 18.4207, info: 'Our tour check-in point at the Waterfront.' }
];
var map = L.map('map').setView([-33.914, 18.422], 13);

/*Will add the map pictures from the OpenStreetMap */
L.tileLayer('https://tile.openstreetmap.de/{z}/{x}/{y}.png', {
    maxZoom: 19, attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

/* This will put a marker with a popup on each place */
var markers = places.map(function (p) {
    return L.marker([p.lat, p.lng]).addTo(map)
    .bindPopup('<strong>' + p.name + '</strong><br>' + p.info);
});

/* The buttons zoom the map to the chosen place and open its pop-up */
document.querySelectorAll('[data-place]').forEach(function (btn) {
    btn.addEventListener('click', function (){
    var i = Number(btn.dataset.place);
    map.flyTo([places[i].lat, places[i].lng], 16);
    markers[i].openPopup();
});

});