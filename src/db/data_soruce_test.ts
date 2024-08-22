import { DataSource } from 'typeorm';
import { User } from '../entity/User';
import { Internship } from '../entity/Internship';
// import { Permission } from '../entity/Permission';

export const TestDataSource = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: '',
    database: 'api_test',
    synchronize: true,
    logging: false,
    entities: [User, Internship],
    migrationsTableName: 'custom_migration_table',
    migrations: ['./src/db/migration/*.ts'],
    subscribers: [],
});
