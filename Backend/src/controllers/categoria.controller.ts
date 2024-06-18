import { Request, Response } from "express";
import { CategoriaResponse } from "../dto/categoria.dto";
import { CategoriaRepository } from "../repositories/categoria.repository";
import { Categoria } from "../entity/Categoria.entity";
import { PalabraRepository } from "../repositories/palabra.repository";
import { PalabrasPorCategoriaRepository } from "../repositories/palabrasPorCategoria.repository";
import { Palabra } from "../entity/Palabra.entity";
import { PalabrasPorCategoria } from "../entity/PalabrasPorCategoria.entity";
import { v4 as uuidv4 } from 'uuid';
//ND
export class CategoriaController{
    private categoriaRepository: CategoriaRepository = new CategoriaRepository();
    private palabraRepository: PalabraRepository = new PalabraRepository();
    private palabrasPorCategoriaRepository: PalabrasPorCategoriaRepository = new PalabrasPorCategoriaRepository();

        public getById = async (req: Request, res: Response) => {
        const {id} = req.params;
        try {
            console.log('Promise unresolved');
            const categoria: Categoria = await this.categoriaRepository.findById(Number(id));
            ;
            if(categoria === null){
                res.status(404).json({ error: 'Categoria doesnt exists'});
            }
            res.status(200).json({categoria});
            
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    public getByNombre = async (req: Request, res: Response) => {
        try {
            const nombre = <string>req.query.nombre;
            console.log(nombre);
            const categoria: CategoriaResponse = await this.categoriaRepository.findByNombre(nombre);
            return res.status(200).json({ categoria });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    public save = async (req: Request, res: Response) => {
        const body = req.body;
        const nombre = body.nombre;
        try {
            // Verificar si ya existe una categoría con el mismo nombre
            const existingCategoria = await this.categoriaRepository.findByNombre(nombre);
            if (existingCategoria) {
                return res.status(400).json({ error: 'Ya existe una categoría con este nombre' });
            }
    
            // Si no existe una categoría con el mismo nombre, guardarla
            const result: Categoria = await this.categoriaRepository.save(body);
            return res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    

    public update = async (req: Request, res: Response) => {
        const body = req.body;
        try {
            const id = body.id;
            let categoriaToUpdate: Categoria | undefined = await this.categoriaRepository.findById(Number(id));
            
            if (!categoriaToUpdate) {
                return res.status(404).json({ error: 'categoria no encontrada' });
            }
            
            categoriaToUpdate.nombre = body.nombre;

            const result: Categoria = await this.categoriaRepository.save(categoriaToUpdate);
            
            return res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    public delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            await this.categoriaRepository.delete(Number(id));
            res.status(200).json({ message: 'Deleted' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    public saveAsociacionPalabraCategoria = async (req: Request, res: Response) => {
        const { cate_id, pala_id } = req.body;

        try {

            const nuevaAsociacion = new PalabrasPorCategoria();
            nuevaAsociacion.cate_id = cate_id;
            nuevaAsociacion.pala_id = pala_id;

            const result: PalabrasPorCategoria = await this.palabrasPorCategoriaRepository.save(nuevaAsociacion);

            return res.status(200).json(result);
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    public desvincularPalabraCategoria = async (req: Request, res: Response) => {
        const { cate_id, pala_id } = req.body;

        try {
            // Verificar si la asociación existe
            const asociacionExistente = await this.palabrasPorCategoriaRepository.findByCategoryAndPalabra(cate_id, pala_id);
            if (!asociacionExistente) {
                return res.status(404).json({ error: 'La asociación entre la categoría y la palabra no existe' });
            }

            // Eliminar la asociación de la base de datos
            await this.palabrasPorCategoriaRepository.deleteByCategoryAndPalabra(cate_id, pala_id);

            // Devolver éxito en la respuesta
            return res.status(200).json({ message: 'La asociación ha sido eliminada correctamente' });
        } catch (error) {
            // Manejar cualquier otro error y devolverlo como respuesta
            return res.status(400).json({ error: error.message });
        }
    }

    
}
