const WebSocket = require('ws');

const wss = new WebSocket.Server({
  port: 8080
});

wss.on('connection', function connection(ws) {
  console.log('server connection')

  ws.on('message', function incoming(message) {
    console.log('received: %s', message);
    ws.send(JSON.stringify(JSON.parse(message))) // 把收到的讯息回传给对方
  });
});