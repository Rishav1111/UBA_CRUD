const { Entity, PrimaryGeneratedColumn, Column } = require("typeorm");

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
}
