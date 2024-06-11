import { CategoriaResponse } from "../dto/categoria.dto";
import { PalabraResponse } from "../dto/palabra.dto";

export class PalabrasPorCategoriaResponse{
    // id: number;
    cate_id: CategoriaResponse;
    pala_id: PalabraResponse;
}
