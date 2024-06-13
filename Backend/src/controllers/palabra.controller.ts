import { Request, Response } from "express";
import { PalabraResponse } from "../dto/palabra.dto";
import { PalabraRepository } from "../repositories/palabra.repository";
import { Palabra } from "../entity/Palabra.entity";
import { v4 as uuidv4 } from 'uuid';
//ND
export class PalabraController {
    private palabraRepository: PalabraRepository = new PalabraRepository();

    public getById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const palabra: Palabra = await this.palabraRepository.findById(Number(id));
            if (palabra === null) {
                res.status(404).json({ error: 'This word doesn\'t exist' });
            }
            res.status(200).json({ palabra });
        } catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }

    public getByTexto = async (req: Request, res: Response) => {
        try {
            const texto = <string>req.query.texto;
            console.log(texto);
            const palabra: PalabraResponse = await this.palabraRepository.findByTexto(texto);
            return res.status(200).json({ palabra });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    };

    public save = async (req: Request, res: Response) => {
        const body = req.body;
        const texto = body.texto;
        try {
            const existingPalabra = await this.palabraRepository.findByTexto(texto);
            if (existingPalabra) {
                return res.status(400).json({ error: 'Ya existe esa Palabra' });
            }
    
            const result: Palabra = await this.palabraRepository.save(body);
            return res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    
    
    public update = async (req: Request, res: Response) => {
        const body = req.body;
        try {
            const id = body.id;
            let palabraToUpdate: Palabra | undefined = await this.palabraRepository.findById(Number(id));
            
            if (!palabraToUpdate) {
                return res.status(404).json({ error: 'palabra no encontrada' });
            }
            
            palabraToUpdate.texto = body.texto;


            const result: Palabra = await this.palabraRepository.save(palabraToUpdate);
            
            return res.status(200).json(result);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    public delete = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            await this.palabraRepository.delete(Number(id));
            res.status(200).json({ message: 'Deleted' });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    public getAll = async (req: Request, res: Response) => {
        const texto = <string> req.query.texto;
        try {
            const palabras: Palabra[] = await this.palabraRepository.getAll();
            return res.status(200).json(palabras);
        } catch (error) {
             res.status(400).json({ error: error.message });
       }
    }
}
