// import { MigrationInterface, QueryRunner } from "typeorm";

// export class CreateRoleAndPermission1721967494557
//   implements MigrationInterface
// {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // Create Role Table
//     await queryRunner.query(`
//         CREATE TABLE IF NOT EXISTS role (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           name VARCHAR(255) NOT NULL
//         );
//       `);

//     await queryRunner.query(`
//         CREATE TABLE IF NOT EXISTS permission (
//           id INT AUTO_INCREMENT PRIMARY KEY,
//           name VARCHAR(255) NOT NULL
//         );
//       `);

//     // Create UserRoles Junction Table
//     await queryRunner.query(`
//         CREATE TABLE IF NOT EXISTS user_roles (
//           userId INT NOT NULL,
//           roleId INT NOT NULL,
//           PRIMARY KEY (userId, roleId),
//           FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE,
//           FOREIGN KEY (roleId) REFERENCES role(id) ON DELETE CASCADE
//         );
//       `);

//     // Create RolePermissions Junction Table
//     await queryRunner.query(`
//         CREATE TABLE IF NOT EXISTS role_permissions (
//           roleId INT NOT NULL,
//           permissionId INT NOT NULL,
//           PRIMARY KEY (roleId, permissionId),
//           FOREIGN KEY (roleId) REFERENCES role(id) ON DELETE CASCADE,
//           FOREIGN KEY (permissionId) REFERENCES permission(id) ON DELETE CASCADE
//         );
//       `);
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     await queryRunner.query(`DROP TABLE IF EXISTS role_permissions;`);
//     await queryRunner.query(`DROP TABLE IF EXISTS user_roles;`);
//     await queryRunner.query(`DROP TABLE IF EXISTS permission;`);
//     await queryRunner.query(`DROP TABLE IF EXISTS role;`);
//   }
// }
