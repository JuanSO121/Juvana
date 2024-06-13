import { SaladeJuegoRepository } from "../repositories/saladeJuego.repository";
import { PalabraRepository } from "../repositories/palabra.repository";
import { JugadorRepository } from "../repositories/jugador.repository";
import { Express, Request, Response } from 'express';
import { WebSocket, Server } from 'ws';

const express = require('express');
const router = express.Router();

module.exports = (expressWs) => {
    const saladeJuegoRepository = new SaladeJuegoRepository();
    const palabraRepository = new PalabraRepository();
    const jugadorRepository = new JugadorRepository();
    expressWs.applyTo(router);

    const rooms: { [key: string]: { players: Array<{ ws: WebSocket, userName: string, avatar: string, puntaje: number, id: number, hasGuessed: boolean }>, currentTurnIndex: number, currentWord: string, startTime: number, timeout: NodeJS.Timeout | null, roundCount: number } } = {};

    router.ws('/room/:roomName', async (ws, req) => {
        const roomName = req.params.roomName;
        const userName = req.headers.username as string;
        const avatar = req.headers.avatar as string;
    
        try {
            const sala = await saladeJuegoRepository.findByNombre(roomName);
            if (!sala) {
                ws.send('La sala especificada no existe');
                ws.close();
                return;
            }
    
            if (!rooms[roomName]) {
                rooms[roomName] = { players: [], currentTurnIndex: 0, currentWord: '', startTime: Date.now(), timeout: null, roundCount: 0 };
            }
    
            const room = rooms[roomName];
            if (room.players.length >= 6) {
                ws.send('La sala está llena');
                ws.close();
                return;
            }
    
            const jugador = await jugadorRepository.create({ nombre: userName, puntaje: 0, salade_juego_id: sala });
            room.players.push({ ws, userName, avatar, puntaje: 0, id: jugador.id, hasGuessed: false });
            await updateRoomState(roomName);
    
            room.players.forEach(client => {
                if (client.ws !== ws && client.ws.readyState === ws.OPEN) {
                    client.ws.send(`${userName} has joined`);
                }
            });
    
            if (room.players.length === 2) {
                startNewTurn(roomName);
            }
    
            // Manejador de eventos cuando un jugador se desconecta
            ws.on('close', async function () {
                // Buscar el jugador desconectado en la lista de jugadores de la sala
                const playerIndex = room.players.findIndex(client => client.ws === ws);
                const disconnectedPlayer = room.players[playerIndex];
    
                // Eliminar el jugador de la base de datos
                await jugadorRepository.delete(disconnectedPlayer.id);
    
                // Remover el jugador de la lista de jugadores en la sala
                room.players.splice(playerIndex, 1);
    
                if (room.players.length === 0) {
                    if (room.timeout) {
                        clearTimeout(room.timeout);
                    }
                    delete rooms[roomName];
                    await updateRoomState(roomName);
                } else if (room.players[room.currentTurnIndex].ws === ws) {
                    room.currentTurnIndex = room.currentTurnIndex % room.players.length;
                    startNewTurn(roomName);
                }
    
                await updateRoomState(roomName);
            });
    
            ws.on('message', async function (msg) {
                const jsonMessage: { type: string, data: any } = JSON.parse(msg);
    
                if (jsonMessage.type === 'SEND_MESSAGE') {
                    handleGuess(roomName, jsonMessage.data, ws, userName);
                } else if (jsonMessage.type === 'FINISH_TURN') {
                    finishTurn(roomName);
                }
            });
    
        } catch (error) {
            console.error('Error al buscar la sala en la base de datos:', error);
            ws.send('Error al buscar la sala en la base de datos');
            ws.close();
        }
    });
    

    const handleGuess = async (roomName: string, guessedWord: string, ws: WebSocket, userName: string) => {
        const room = rooms[roomName];
        const player = room.players.find(player => player.ws === ws);
        const currentPlayer = room.players[room.currentTurnIndex];

        if (player && !player.hasGuessed && room.currentWord.toLowerCase() === guessedWord.toLowerCase() && player !== currentPlayer) {
            player.hasGuessed = true;

            const guessedPlayersCount = room.players.filter(player => player.hasGuessed && player !== currentPlayer).length;
            const points = Math.max(10 - (guessedPlayersCount - 1) * 2, 0); // 10, 8, 6, 4, 2, 0 points

            player.puntaje += points;
            await jugadorRepository.updatePuntaje(player.id, player.puntaje); // Update player score in the database

            room.players.forEach(client => {
                client.ws.send(JSON.stringify({ type: 'WORD_GUESSED', player: player.userName, points }));
            });

            if (room.players.filter(player => player !== currentPlayer).every(player => player.hasGuessed)) {
                finishTurn(roomName);
            }
        } else {
            room.players.forEach(client => {
                if (client.ws.readyState === client.ws.OPEN) {
                    client.ws.send(JSON.stringify({ type: 'CHAT_MESSAGE', player: userName, message: guessedWord }));
                }
            });
        }
    };

    const updateRoomState = async (roomName: string): Promise<void> => {
        const room = rooms[roomName];
        if (room) {
            let estado = 'available';
            if (room.players.length >= 2) {
                estado = 'full';
            } else if (room.players.length > 0) {
                estado = 'InGame';
            }
            await saladeJuegoRepository.updateState(roomName, estado);
        } else {
            await saladeJuegoRepository.updateState(roomName, 'available');
        }
    };

    const startNewTurn = async (roomName: string) => {
        const room = rooms[roomName];
        if (room && room.players.length >= 2) {
            room.players.forEach(player => player.hasGuessed = false); // Reset guessed state for new turn

            const currentPlayer = room.players[room.currentTurnIndex];
            const word = await getRandomWord();

            room.currentWord = word;
            room.startTime = Date.now();

            currentPlayer.ws.send(JSON.stringify({ type: 'YOUR_TURN', word }));

            room.players.forEach(player => {
                if (player.ws !== currentPlayer.ws && player.ws.readyState === currentPlayer.ws.OPEN) {
                    player.ws.send(JSON.stringify({ type: 'PLAYER_TURN', player: currentPlayer.userName }));
                }
            });

            if (room.timeout) {
                clearTimeout(room.timeout);
            }

            room.timeout = setTimeout(() => {
                finishTurn(roomName);
            }, 10000); // 2 minutes and 30 seconds
        }
    };

    const finishTurn = async (roomName: string) => {
        const room = rooms[roomName];
        if (room) {
            room.roundCount += 1;
        
            if (room.timeout) {
                clearTimeout(room.timeout);
            }
        
            const winner = room.players.find(player => player.puntaje >= 100);
            if (winner || room.roundCount >= 5) {
                const results = room.players.map(player => ({
                    userName: player.userName,
                    puntaje: player.puntaje
                }));
        
                room.players.forEach(player => {
                    player.ws.send(JSON.stringify({ type: 'GAME_OVER', results }));
                });
        
                // Espera unos segundos para que los jugadores vean los resultados
                setTimeout(async () => {
                    // Cerrar las conexiones de WebSocket y eliminar los jugadores de la base de datos
                    for (const player of room.players) {
                        if (player.ws.readyState === player.ws.OPEN) {
                            player.ws.close();
                        }
                        // Eliminar el jugador de la base de datos
                        await jugadorRepository.delete(player.id);
                    }
        
                    // Limpiar el estado de la sala
                    delete rooms[roomName];
                    await saladeJuegoRepository.updateState(roomName, 'available');
                }, 5000); // 5 segundos de espera antes de cerrar las conexiones y eliminar los jugadores
        
            } else {
                // Avanza al siguiente turno si el juego no ha terminado
                room.currentTurnIndex = (room.currentTurnIndex + 1) % room.players.length;
                startNewTurn(roomName);
            }
        }
    };
    

    const getRandomWord = async (): Promise<string> => {
        const words = await palabraRepository.getAll();
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex].texto;
    };

    router.ws('/notificaciones', (ws: any, req: Request) => {
        ws.on('message', (msg: string) => {
            console.log(`Mensaje recibido: ${msg}`);
        });

        ws.send('Conexión establecida');
    });

    return router;
};
