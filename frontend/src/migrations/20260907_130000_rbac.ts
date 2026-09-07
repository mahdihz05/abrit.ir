import { sql, type MigrateDownArgs, type MigrateUpArgs } from "@payloadcms/db-postgres";

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'seo', 'viewer');
    ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'viewer' NOT NULL;
    UPDATE "users" SET "role" = 'admin';
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "users" DROP COLUMN "role";
    DROP TYPE "public"."enum_users_role";
  `);
}
