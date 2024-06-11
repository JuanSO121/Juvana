// import { SaladeJuegoRepository } from "../repositories/saladeJuego.repository";
// import { SaladeJuegoController } from "../controllers/saladejuego.controller";

// import { WebSocket } from 'ws';
// const express = require('express');
// const router = express.Router();

// module.exports = (expressWs) => {
//     const saladeJuegoRepository = new SaladeJuegoRepository();
//     const socketController = new SocketController();

//     expressWs.applyTo(router);

//     const rooms = {};

//     router.ws('/sala/:id/unirse', (ws, req) => {
//         const roomName = req.params.id;
//         const userName = req.headers.username;

//         socketController.joinRoom(ws, roomName);

//         socketController.sendMessageToRoom(roomName, `${userName} se ha unido a la sala`);

//         ws.on('message', async function(msg) {
//             const jsonMessage: {type: string, data: any} = JSON.parse(msg);
//             if(jsonMessage.type === 'SEND_MESSAGE'){
//                 socketController.sendMessageToRoom(roomName, `${userName} dice: ${jsonMessage.data}`);
//             } else if(jsonMessage.type === 'FINISH_TURN'){
//                 const saladeJuego = await saladeJuegoRepository.getAll();
//                 socketController.sendMessageToRoom(roomName, JSON.stringify(saladeJuego));
//             }
//         });

//         ws.on('close', function() {
//             socketController.leaveRoom(ws, roomName);
//         });
//     });

//     return router;
// };

// export class SocketController {
//     public static rooms = {};

//     joinRoom(ws: WebSocket, roomName: string) {
//         if (!SocketController.rooms[roomName]) {
//             SocketController.rooms[roomName] = new Set();
//         }
//         SocketController.rooms[roomName].add(ws);
//     }
      
//     leaveRoom(ws: WebSocket, roomName: string) {
//         if (SocketController.rooms[roomName]) {
//             SocketController.rooms[roomName].delete(ws);
//             if (SocketController.rooms[roomName].size === 0) {
//                 delete SocketController.rooms[roomName];
//             }
//         }
//     }
      
//     sendMessageToRoom(roomName: string, message: string) {
//         if (SocketController.rooms[roomName]) {
//             for (const client of SocketController.rooms[roomName]) {
//                 if (client.readyState === WebSocket.OPEN) {
//                     client.send(message);
//                 }
//             }
//         }
//     }

// }
