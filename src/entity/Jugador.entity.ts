import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, BaseEntity,JoinColumn } from "typeorm";
import { SaladeJuego } from "./SaladeJuego.entity";

@Entity({ name: "jugador" })
export class Jugador extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 250 })
  nombre: string;

  @Column({ nullable: false, default: 0 })
  puntaje: number;
  
  @ManyToOne(() => SaladeJuego, saladeJuego => saladeJuego.jugadores)
  @JoinColumn({ name: "salade_juego_id" })
  salade_juego_id: SaladeJuego;
  
}
