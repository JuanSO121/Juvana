const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const saladeJuegoRouter= require ("../src/routes/saladeJuego.routes");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/saladejuego', saladeJuegoRouter);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  console.log('Un cliente se ha conectado.');

  // Manejador de evento para unirse a una sala
  socket.on('joinRoom', (roomName, userName) => {
    socket.join(roomName);
    console.log(`${userName} se ha unido a la sala ${roomName}.`);
  });

  // Manejador de evento para enviar un mensaje
  socket.on('sendMessage', (roomName, userName, message) => {
    io.to(roomName).emit('message', { userName, message });
    console.log(`${userName} en la sala ${roomName}: ${message}`);
  });

  // Manejador de eventos de desconexión de Socket.IO
  socket.on('disconnect', () => {
    console.log('Un cliente se ha desconectado.');
  });
});
