import { Entity, ManyToOne, JoinColumn, PrimaryColumn } from "typeorm";
import { Palabra } from "./Palabra.entity";
import { Categoria } from "./Categoria.entity";

@Entity({ name: "palabrasporcategoria" })
export class PalabrasPorCategoria {
  
  // @Column({ nullable: false })
  // id: number;

    @PrimaryColumn()
    pala_id: number;

    @PrimaryColumn()
    cate_id: number;

    @ManyToOne(() => Palabra, palabra => palabra.palabrasPorCategoria)
    @JoinColumn({ name: "pala_id" })
    palabra: Palabra;

    @ManyToOne(() => Categoria, categoria => categoria.palabrasPorCategoria)
    @JoinColumn({ name: "cate_id" })
    categoria: Categoria;}
