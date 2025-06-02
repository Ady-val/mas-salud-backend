import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1747788895417 implements MigrationInterface {
    name = 'Migrations1747788895417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_472b25323af01488f1f66a06b67"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_86033897c009fcca8b6505d6be2"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "roleId"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD "user_id" uuid`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD "role_id" uuid`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "UQ_23ed6f04fe43066df08379fd034" UNIQUE ("user_id", "role_id")`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_87b8888186ca9769c960e926870" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_b23c65e50a758245a33ee35fda1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_b23c65e50a758245a33ee35fda1"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "FK_87b8888186ca9769c960e926870"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP CONSTRAINT "UQ_23ed6f04fe43066df08379fd034"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "role_id"`);
        await queryRunner.query(`ALTER TABLE "user_roles" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD "roleId" uuid`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_86033897c009fcca8b6505d6be2" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_roles" ADD CONSTRAINT "FK_472b25323af01488f1f66a06b67" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
