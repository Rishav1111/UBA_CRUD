import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    ManyToMany,
    JoinTable,
} from 'typeorm';
import { Internship } from './Internship';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column('varchar')
    fullname!: string;

    @Column('int')
    DOB!: number;

    @Column('varchar')
    phoneNumber!: string;

    @Column('varchar')
    email!: string;

    @Column('varchar')
    password!: string;

    @Column('varchar')
    roleId!: string;

    @OneToMany(() => Internship, (internship) => internship.user)
    internships!: Internship[];
}
