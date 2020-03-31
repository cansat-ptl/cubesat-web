import leaflet from 'leaflet';
import leafletFullscreen from 'leaflet-fullscreen';

let satellite = leaflet.icon({
    iconUrl: 'images/satellite.png',
    iconSize: [50,50],
});

let world = leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  maxZoom: 19,
  attribution: `Powered by <a href="https://esri.com">Esri</a>`
});

let labels = leaflet.tileLayer('https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}');


let map = leaflet.map('map', {
  fullscreenControl: true,
  center: [45, 90],
  zoom: 3,
  scrollWheelZoom: false,
  layers: [world, labels]
});


let markers = leaflet.layerGroup().addTo(map);
let rendered = false; 


let socket = new WebSocket("ws://localhost:5000");

socket.onmessage = event => {
  let data = JSON.parse(event.data);

  if (!rendered) {
    map.flyTo([data.lat, data.lng]);
    rendered = true;
  }

  markers.clearLayers();
  leaflet.marker([data.lat, data.lng], {
    icon: satellite
  }).addTo(markers);
};

socket.onerror = error => {
  console.log(`${error.message}`);
};