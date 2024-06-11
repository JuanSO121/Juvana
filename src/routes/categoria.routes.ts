
import * as express from "express";
import { CategoriaController } from "../controllers/categoria.controller";
//ND
const Router = express.Router();
const categoriaController = new CategoriaController();

Router.get(
    "/categoria",
    categoriaController.getByNombre
  );

  Router.get(
    "/categoria/:id",
    categoriaController.getById
  );

  Router.post(
    "/categoria",
    categoriaController.save
  );

  Router.put(
    "/categoria",
    categoriaController.update
  )

  Router.delete(
    "/categoria/:id",
    categoriaController.delete
  )

  
  Router.post(
    "/categoria/asociar-palabra",
    categoriaController.saveAsociacionPalabraCategoria
  );

  Router.post(
    "/categoria/desvincular-palabra",
    categoriaController.desvincularPalabraCategoria
  );

  export { Router as categoriaRouter };