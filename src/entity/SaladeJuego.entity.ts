import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, ManyToOne, JoinColumn,OneToMany } from "typeorm";
import { Categoria } from "./Categoria.entity";
import { Jugador } from "./Jugador.entity";

@Entity({ name: "saladejuego" })
export class SaladeJuego extends BaseEntity {
  
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nombre: string;

  @Column({ nullable: false })
  estado: string;

  @ManyToOne(() => Categoria, categoria => categoria.salasDeJuego)
  @JoinColumn({ name: "cate_id" })
  cate_id: Categoria;

  @OneToMany(() => Jugador, jugador => jugador.salade_juego_id)
  jugadores: Jugador[];

}
