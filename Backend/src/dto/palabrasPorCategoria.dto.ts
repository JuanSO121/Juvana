import { CategoriaResponse } from "./categoria.dto";
import { PalabraResponse } from "./palabra.dto";

export class PalabrasPorCategoriaResponse{
    // id: number;
    cate_id: CategoriaResponse;
    pala_id: PalabraResponse;
}
