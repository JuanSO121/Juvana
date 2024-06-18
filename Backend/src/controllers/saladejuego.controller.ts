import { Request, Response } from "express";
import { SaladeJuegoRepository } from "../repositories/saladeJuego.repository";
import { PalabrasPorCategoriaRepository } from "../repositories/palabrasPorCategoria.repository";
import { JugadorRepository } from "../repositories/jugador.repository";
import { PalabraRepository } from "../repositories/palabra.repository";
import { SaladeJuego } from "../entity/SaladeJuego.entity";
import { Jugador } from "../entity/Jugador.entity";

export class SaladeJuegoController {
    private saladeJuegoRepository = new SaladeJuegoRepository();
    private palabrasPorCategoriaRepository = new PalabrasPorCategoriaRepository();
    private jugadorRepository = new JugadorRepository();
    private palabraRepository = new PalabraRepository();

    public adivinarPalabra = async (req: Request, res: Response) => {
        const { jugadorId, palabra } = req.body;
        try {
            const jugador = await this.jugadorRepository.findById(jugadorId);
            if (!jugador) {
                return res.status(404).json({ error: 'Jugador no encontrado' });
            }

            const palabraCorrecta = await this.palabraRepository.findByTexto(palabra);
            if (!palabraCorrecta) {
                return res.status(400).json({ error: 'Palabra incorrecta' });
            }

            const puntaje = this.calcularPuntaje(jugador.salade_juego_id);
            jugador.puntaje += puntaje;
            await this.jugadorRepository.save(jugador);

            this.notificarJugadores(jugador.salade_juego_id.id, `El jugador ${jugador.nombre} adivinó la palabra y ganó ${puntaje} puntos`);

            return res.status(200).json({ message: 'Palabra adivinada correctamente', puntaje });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    };

    private calcularPuntaje(salaDeJuego: SaladeJuego): number {
        return 100; // Example fixed score
    }

    private notificarJugadores(salade_juego_id: number, mensaje: string) {
        // WebSocket logic to notify players
        console.log(`Notificación a la sala ${salade_juego_id}: ${mensaje}`);
    }

    public getAll = async (req: Request, res: Response) => {
        try {
            const salas: SaladeJuego[] = await this.saladeJuegoRepository.findByState('Activa');
            return res.status(200).json(salas);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    public save = async (req: Request, res: Response) => {
        const body = req.body;
        try {
            const result: SaladeJuego = await this.saladeJuegoRepository.save(body);
            return res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    public update = async (req: Request, res: Response) => {
        const body = req.body;
        try {
            const id = body.id;
            let salaToUpdate: SaladeJuego | undefined = await this.saladeJuegoRepository.findOneById(Number(id));
            
            if (!salaToUpdate) {
                return res.status(404).json({ error: 'Sala no encontrada' });
            }
            
            salaToUpdate.nombre = body.nombre;
            salaToUpdate.estado = body.estado;
            salaToUpdate.cate_id = body.cate_id; 

            const result: SaladeJuego = await this.saladeJuegoRepository.save(salaToUpdate);
            
            return res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    public updateState = async (req: Request, res: Response) => {
        const body = req.body;
        try {
            const id = body.id;
            let salaToUpdate: SaladeJuego | undefined = await this.saladeJuegoRepository.findOneById(Number(id));
            
            if (!salaToUpdate) {
                return res.status(404).json({ error: 'Sala no encontrada' });
            }
            
            salaToUpdate.estado = body.estado;

            const result: SaladeJuego = await this.saladeJuegoRepository.save(salaToUpdate);
            
            return res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    public delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            await this.saladeJuegoRepository.delete(Number(id));
            res.status(200).json({ message: 'Deleted' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    public getByCategory = async (req: Request, res: Response) => {
        const cate_id = Number(req.query.cate_id);
        if (isNaN(cate_id)) {
            return res.status(400).json({ error: 'cate_id debe ser un número' });
        }
        try {
            const salasDeJuego: SaladeJuego[] = await this.saladeJuegoRepository.findByCategory(cate_id);
            return res.status(200).json(salasDeJuego);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    public getByState = async (req: Request, res: Response) => {
        const estado = <string>req.query.estado;
        try {
            const salasDeJuego: SaladeJuego[] = await this.saladeJuegoRepository.findByState(estado);
            return res.status(200).json(salasDeJuego);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    public getPalabrasBySalaId = async (req: Request, res: Response) => {
        const { salaId } = req.params;
    
        try {
            const sala: SaladeJuego = await this.saladeJuegoRepository.findById(Number(salaId));
            if (!sala) {
                return res.status(404).json({ error: "Sala de juego no encontrada" });
            }
    
            const palabras = await this.palabrasPorCategoriaRepository.findByCategory(sala.cate_id.id);
    
            console.log("Palabras asociadas a la categoría:", palabras);
    
            return res.status(200).json(palabras);
        } catch (error) {
            console.error("Error al obtener palabras por categoría:", error);
            return res.status(500).json({ error: "Error interno del servidor" });
        }
    };
}
