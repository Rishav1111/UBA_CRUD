import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { Internship } from '../entity/Internship';
import { Role } from '../entity/Role';
import { Permission } from '../entity/Permission';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'CRUD_API',
    synchronize: false,
    entities: [User, Internship, Role, Permission],
    logging: false,
    migrationsTableName: 'custom_migration_table',
    migrations: ['./src/db/migration/*.ts'],
    subscribers: [],
});
