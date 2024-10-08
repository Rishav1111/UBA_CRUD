// import {
//     Entity,
//     PrimaryGeneratedColumn,
//     Column,
//     ManyToMany,
//     JoinTable,
// } from 'typeorm';
// import { User } from './User';
// import { Permission } from './Permission';

// @Entity()
// export class Role {
//     static findOne(arg0: { _id: string | Role[]; }) {
//         throw new Error('Method not implemented.');
//     }
//     @PrimaryGeneratedColumn()
//     id!: number;

//     @Column('varchar')
//     name!: string;

//     @ManyToMany(() => User, (user) => user.role)
//     users!: User[];

//     @ManyToMany(() => Permission, { eager: true })
//     @JoinTable({
//         name: 'role_permissions',
//         joinColumn: { name: 'roleId', referencedColumnName: 'id' },
//         inverseJoinColumn: { name: 'permissionId', referencedColumnName: 'id' },
//     })
//     permissions!: Permission[];
// }
