import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { Internship } from '../entity/Internship';
// import { Permission } from '../entity/Permission';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: '127.0.0.1',
    port: 3306,
    username: 'root',
    password: '',
    database: 'CRUD_API',
    synchronize: false,
    entities: [User, Internship],
    logging: false,
    migrationsTableName: 'custom_migration_table',
    migrations: ['./src/db/migration/*.ts'],
    subscribers: [],
});
