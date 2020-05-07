const WebSocket = require('ws');

const redis = require("redis");
const client = redis.createClient(
  {
    host: 'redis',
    port: '6379'
  }
);

client.on("error", function(error) {
  console.error(error);
});

const wss = new WebSocket.Server({
  port: process.env.PORT || 5000,
  perMessageDeflate: {
    zlibDeflateOptions: {
      chunkSize: 1024,
      memLevel: 7,
      level: 3
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024
    },
    clientNoContextTakeover: true, 
    serverNoContextTakeover: true, 
    serverMaxWindowBits: 10,
    concurrencyLimit: 10,
    threshold: 1024 
  }
});

function getRequired(data, required) {
  let return_data = {};
  if (required != "*") {
    for (let required_item of required) {
      return_data[required_item] = data[required_item];
    }
  } 
  else return_data = data;
  return return_data;
}

function sendUpdatedData(updates) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN && client.required) {
      client.send(JSON.stringify(
        getRequired(updates, client.required)
      ));
    }
  });
}

function store(updates){
  sendUpdatedData(updates);

  client.hmset("sat_data", [
    "vbat", updates.vbat,
    "prs", updates.prs,
    "t1", updates.t1,
    "t2", updates.t2,
    "f", updates.f,
    "ax", updates.ax,
    "ay", updates.ay,
    "az", updates.az,
    "pitch", updates.pitch,
    "yaw", updates.yaw,
    "roll", updates.roll,
    "lat", updates.lat,
    "lon", updates.lon,
    "alt", updates.alt
  ]);
}

function sendStoredData(conn, required) {

  client.hgetall("sat_data", (err, data) => {
    if (err) {
      throw err;
    }
    else {
      if (data) {
        conn.send(JSON.stringify(
          getRequired(data, required)
        ));
      } 
      else {
        conn.send("{}");
      }
    }
  });
}

wss.on('connection', ws => {
  ws.on('message', msg => {
    try {
      msg = JSON.parse(msg);
      if (!ws.authenticated) {
        if (msg.token == process.env.TOKEN) {
          ws.authenticated = true;
          delete msg.token;
          store(msg);
        }
        else {
          if (msg.required) {
            ws.required = msg.required;
            sendStoredData(ws, msg.required);
          }
        }
      }
      else {
        if (msg.token) delete msg.token;
        store(msg);
      }
    } catch (e) {
      console.log(e);
    }
  });
})