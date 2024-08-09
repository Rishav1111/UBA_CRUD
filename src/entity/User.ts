import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Internship } from "./Internship";
import { Role } from "./Role";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  fullname!: string;

  @Column("int")
  age!: number;

  @Column("varchar")
  phoneNumber!: string;

  @Column("varchar")
  email!: string;

  @Column("varchar")
  password!: string;

  @OneToMany(() => Internship, (internship) => internship.user)
  internships!: Internship[];

  @ManyToMany(() => Role)
  @JoinTable({
    name: "user_roles",
    joinColumn: { name: "userId", referencedColumnName: "id" },
    inverseJoinColumn: { name: "roleId", referencedColumnName: "id" },
  })
  role!: Role[];
}
