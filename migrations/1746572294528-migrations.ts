import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migrations1746572294528 implements MigrationInterface {
  name = 'Migrations1746572294528';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "ticket_items" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ticketId" uuid NOT NULL, "inventoryItemId" uuid NOT NULL, "quantity" integer NOT NULL, CONSTRAINT "PK_42c1d9799d0b98de1654a97ef1a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "tickets" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ticketNumber" character varying NOT NULL, "beneficiaryId" uuid NOT NULL, "institutionId" uuid NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e99bd0f51b92896fdaf99ebb715" UNIQUE ("ticketNumber"), CONSTRAINT "PK_343bc942ae261cf7a1377f48fd0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket_items" ADD CONSTRAINT "FK_d229a0672a063c7eaa64720cd6a" FOREIGN KEY ("ticketId") REFERENCES "tickets"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket_items" ADD CONSTRAINT "FK_ccfd70122c8b13becf4999c6f5f" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tickets" ADD CONSTRAINT "FK_5fe8d46cd2ff5c6b5e1c866fd66" FOREIGN KEY ("beneficiaryId") REFERENCES "beneficiaries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tickets" ADD CONSTRAINT "FK_0408b89136243c6a95ca75481ba" FOREIGN KEY ("institutionId") REFERENCES "institution"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tickets" DROP CONSTRAINT "FK_0408b89136243c6a95ca75481ba"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tickets" DROP CONSTRAINT "FK_5fe8d46cd2ff5c6b5e1c866fd66"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket_items" DROP CONSTRAINT "FK_ccfd70122c8b13becf4999c6f5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ticket_items" DROP CONSTRAINT "FK_d229a0672a063c7eaa64720cd6a"`,
    );
    await queryRunner.query(`DROP TABLE "tickets"`);
    await queryRunner.query(`DROP TABLE "ticket_items"`);
  }
}
