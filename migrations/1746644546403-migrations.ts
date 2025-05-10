import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746644546403 implements MigrationInterface {
    name = 'Migrations1746644546403'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "testing" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "UQ_3e76acb7a19376b604b96720301" UNIQUE ("name"), CONSTRAINT "PK_d380da037e5aa1b6a5fd58c5b7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "tickets" ADD "userId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" ADD "ticketId" uuid`);
        await queryRunner.query(`ALTER TYPE "public"."inventory_movements_reason_enum" RENAME TO "inventory_movements_reason_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."inventory_movements_reason_enum" AS ENUM('NEW_STOCK_ENTRY', 'PRODUCT_DELIVERED', 'BATCH_DELETED_BY_USER', 'STOCK_ADJUSTMENT', 'BENEFICIARY_DELIVERY')`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" ALTER COLUMN "reason" TYPE "public"."inventory_movements_reason_enum" USING "reason"::"text"::"public"."inventory_movements_reason_enum"`);
        await queryRunner.query(`DROP TYPE "public"."inventory_movements_reason_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."inventory_movements_reason_enum_old" AS ENUM('NEW_STOCK_ENTRY', 'PRODUCT_DELIVERED', 'BATCH_DELETED_BY_USER', 'STOCK_ADJUSTMENT')`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" ALTER COLUMN "reason" TYPE "public"."inventory_movements_reason_enum_old" USING "reason"::"text"::"public"."inventory_movements_reason_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."inventory_movements_reason_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."inventory_movements_reason_enum_old" RENAME TO "inventory_movements_reason_enum"`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" DROP COLUMN "ticketId"`);
        await queryRunner.query(`ALTER TABLE "tickets" DROP COLUMN "userId"`);
        await queryRunner.query(`DROP TABLE "testing"`);
    }

}
