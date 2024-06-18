import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm";
import { PalabrasPorCategoria } from "./PalabrasPorCategoria.entity";
import { SaladeJuego } from "./SaladeJuego.entity";

@Entity({ name: "categoria" })
export class Categoria extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false })
  nombre: string;

  @OneToMany(() => PalabrasPorCategoria, palabrasPorCategoria => palabrasPorCategoria.cate_id)
  palabrasPorCategoria: PalabrasPorCategoria[];

  @OneToMany(() => SaladeJuego, saladeJuego => saladeJuego.cate_id)
  salasDeJuego: SaladeJuego[];
}
