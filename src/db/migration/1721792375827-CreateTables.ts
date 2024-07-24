import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1721792375827 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
                    CREATE TABLE user (
                        id INT AUTO_INCREMENT NOT NULL,
                        fullname VARCHAR(255) NOT NULL,
                        age INT NOT NULL,
                        phoneNumber VARCHAR(255) NOT NULL,
                        email VARCHAR(255) NOT NULL,
                        password VARCHAR(255) NOT NULL,
                        PRIMARY KEY (id)
                    )
                `);

    await queryRunner.query(`
                    CREATE TABLE internship (
                        id INT AUTO_INCREMENT NOT NULL,
                        joinedDate DATE NOT NULL,
                        completionDate DATE NOT NULL,
                        isCertified BOOLEAN NOT NULL,
                        mentorName VARCHAR(255) NOT NULL,
                        userId INT,
                        PRIMARY KEY (id),
                        FOREIGN KEY (userId) REFERENCES user(id)
                    )
                `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE internship`);
    await queryRunner.query(`DROP TABLE user`);
  }
}
