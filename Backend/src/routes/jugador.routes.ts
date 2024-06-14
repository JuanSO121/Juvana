// routes/jugador.ts
import { Router } from 'express';
import { JugadorRepository } from '../repositories/jugador.repository';

const router = Router();
const jugadorRepository = new JugadorRepository();

router.post('/join', async (req, res) => {
    const { userName, roomName } = req.body;

    try {
        const jugador = await jugadorRepository.create({ nombre: userName, puntaje: 0, salade_juego_id: roomName });
        res.json({ jugadorId: jugador.id });
    } catch (error) {
        res.status(500).send('Error joining room');
    }
});

export default router;
