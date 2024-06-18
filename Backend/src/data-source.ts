import "reflect-metadata";
import { DataSource } from "typeorm";

import * as dotenv from "dotenv";
import { Palabra } from "./entity/Palabra.entity";
import { Categoria } from "./entity/Categoria.entity";
import { PalabrasPorCategoria } from "./entity/PalabrasPorCategoria.entity";
import { SaladeJuego } from "./entity/SaladeJuego.entity";
import { Jugador } from "./entity/Jugador.entity";
dotenv.config();

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE, NODE_ENV } =
  process.env;

export const AppDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: parseInt(DB_PORT || "5432"),
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_DATABASE,

  synchronize: NODE_ENV === "dev" ? false : false,
//logging logs sql command on the treminal
  logging: NODE_ENV === "dev" ? false : false,
  entities: [Palabra,Categoria,PalabrasPorCategoria,SaladeJuego,Jugador],
  
  migrations: [__dirname + "/migration/*.ts"],
  subscribers: [],
});