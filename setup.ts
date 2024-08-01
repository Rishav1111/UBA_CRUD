import { beforeAll, afterAll } from "vitest";
import { TestDataSource } from "./src/db/data_soruce_test.js";
import { beforeEach } from "node:test";

TestDataSource.initialize();
beforeEach(async () => {
  await TestDataSource.destroy();
});
