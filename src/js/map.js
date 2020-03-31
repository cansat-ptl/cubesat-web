import leaflet from 'leaflet';
import leafletFullscreen from 'leaflet-fullscreen';

let satellite = leaflet.icon({
    iconUrl: 'images/satellite.png',
    iconSize: [50,50],
});

let map;
let rendered = false; 
let markers;

let socket = new WebSocket("ws://localhost:5000");

socket.onmessage = event => {
  let data = JSON.parse(event.data);

  if (!rendered) {
    map = leaflet.map('map', {
      fullscreenControl: true,
      center: [data.lat, data.lon],
      zoom: 4,
      scrollWheelZoom: false
    });

    markers = leaflet.layerGroup().addTo(map);
    
    leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    }).addTo(map);

    rendered = true;
  }
  markers.clearLayers();
  leaflet.marker([data.lat, data.lon], {
    icon: satellite
  }).addTo(markers);
};

socket.onerror = error => {
  console.log(`${error.message}`);
};