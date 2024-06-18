import * as express from "express";
import { SaladeJuegoController } from "../controllers/saladejuego.controller";
import { SaladeJuegoRepository } from '../repositories/saladeJuego.repository';
const Router = express.Router();
const saladejuegoController = new SaladeJuegoController();
const saladeJuegoRepository = new SaladeJuegoRepository();
  
Router.get("/saladejuego", saladejuegoController.getAll);
Router.get("/saladejuego/:id", saladejuegoController.getPalabrasBySalaId);
Router.post("/saladejuego", saladejuegoController.save);
Router.put("/saladejuego", saladejuegoController.update);
Router.put("/saladejuego/state", saladejuegoController.updateState);
Router.delete("/saladejuego/:id", saladejuegoController.delete);
Router.get("/saladejuego/category", saladejuegoController.getByCategory);
Router.get("/saladejuego/state", saladejuegoController.getByState);
Router.post("/adivinar", saladejuegoController.adivinarPalabra);

Router.get('/rooms', async (req, res) => {
    try {
        const salas = await saladeJuegoRepository.getAll();
        res.json(salas);
    } catch (error) {
        res.status(500).send('Error retrieving rooms');
    }
});

export { Router as saladeJuegoRouter };
