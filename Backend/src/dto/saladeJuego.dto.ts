import { CategoriaResponse } from "./categoria.dto";

export class SaladeJuegoResponse{
    id: number;
    nombre: string;
    estado: string;
    cate_id: CategoriaResponse;
}
