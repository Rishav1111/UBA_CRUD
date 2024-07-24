import { MigrationInterface, QueryRunner } from "typeorm";

export class Usermig1721369151865 implements MigrationInterface {
    name = 'Usermig1721369151865'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`fullname\` varchar(255) NOT NULL, \`age\` int NOT NULL, \`phoneNumber\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`internship\` (\`id\` int NOT NULL AUTO_INCREMENT, \`joinedDate\` datetime NOT NULL, \`completionDate\` datetime NOT NULL, \`isCertified\` tinyint NOT NULL, \`mentorName\` varchar(255) NOT NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`internship\` ADD CONSTRAINT \`FK_efc7c9c49d46553d73e79f7c4e7\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`internship\` DROP FOREIGN KEY \`FK_efc7c9c49d46553d73e79f7c4e7\``);
        await queryRunner.query(`DROP TABLE \`internship\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
