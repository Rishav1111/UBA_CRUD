// import { MigrationInterface, QueryRunner } from "typeorm";

// export class CreateTable1721913377386 implements MigrationInterface {
//   public async up(queryRunner: QueryRunner): Promise<void> {
//     // Create User Table
//     await queryRunner.query(`
//             CREATE TABLE IF NOT EXISTS user (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 fullname VARCHAR(255) NOT NULL,
//                 date DATE NOT NULL,
//                 phoneNumber VARCHAR(20) NOT NULL,
//                 email VARCHAR(255) NOT NULL UNIQUE,
//                 password VARCHAR(255) NOT NULL
//             );
//         `);

//     // Create Internship Table
//     await queryRunner.query(`
//             CREATE TABLE IF NOT EXISTS internship (
//                 id INT AUTO_INCREMENT PRIMARY KEY,
//                 joinedDate DATE NOT NULL,
//                 completionDate DATE NULL,
//                 isCertified BOOLEAN NOT NULL,
//                 mentorName VARCHAR(255) NULL,
//                 userId INT NOT NULL,
//                 FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
//             );
//         `);
//   }

//   public async down(queryRunner: QueryRunner): Promise<void> {
//     // Drop tables in reverse order to avoid foreign key constraint issues
//     await queryRunner.query(`DROP TABLE IF EXISTS internship;`);

//     // Remove Role Column from User Table
//     await queryRunner.query(`ALTER TABLE user DROP COLUMN role;`);

//     await queryRunner.query(`DROP TABLE IF EXISTS user;`);
//   }
// }
