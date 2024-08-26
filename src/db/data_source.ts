import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { Internship } from '../entity/Internship';
// import { Permission } from '../entity/Permission';

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'root',
    database: 'ims-cms',
    synchronize: false,
    entities: [User, Internship],
    logging: false,
    migrationsTableName: 'custom_migration_table',
    migrations: ['./src/db/migration/*.ts'],
    subscribers: [],
});
 