import { beforeAll, afterAll } from 'vitest';
import { AppDataSource } from './src/db/data_source';
import { app } from './src/index';

let server: any;
// Initialize the database connection before running tests
beforeAll(async () => {
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
    await AppDataSource.initialize();
    server = app.listen(0);
});

afterAll(async () => {
    if (server) {
        await server.close();
    }
    if (AppDataSource.isInitialized) {
        await AppDataSource.destroy();
    }
});
