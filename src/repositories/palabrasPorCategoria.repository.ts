import { PalabrasPorCategoria } from "../entity/PalabrasPorCategoria.entity";
import { AppDataSource } from "../data-source";

export class PalabrasPorCategoriaRepository {
    private repository = AppDataSource.getRepository(PalabrasPorCategoria);

    async save(palabrasPorCategoria: PalabrasPorCategoria): Promise<PalabrasPorCategoria> {
        return this.repository.save(palabrasPorCategoria);
    }

    async findByCategory(cate_id: number) {
        return this.repository.find({ where: { categoria: { id: cate_id } } });
    }

    async findByPalabra(pala_id: number) {
        return this.repository.find({ where: { palabra: { id: pala_id } } });
    }

    async findByCategoryAndPalabra(cate_id: number, pala_id: number): Promise<PalabrasPorCategoria | undefined> {
        return this.repository.findOne({ where: { cate_id, pala_id } });
    }

    async deleteByCategoryAndPalabra(cate_id: number, pala_id: number): Promise<void> {
        await this.repository.delete({ cate_id, pala_id });
    }
}
