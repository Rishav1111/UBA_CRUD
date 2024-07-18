const {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} = require("typeorm");

const { User } = require("./User");

@Entity()
export class Internship {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  joinedDate!: Date;

  @Column()
  completionDate!: Date;

  @Column()
  isCertified!: boolean;

  @Column()
  mentorName!: string;

  @ManyToOne(() => User, (user: { id: any }) => user.id)
  user!: typeof User;
}
