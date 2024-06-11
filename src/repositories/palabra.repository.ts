import { Palabra } from "../entity/Palabra.entity";
import { AppDataSource } from "../data-source";

export class PalabraRepository {
    private repository = AppDataSource.getRepository(Palabra);

    async findByTexto(texto: string) {
        return this.repository.findOne({ where: { texto } });
    }

    async findById(id: number) {
        return this.repository.findOne({ where: { id } });
    }

    async save(palabra: Palabra){
        return this.repository.save(palabra);
    }

    async delete(id: number){
        return this.repository.delete(id);
    }

    async getAll() {
        return this.repository.find();
    }  
}
