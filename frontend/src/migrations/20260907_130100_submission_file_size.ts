import { sql, type MigrateDownArgs, type MigrateUpArgs } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "submission_files" ADD COLUMN "original_size" numeric;
    UPDATE "submission_files" SET "original_size" = "size" WHERE "original_size" IS NULL;
    ALTER TABLE "submission_files" ALTER COLUMN "original_size" SET NOT NULL;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "submission_files" DROP COLUMN "original_size";`);
}
