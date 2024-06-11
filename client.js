// client.js

const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
  console.log('Conexión establecida con el servidor WebSocket');

  // Enviar mensaje al servidor
  ws.send('Hola desde el cliente WebSocket');
});

ws.on('message', (message) => {
  console.log(`Mensaje del servidor: ${message}`);
});
