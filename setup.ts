import { beforeAll, afterAll } from "vitest";
import { AppDataSource } from "./src/db/data_source";
import { beforeEach } from "node:test";

beforeAll(async () => {
  if (AppDataSource.isInitialized) {
    await AppDataSource.destroy();
  }
  await AppDataSource.initialize();
});
