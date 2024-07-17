import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  fullname!: string;

  @Column()
  age!: number;

  @Column()
  phoneNumber!: string;

  @Column()
  email!: string;

  @Column()
  password!: string;
}
