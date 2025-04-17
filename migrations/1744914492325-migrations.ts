import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1744914492325 implements MigrationInterface {
  name = 'Migrations1744914492325';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."beneficiaries_gender_enum" AS ENUM('Male', 'Female')`,
    );
    await queryRunner.query(
      `CREATE TABLE "beneficiaries" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "lastName" character varying NOT NULL, "secondLastName" character varying NOT NULL, "gender" "public"."beneficiaries_gender_enum" NOT NULL, "curp" character varying(18) NOT NULL, "phone" character varying(10) NOT NULL, "street" text NOT NULL, "externalNumber" text NOT NULL, "internalNumber" text, "colony" text NOT NULL, "postalCode" character varying(5) NOT NULL, "active" boolean NOT NULL DEFAULT true, "identificationCode" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_77477389f6b153618730df93224" UNIQUE ("identificationCode"), CONSTRAINT "PK_c9356d282dec80f7f12a9eef10a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "username" character varying NOT NULL, "password" character varying NOT NULL, "name" character varying NOT NULL, "idInstitution" uuid, "role" json, "isAdmin" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "institution" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_d218ad3566afa9e396f184fd7d5" UNIQUE ("name"), CONSTRAINT "PK_f60ee4ff0719b7df54830b39087" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."products_form_enum" AS ENUM('tableta', 'jarabe', 'cápsula', 'inhalador', 'inyección')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."products_unit_enum" AS ENUM('mg', 'mg/5ml', 'ml', 'mcg', 'mg/ml', 'g', 'g/5ml', 'g/ml', 'l', 'ui')`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "brand" character varying NOT NULL, "presentation" character varying NOT NULL, "dosage" character varying NOT NULL, "form" "public"."products_form_enum" NOT NULL, "unit" "public"."products_unit_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "sessions" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL, "expiresAt" TIMESTAMP, "token" text NOT NULL, "isActive" boolean NOT NULL DEFAULT true, CONSTRAINT "UQ_e9f62f5dcb8a54b84234c9e7a06" UNIQUE ("token"), CONSTRAINT "PK_3238ef96f18b355b671619111bc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "inventory_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "productId" uuid NOT NULL, "institutionId" uuid NOT NULL, "batchNumber" character varying NOT NULL, "barcode" character varying NOT NULL, "quantity" integer NOT NULL, "expirationDate" date NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_cf2f451407242e132547ac19169" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."inventory_movements_type_enum" AS ENUM('IN', 'OUT')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."inventory_movements_reason_enum" AS ENUM('NEW_STOCK_ENTRY', 'PRODUCT_DELIVERED', 'BATCH_DELETED_BY_USER', 'STOCK_ADJUSTMENT')`,
    );
    await queryRunner.query(
      `CREATE TABLE "inventory_movements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "inventoryItemId" uuid NOT NULL, "type" "public"."inventory_movements_type_enum" NOT NULL, "quantity" integer NOT NULL, "reason" "public"."inventory_movements_reason_enum" NOT NULL, "userId" uuid, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_d7597827c1dcffae889db3ab873" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "medical_specialists" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fullName" character varying NOT NULL, "email" character varying, "phone" character varying, "speciality" character varying NOT NULL, "licenseNumber" character varying, "institutionId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_37ae0e8d421f15896bdc29c7c0c" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_248ce5be931e1200508360be092" FOREIGN KEY ("idInstitution") REFERENCES "institution"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_4a1e232a660d7d51a13f20099b2" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" ADD CONSTRAINT "FK_88efc4e7a225fbd8e1deac81ba7" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_movements" ADD CONSTRAINT "FK_f9a6cc64fcb1e9a48f60980610b" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "medical_specialists" ADD CONSTRAINT "FK_da1b3982c6b7392a70ac3de6a04" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "medical_specialists" DROP CONSTRAINT "FK_da1b3982c6b7392a70ac3de6a04"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_movements" DROP CONSTRAINT "FK_f9a6cc64fcb1e9a48f60980610b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_88efc4e7a225fbd8e1deac81ba7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "inventory_items" DROP CONSTRAINT "FK_4a1e232a660d7d51a13f20099b2"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_248ce5be931e1200508360be092"`);
    await queryRunner.query(`DROP TABLE "medical_specialists"`);
    await queryRunner.query(`DROP TABLE "inventory_movements"`);
    await queryRunner.query(`DROP TYPE "public"."inventory_movements_reason_enum"`);
    await queryRunner.query(`DROP TYPE "public"."inventory_movements_type_enum"`);
    await queryRunner.query(`DROP TABLE "inventory_items"`);
    await queryRunner.query(`DROP TABLE "sessions"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TYPE "public"."products_unit_enum"`);
    await queryRunner.query(`DROP TYPE "public"."products_form_enum"`);
    await queryRunner.query(`DROP TABLE "institution"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "beneficiaries"`);
    await queryRunner.query(`DROP TYPE "public"."beneficiaries_gender_enum"`);
  }
}
