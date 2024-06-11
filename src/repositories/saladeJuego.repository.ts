import { SaladeJuego } from "../entity/SaladeJuego.entity";
import { AppDataSource } from "../data-source";
import { Like } from "typeorm";
export class SaladeJuegoRepository {
    private repository = AppDataSource.getRepository(SaladeJuego);
    
    async findByNombre(nombre: string) {
        return this.repository.findOne({ where: { nombre } });
    }

    async findOneById(id: number) {
        return this.repository.findOne({ where: { id } });
    }
    async findById(id: number) {
        return this.repository.findOne({ where: { id }, relations: ["cate_id"] });
    }
    
    
    async save(saladeJuego: SaladeJuego) {
        return this.repository.save(saladeJuego);
    }

    async delete(id: number) {
        return this.repository.delete(id);
    }

    async findAllByNombre(nombre: string) {
        return this.repository.find({ where: { nombre } });
    }

    async findAllByEstado(estado: string) {
        return this.repository.find({ where: { estado: estado } });
    }
    
    async getAll(estado?: string) {
        return this.repository.find(estado ? { where: { estado } } : {});
    }

    async findByName(nombre: string) {
        return this.repository.find({ where: { nombre } });
    }

    async findByCategory(cate_id: number) {
        return this.repository.find({ where: { cate_id: { id: cate_id } } });
    }
    
    
    async findByState(estado: string) {
        return this.repository.find({ where: { estado } });
    }

    async findBySalaId(salaId: number) {
        // Buscar la sala de juego
        const sala = await this.repository.findOne({ where: { id: salaId }, relations: ["cate_id"] });
    
        // Si la sala de juego no existe, devolver null
        if (!sala) {
            return null;
        }
    
        // Si la sala de juego existe, devolver la sala de juego con su categoría asociada
        return sala;
    }

    async updateState(roomName: string, estado: string): Promise<void> {
        const sala = await this.findByNombre(roomName);
        if (sala) {
            sala.estado = estado;
            await this.repository.save(sala);
        }
    }
    

    
    
}
