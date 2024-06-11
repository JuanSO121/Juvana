import * as express from "express";
import { SaladeJuegoController } from "../controllers/saladejuego.controller";

const Router = express.Router();
const saladejuegoController = new SaladeJuegoController();
  
Router.get("/saladejuego", saladejuegoController.getAll);
Router.get("/saladejuego/:id", saladejuegoController.getPalabrasBySalaId);
Router.post("/saladejuego", saladejuegoController.save);
Router.put("/saladejuego", saladejuegoController.update);
Router.put("/saladejuego/state", saladejuegoController.updateState);
Router.delete("/saladejuego/:id", saladejuegoController.delete);
Router.get("/saladejuego/category", saladejuegoController.getByCategory);
Router.get("/saladejuego/state", saladejuegoController.getByState);
Router.post("/adivinar", saladejuegoController.adivinarPalabra);

export { Router as saladeJuegoRouter };
