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

let socket = new WebSocket("ws://94.130.56.130:5000");
socket.onopen = e => {
  socket.send(JSON.stringify(
    {
      "required": "*"
    }
  ));
}

socket.onmessage = event => {
  let data = JSON.parse(event.data);
  try {
    let tel = document.getElementById('telemetry');
    tel.innerHTML = `<hr>
    <div>
        <h1>Напряжение</h1>
        <p>${data.vbat} Вольт</p>
    </div>
    <div>
        <h1>Давление</h1>
        <p>${data.prs} Паскаль</p>
    </div>
    <div>
        <h1>Высота </h1>
        <p>${data.alt} метров</p>
    </div>
    <div>
        <h1>Температура снаружи</h1>
        <p>${data.t1}ºC</p>
    </div>
    <div>
        <h1>Температура внутри</h1>
        <p>${data.t2}ºC</p>
    </div>
    <div>
        <h1>Флаги </h1>
        <p>${data.f}</p>
    </div>
    <div>
        <h1>Ускорение X</h1>
        <p>${data.ax} м/с^2</p>
    </div>
    <div>
        <h1>Ускорение Y</h1>
        <p>${data.ay} м/с^2</p>
    </div>
    <div>
        <h1>Ускорение Z</h1>
        <p>${data.az} м/с^2</p>
    </div>
    <div>
        <h1>Тангаж </h1>
        <p>${data.pitch}</p>
    </div>
    <div>
        <h1>Рысканье</h1>
        <p>${data.yaw}</p>
    </div>
    <div>
        <h1>Крен</h1>
        <p>${data.roll}</p>
    </div>
    <div class="clear"></div>`;
  } catch(e) {}
  if (!rendered) {
    map.flyTo([data.lat, data.lon]);
    rendered = true;
  }

  markers.clearLayers();
  leaflet.marker([data.lat, data.lon], {
    icon: satellite
  }).addTo(markers);
};

socket.onerror = error => {
  console.log(error);
};
