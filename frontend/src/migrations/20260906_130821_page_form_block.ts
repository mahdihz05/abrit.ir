import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_content_blocks_form_variant" AS ENUM('default', 'simple', 'centered', 'split', 'dashboard', 'network', 'cards', 'bento', 'compact');
  CREATE TYPE "public"."enum__content_v_blocks_form_variant" AS ENUM('default', 'simple', 'centered', 'split', 'dashboard', 'network', 'cards', 'bento', 'compact');
  CREATE TABLE "content_blocks_form" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "enabled" boolean DEFAULT true,
    "variant" "enum_content_blocks_form_variant" DEFAULT 'default',
    "form_id" integer,
    "eyebrow" varchar,
    "heading" varchar,
    "intro" varchar,
    "context" varchar,
    "block_name" varchar
  );

  CREATE TABLE "_content_v_blocks_form" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_path" text NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "enabled" boolean DEFAULT true,
    "variant" "enum__content_v_blocks_form_variant" DEFAULT 'default',
    "form_id" integer,
    "eyebrow" varchar,
    "heading" varchar,
    "intro" varchar,
    "context" varchar,
    "_uuid" varchar,
    "block_name" varchar
  );

  ALTER TABLE "content_blocks_form" ADD CONSTRAINT "content_blocks_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "content_blocks_form" ADD CONSTRAINT "content_blocks_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_blocks_form" ADD CONSTRAINT "_content_v_blocks_form_form_id_forms_id_fk" FOREIGN KEY ("form_id") REFERENCES "public"."forms"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_content_v_blocks_form" ADD CONSTRAINT "_content_v_blocks_form_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "content_blocks_form_order_idx" ON "content_blocks_form" USING btree ("_order");
  CREATE INDEX "content_blocks_form_parent_id_idx" ON "content_blocks_form" USING btree ("_parent_id");
  CREATE INDEX "content_blocks_form_path_idx" ON "content_blocks_form" USING btree ("_path");
  CREATE INDEX "content_blocks_form_locale_idx" ON "content_blocks_form" USING btree ("_locale");
  CREATE INDEX "content_blocks_form_form_idx" ON "content_blocks_form" USING btree ("form_id");
  CREATE INDEX "_content_v_blocks_form_order_idx" ON "_content_v_blocks_form" USING btree ("_order");
  CREATE INDEX "_content_v_blocks_form_parent_id_idx" ON "_content_v_blocks_form" USING btree ("_parent_id");
  CREATE INDEX "_content_v_blocks_form_path_idx" ON "_content_v_blocks_form" USING btree ("_path");
  CREATE INDEX "_content_v_blocks_form_locale_idx" ON "_content_v_blocks_form" USING btree ("_locale");
  CREATE INDEX "_content_v_blocks_form_form_idx" ON "_content_v_blocks_form" USING btree ("form_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "content_blocks_form" CASCADE;
  DROP TABLE "_content_v_blocks_form" CASCADE;
  DROP TYPE "public"."enum_content_blocks_form_variant";
  DROP TYPE "public"."enum__content_v_blocks_form_variant";`)
}
