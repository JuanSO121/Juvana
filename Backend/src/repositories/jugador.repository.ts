import { Jugador } from "../entity/Jugador.entity";
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";

export class JugadorRepository {
    private repository: Repository<Jugador>;

    constructor() {
        this.repository = AppDataSource.getRepository(Jugador);
    }

    async findById(id: number): Promise<Jugador | null> {
        return this.repository.findOne({ where: { id } });
    }

    async findByName(nombre: string): Promise<Jugador | null> {
        return this.repository.findOne({ where: { nombre } });
    }

    async save(jugador: Jugador): Promise<Jugador> {
        return this.repository.save(jugador);
    }

    async update(jugador: Jugador): Promise<Jugador> {
        return this.repository.save(jugador);
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete(id);
    }

    async create(data: Partial<Jugador>): Promise<Jugador> {
        const jugador = this.repository.create(data);
        return await this.repository.save(jugador);
    }

    async updatePuntaje(id: number, puntaje: number): Promise<Jugador | null> {
        try {
            const jugador = await this.repository.findOne({ where: { id } });

            if (!jugador) {
                throw new Error("Jugador not found");
            }

            jugador.puntaje = puntaje;
            return await this.repository.save(jugador);
        } catch (error) {
            console.error("Error updating puntaje:", error);
            return null;
        }
    }
}
