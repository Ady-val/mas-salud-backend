import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1746919302981 implements MigrationInterface {
    name = 'Migrations1746919302981'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "institution" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "institution" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "institution" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "institution" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "institution" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "institution" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "beneficiaries" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "beneficiaries" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "beneficiaries" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "beneficiaries" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "beneficiaries" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "beneficiaries" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "medical_specialists" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "medical_specialists" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "medical_specialists" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "medical_specialists" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "medical_specialists" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "medical_specialists" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "inventory_movements" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "inventory_movements" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "medical_specialists" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "medical_specialists" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "medical_specialists" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "medical_specialists" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "medical_specialists" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "medical_specialists" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "inventory_items" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "inventory_items" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "beneficiaries" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "beneficiaries" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "beneficiaries" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "beneficiaries" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "beneficiaries" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "beneficiaries" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "institution" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "institution" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "institution" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "institution" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "institution" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "institution" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
