import { MigrationInterface, QueryRunner } from "typeorm";

export class Usermig1721215952915 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" SERIAL NOT NULL, "fullname" character varying NOT NULL, "age" integer NOT NULL, "phoneNumber" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`
    );

    await queryRunner.query(
      `CREATE TABLE "internship" ("id" SERIAL NOT NULL, "joinedDate" TIMESTAMP NOT NULL, "completionDate" TIMESTAMP NOT NULL, "isCertified" boolean NOT NULL, "mentorName" character varying NOT NULL, "userId" integer, CONSTRAINT "PK_8e1fca3a0a0d8b4b1b15e0d1b4e" PRIMARY KEY ("id"))`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "internship"`);
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
