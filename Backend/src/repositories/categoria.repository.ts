import { Categoria } from "../entity/Categoria.entity";
import { AppDataSource } from "../data-source";
//ND
export class CategoriaRepository {
    private repository = AppDataSource.getRepository(Categoria);

    async findByNombre(nombre: string) {
        return this.repository.findOne({ where: { nombre } });
    }

    async findById(id: number) {
        return this.repository.findOne({ where: { id } });
    }
    
    async save(categoria: Categoria){
        return this.repository.save(categoria);
    }
   
    async delete(id: number){
        return this.repository.delete(id);
    }

    

    
    
}
