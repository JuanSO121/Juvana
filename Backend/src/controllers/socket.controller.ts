import { WebSocket, Server } from 'ws';
import { SaladeJuegoRepository } from "../repositories/saladeJuego.repository";
import { JugadorRepository } from "../repositories/jugador.repository";

export class SocketController {
    private saladeJuegoRepository = new SaladeJuegoRepository();
    private static rooms: { [key: string]: Set<WebSocket> } = {};

    public joinRoom(ws: WebSocket, roomName: string): void {
        if (!SocketController.rooms[roomName]) {
            SocketController.rooms[roomName] = new Set();
        }
        SocketController.rooms[roomName].add(ws);
        console.log(`User joined room: ${roomName}`);
    }

    public leaveRoom(ws: WebSocket, roomName: string): void {
        const room = SocketController.rooms[roomName];
        if (room) {
            room.delete(ws);
            console.log(`User left room: ${roomName}`);
            if (room.size === 0) {
                delete SocketController.rooms[roomName];
                console.log(`Room ${roomName} deleted as it became empty`);
            }
        }
    }

    public sendMessageToRoom(roomName: string, message: string): void {
        const room = SocketController.rooms[roomName];
        if (room) {
            for (const client of room) {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            }
            console.log(`Message sent to room ${roomName}: ${message}`);
        } else {
            console.log(`Room ${roomName} does not exist`);
        }
    }

    public handleConnection(ws: WebSocket): void {
        ws.on('message', (message: string) => {
            const parsedMessage = JSON.parse(message);
            switch (parsedMessage.type) {
                case 'join':
                    this.joinRoom(ws, parsedMessage.roomName);
                    break;
                case 'leave':
                    this.leaveRoom(ws, parsedMessage.roomName);
                    break;
                case 'message':
                    this.sendMessageToRoom(parsedMessage.roomName, parsedMessage.content);
                    break;
                default:
                    console.log(`Unknown message type: ${parsedMessage.type}`);
            }
        });

        ws.on('close', () => {
            for (const roomName in SocketController.rooms) {
                if (SocketController.rooms[roomName].has(ws)) {
                    this.leaveRoom(ws, roomName);
                }
            }
        });
    }
}
