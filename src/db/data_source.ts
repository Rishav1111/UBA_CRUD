import { DataSource } from "typeorm";
import { User } from "../entity/User";
import { Internship } from "../entity/Internship";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "",
  database: "CRUD_API",
  synchronize: false,
  entities: [User, Internship],
  logging: true,
  migrationsTableName: "custom_migration_table",
  migrations: ["./src/db/migration/*.ts"],
});
