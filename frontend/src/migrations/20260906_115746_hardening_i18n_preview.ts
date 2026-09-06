import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "content_service_data_pulse" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "text" varchar
  );

  CREATE TABLE "content_service_data_context_tags" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar
  );

  CREATE TABLE "content_service_data_context" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar
  );

  CREATE TABLE "content_service_data_deliverables_tags" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar
  );

  CREATE TABLE "content_service_data_deliverables" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar
  );

  CREATE TABLE "content_service_data_capabilities_tags" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar
  );

  CREATE TABLE "content_service_data_capabilities" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar
  );

  CREATE TABLE "content_service_data_architecture_tags" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar
  );

  CREATE TABLE "content_service_data_architecture" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar
  );

  CREATE TABLE "content_service_data_showcase_tags" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar
  );

  CREATE TABLE "content_service_data_showcase" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar
  );

  CREATE TABLE "content_service_data_process_tags" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar
  );

  CREATE TABLE "content_service_data_process" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar
  );

  CREATE TABLE "content_service_data_technologies" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "name" varchar
  );

  CREATE TABLE "content_service_data_managed_scope_tags" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar
  );

  CREATE TABLE "content_service_data_managed_scope" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar
  );

  CREATE TABLE "cols" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar
  );

  CREATE TABLE "vals" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar
  );

  CREATE TABLE "rows" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar
  );

  CREATE TABLE "content_service_data_faqs" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" varchar
  );

  CREATE TABLE "content_service_listing_family_stages_tags" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar
  );

  CREATE TABLE "content_service_listing_family_stages" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar
  );

  CREATE TABLE "content_service_listing_decisions_tags" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "value" varchar
  );

  CREATE TABLE "content_service_listing_decisions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar
  );

  CREATE TABLE "_content_v_version_service_data_pulse" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "text" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_data_context_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "value" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_data_context" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_data_deliverables_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "value" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_data_deliverables" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_data_capabilities_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "value" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_data_capabilities" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_data_architecture_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "value" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_data_architecture" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_data_showcase_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "value" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_data_showcase" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_data_process_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "value" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_data_process" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_data_technologies" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "name" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_data_managed_scope_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "value" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_data_managed_scope" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_cols_v" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_vals_v" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "value" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_rows_v" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "label" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_data_faqs" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "question" varchar,
    "answer" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_listing_family_stages_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "value" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_listing_family_stages" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_listing_decisions_tags" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "value" varchar,
    "_uuid" varchar
  );

  CREATE TABLE "_content_v_version_service_listing_decisions" (
    "_order" integer NOT NULL,
    "_parent_id" integer NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" serial PRIMARY KEY NOT NULL,
    "title" varchar,
    "body" varchar,
    "_uuid" varchar
  );

  ALTER TABLE "content" ADD COLUMN "service_data_code" varchar;
  ALTER TABLE "content" ADD COLUMN "service_data_related_managed_service_id" integer;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_category" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_hero_title" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_hero_body" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_overview_title" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_overview_body" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_context_title" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_deliverables_title" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_deliverables_body" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_capabilities_title" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_architecture_title" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_architecture_body" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_showcase_title" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_showcase_body" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_process_title" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_cta_title" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_cta_body" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_managed_scope_title" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_managed_scope_body" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_comparison_intro" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_data_faq_title" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_eyebrow" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_explore_label" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_consult_label" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_back_label" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_family_title" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_family_body" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_decision_title" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_decision_body" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_overview_label" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_deliverables_label" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_capabilities_label" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_architecture_label" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_process_label" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_technologies_label" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_comparison_label" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_managed_scope_label" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_faq_label" varchar;
  ALTER TABLE "content_locales" ADD COLUMN "service_listing_related_label" varchar;
  ALTER TABLE "_content_v" ADD COLUMN "version_service_data_code" varchar;
  ALTER TABLE "_content_v" ADD COLUMN "version_service_data_related_managed_service_id" integer;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_category" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_hero_title" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_hero_body" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_overview_title" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_overview_body" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_context_title" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_deliverables_title" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_deliverables_body" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_capabilities_title" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_architecture_title" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_architecture_body" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_showcase_title" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_showcase_body" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_process_title" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_cta_title" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_cta_body" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_managed_scope_title" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_managed_scope_body" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_comparison_intro" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_data_faq_title" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_eyebrow" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_explore_label" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_consult_label" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_back_label" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_family_title" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_family_body" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_decision_title" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_decision_body" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_overview_label" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_deliverables_label" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_capabilities_label" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_architecture_label" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_process_label" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_technologies_label" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_comparison_label" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_managed_scope_label" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_faq_label" varchar;
  ALTER TABLE "_content_v_locales" ADD COLUMN "version_service_listing_related_label" varchar;
  ALTER TABLE "content_service_data_pulse" ADD CONSTRAINT "content_service_data_pulse_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_data_context_tags" ADD CONSTRAINT "content_service_data_context_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_service_data_context"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_data_context" ADD CONSTRAINT "content_service_data_context_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_data_deliverables_tags" ADD CONSTRAINT "content_service_data_deliverables_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_service_data_deliverables"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_data_deliverables" ADD CONSTRAINT "content_service_data_deliverables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_data_capabilities_tags" ADD CONSTRAINT "content_service_data_capabilities_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_service_data_capabilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_data_capabilities" ADD CONSTRAINT "content_service_data_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_data_architecture_tags" ADD CONSTRAINT "content_service_data_architecture_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_service_data_architecture"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_data_architecture" ADD CONSTRAINT "content_service_data_architecture_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_data_showcase_tags" ADD CONSTRAINT "content_service_data_showcase_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_service_data_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_data_showcase" ADD CONSTRAINT "content_service_data_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_data_process_tags" ADD CONSTRAINT "content_service_data_process_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_service_data_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_data_process" ADD CONSTRAINT "content_service_data_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_data_technologies" ADD CONSTRAINT "content_service_data_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_data_managed_scope_tags" ADD CONSTRAINT "content_service_data_managed_scope_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_service_data_managed_scope"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_data_managed_scope" ADD CONSTRAINT "content_service_data_managed_scope_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cols" ADD CONSTRAINT "cols_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "vals" ADD CONSTRAINT "vals_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."rows"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "rows" ADD CONSTRAINT "rows_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_data_faqs" ADD CONSTRAINT "content_service_data_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_listing_family_stages_tags" ADD CONSTRAINT "content_service_listing_family_stages_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_service_listing_family_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_listing_family_stages" ADD CONSTRAINT "content_service_listing_family_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_listing_decisions_tags" ADD CONSTRAINT "content_service_listing_decisions_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_service_listing_decisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_service_listing_decisions" ADD CONSTRAINT "content_service_listing_decisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_data_pulse" ADD CONSTRAINT "_content_v_version_service_data_pulse_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_data_context_tags" ADD CONSTRAINT "_content_v_version_service_data_context_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v_version_service_data_context"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_data_context" ADD CONSTRAINT "_content_v_version_service_data_context_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_data_deliverables_tags" ADD CONSTRAINT "_content_v_version_service_data_deliverables_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v_version_service_data_deliverables"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_data_deliverables" ADD CONSTRAINT "_content_v_version_service_data_deliverables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_data_capabilities_tags" ADD CONSTRAINT "_content_v_version_service_data_capabilities_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v_version_service_data_capabilities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_data_capabilities" ADD CONSTRAINT "_content_v_version_service_data_capabilities_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_data_architecture_tags" ADD CONSTRAINT "_content_v_version_service_data_architecture_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v_version_service_data_architecture"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_data_architecture" ADD CONSTRAINT "_content_v_version_service_data_architecture_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_data_showcase_tags" ADD CONSTRAINT "_content_v_version_service_data_showcase_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v_version_service_data_showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_data_showcase" ADD CONSTRAINT "_content_v_version_service_data_showcase_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_data_process_tags" ADD CONSTRAINT "_content_v_version_service_data_process_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v_version_service_data_process"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_data_process" ADD CONSTRAINT "_content_v_version_service_data_process_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_data_technologies" ADD CONSTRAINT "_content_v_version_service_data_technologies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_data_managed_scope_tags" ADD CONSTRAINT "_content_v_version_service_data_managed_scope_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v_version_service_data_managed_scope"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_data_managed_scope" ADD CONSTRAINT "_content_v_version_service_data_managed_scope_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_cols_v" ADD CONSTRAINT "_cols_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_vals_v" ADD CONSTRAINT "_vals_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_rows_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_rows_v" ADD CONSTRAINT "_rows_v_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_data_faqs" ADD CONSTRAINT "_content_v_version_service_data_faqs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_listing_family_stages_tags" ADD CONSTRAINT "_content_v_version_service_listing_family_stages_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v_version_service_listing_family_stages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_listing_family_stages" ADD CONSTRAINT "_content_v_version_service_listing_family_stages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_listing_decisions_tags" ADD CONSTRAINT "_content_v_version_service_listing_decisions_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v_version_service_listing_decisions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_version_service_listing_decisions" ADD CONSTRAINT "_content_v_version_service_listing_decisions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "content_service_data_pulse_order_idx" ON "content_service_data_pulse" USING btree ("_order");
  CREATE INDEX "content_service_data_pulse_parent_id_idx" ON "content_service_data_pulse" USING btree ("_parent_id");
  CREATE INDEX "content_service_data_pulse_locale_idx" ON "content_service_data_pulse" USING btree ("_locale");
  CREATE INDEX "content_service_data_context_tags_order_idx" ON "content_service_data_context_tags" USING btree ("_order");
  CREATE INDEX "content_service_data_context_tags_parent_id_idx" ON "content_service_data_context_tags" USING btree ("_parent_id");
  CREATE INDEX "content_service_data_context_tags_locale_idx" ON "content_service_data_context_tags" USING btree ("_locale");
  CREATE INDEX "content_service_data_context_order_idx" ON "content_service_data_context" USING btree ("_order");
  CREATE INDEX "content_service_data_context_parent_id_idx" ON "content_service_data_context" USING btree ("_parent_id");
  CREATE INDEX "content_service_data_context_locale_idx" ON "content_service_data_context" USING btree ("_locale");
  CREATE INDEX "content_service_data_deliverables_tags_order_idx" ON "content_service_data_deliverables_tags" USING btree ("_order");
  CREATE INDEX "content_service_data_deliverables_tags_parent_id_idx" ON "content_service_data_deliverables_tags" USING btree ("_parent_id");
  CREATE INDEX "content_service_data_deliverables_tags_locale_idx" ON "content_service_data_deliverables_tags" USING btree ("_locale");
  CREATE INDEX "content_service_data_deliverables_order_idx" ON "content_service_data_deliverables" USING btree ("_order");
  CREATE INDEX "content_service_data_deliverables_parent_id_idx" ON "content_service_data_deliverables" USING btree ("_parent_id");
  CREATE INDEX "content_service_data_deliverables_locale_idx" ON "content_service_data_deliverables" USING btree ("_locale");
  CREATE INDEX "content_service_data_capabilities_tags_order_idx" ON "content_service_data_capabilities_tags" USING btree ("_order");
  CREATE INDEX "content_service_data_capabilities_tags_parent_id_idx" ON "content_service_data_capabilities_tags" USING btree ("_parent_id");
  CREATE INDEX "content_service_data_capabilities_tags_locale_idx" ON "content_service_data_capabilities_tags" USING btree ("_locale");
  CREATE INDEX "content_service_data_capabilities_order_idx" ON "content_service_data_capabilities" USING btree ("_order");
  CREATE INDEX "content_service_data_capabilities_parent_id_idx" ON "content_service_data_capabilities" USING btree ("_parent_id");
  CREATE INDEX "content_service_data_capabilities_locale_idx" ON "content_service_data_capabilities" USING btree ("_locale");
  CREATE INDEX "content_service_data_architecture_tags_order_idx" ON "content_service_data_architecture_tags" USING btree ("_order");
  CREATE INDEX "content_service_data_architecture_tags_parent_id_idx" ON "content_service_data_architecture_tags" USING btree ("_parent_id");
  CREATE INDEX "content_service_data_architecture_tags_locale_idx" ON "content_service_data_architecture_tags" USING btree ("_locale");
  CREATE INDEX "content_service_data_architecture_order_idx" ON "content_service_data_architecture" USING btree ("_order");
  CREATE INDEX "content_service_data_architecture_parent_id_idx" ON "content_service_data_architecture" USING btree ("_parent_id");
  CREATE INDEX "content_service_data_architecture_locale_idx" ON "content_service_data_architecture" USING btree ("_locale");
  CREATE INDEX "content_service_data_showcase_tags_order_idx" ON "content_service_data_showcase_tags" USING btree ("_order");
  CREATE INDEX "content_service_data_showcase_tags_parent_id_idx" ON "content_service_data_showcase_tags" USING btree ("_parent_id");
  CREATE INDEX "content_service_data_showcase_tags_locale_idx" ON "content_service_data_showcase_tags" USING btree ("_locale");
  CREATE INDEX "content_service_data_showcase_order_idx" ON "content_service_data_showcase" USING btree ("_order");
  CREATE INDEX "content_service_data_showcase_parent_id_idx" ON "content_service_data_showcase" USING btree ("_parent_id");
  CREATE INDEX "content_service_data_showcase_locale_idx" ON "content_service_data_showcase" USING btree ("_locale");
  CREATE INDEX "content_service_data_process_tags_order_idx" ON "content_service_data_process_tags" USING btree ("_order");
  CREATE INDEX "content_service_data_process_tags_parent_id_idx" ON "content_service_data_process_tags" USING btree ("_parent_id");
  CREATE INDEX "content_service_data_process_tags_locale_idx" ON "content_service_data_process_tags" USING btree ("_locale");
  CREATE INDEX "content_service_data_process_order_idx" ON "content_service_data_process" USING btree ("_order");
  CREATE INDEX "content_service_data_process_parent_id_idx" ON "content_service_data_process" USING btree ("_parent_id");
  CREATE INDEX "content_service_data_process_locale_idx" ON "content_service_data_process" USING btree ("_locale");
  CREATE INDEX "content_service_data_technologies_order_idx" ON "content_service_data_technologies" USING btree ("_order");
  CREATE INDEX "content_service_data_technologies_parent_id_idx" ON "content_service_data_technologies" USING btree ("_parent_id");
  CREATE INDEX "content_service_data_managed_scope_tags_order_idx" ON "content_service_data_managed_scope_tags" USING btree ("_order");
  CREATE INDEX "content_service_data_managed_scope_tags_parent_id_idx" ON "content_service_data_managed_scope_tags" USING btree ("_parent_id");
  CREATE INDEX "content_service_data_managed_scope_tags_locale_idx" ON "content_service_data_managed_scope_tags" USING btree ("_locale");
  CREATE INDEX "content_service_data_managed_scope_order_idx" ON "content_service_data_managed_scope" USING btree ("_order");
  CREATE INDEX "content_service_data_managed_scope_parent_id_idx" ON "content_service_data_managed_scope" USING btree ("_parent_id");
  CREATE INDEX "content_service_data_managed_scope_locale_idx" ON "content_service_data_managed_scope" USING btree ("_locale");
  CREATE INDEX "cols_order_idx" ON "cols" USING btree ("_order");
  CREATE INDEX "cols_parent_id_idx" ON "cols" USING btree ("_parent_id");
  CREATE INDEX "cols_locale_idx" ON "cols" USING btree ("_locale");
  CREATE INDEX "vals_order_idx" ON "vals" USING btree ("_order");
  CREATE INDEX "vals_parent_id_idx" ON "vals" USING btree ("_parent_id");
  CREATE INDEX "vals_locale_idx" ON "vals" USING btree ("_locale");
  CREATE INDEX "rows_order_idx" ON "rows" USING btree ("_order");
  CREATE INDEX "rows_parent_id_idx" ON "rows" USING btree ("_parent_id");
  CREATE INDEX "rows_locale_idx" ON "rows" USING btree ("_locale");
  CREATE INDEX "content_service_data_faqs_order_idx" ON "content_service_data_faqs" USING btree ("_order");
  CREATE INDEX "content_service_data_faqs_parent_id_idx" ON "content_service_data_faqs" USING btree ("_parent_id");
  CREATE INDEX "content_service_data_faqs_locale_idx" ON "content_service_data_faqs" USING btree ("_locale");
  CREATE INDEX "content_service_listing_family_stages_tags_order_idx" ON "content_service_listing_family_stages_tags" USING btree ("_order");
  CREATE INDEX "content_service_listing_family_stages_tags_parent_id_idx" ON "content_service_listing_family_stages_tags" USING btree ("_parent_id");
  CREATE INDEX "content_service_listing_family_stages_tags_locale_idx" ON "content_service_listing_family_stages_tags" USING btree ("_locale");
  CREATE INDEX "content_service_listing_family_stages_order_idx" ON "content_service_listing_family_stages" USING btree ("_order");
  CREATE INDEX "content_service_listing_family_stages_parent_id_idx" ON "content_service_listing_family_stages" USING btree ("_parent_id");
  CREATE INDEX "content_service_listing_family_stages_locale_idx" ON "content_service_listing_family_stages" USING btree ("_locale");
  CREATE INDEX "content_service_listing_decisions_tags_order_idx" ON "content_service_listing_decisions_tags" USING btree ("_order");
  CREATE INDEX "content_service_listing_decisions_tags_parent_id_idx" ON "content_service_listing_decisions_tags" USING btree ("_parent_id");
  CREATE INDEX "content_service_listing_decisions_tags_locale_idx" ON "content_service_listing_decisions_tags" USING btree ("_locale");
  CREATE INDEX "content_service_listing_decisions_order_idx" ON "content_service_listing_decisions" USING btree ("_order");
  CREATE INDEX "content_service_listing_decisions_parent_id_idx" ON "content_service_listing_decisions" USING btree ("_parent_id");
  CREATE INDEX "content_service_listing_decisions_locale_idx" ON "content_service_listing_decisions" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_data_pulse_order_idx" ON "_content_v_version_service_data_pulse" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_data_pulse_parent_id_idx" ON "_content_v_version_service_data_pulse" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_data_pulse_locale_idx" ON "_content_v_version_service_data_pulse" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_data_context_tags_order_idx" ON "_content_v_version_service_data_context_tags" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_data_context_tags_parent_id_idx" ON "_content_v_version_service_data_context_tags" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_data_context_tags_locale_idx" ON "_content_v_version_service_data_context_tags" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_data_context_order_idx" ON "_content_v_version_service_data_context" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_data_context_parent_id_idx" ON "_content_v_version_service_data_context" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_data_context_locale_idx" ON "_content_v_version_service_data_context" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_data_deliverables_tags_order_idx" ON "_content_v_version_service_data_deliverables_tags" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_data_deliverables_tags_parent_id_idx" ON "_content_v_version_service_data_deliverables_tags" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_data_deliverables_tags_locale_idx" ON "_content_v_version_service_data_deliverables_tags" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_data_deliverables_order_idx" ON "_content_v_version_service_data_deliverables" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_data_deliverables_parent_id_idx" ON "_content_v_version_service_data_deliverables" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_data_deliverables_locale_idx" ON "_content_v_version_service_data_deliverables" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_data_capabilities_tags_order_idx" ON "_content_v_version_service_data_capabilities_tags" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_data_capabilities_tags_parent_id_idx" ON "_content_v_version_service_data_capabilities_tags" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_data_capabilities_tags_locale_idx" ON "_content_v_version_service_data_capabilities_tags" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_data_capabilities_order_idx" ON "_content_v_version_service_data_capabilities" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_data_capabilities_parent_id_idx" ON "_content_v_version_service_data_capabilities" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_data_capabilities_locale_idx" ON "_content_v_version_service_data_capabilities" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_data_architecture_tags_order_idx" ON "_content_v_version_service_data_architecture_tags" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_data_architecture_tags_parent_id_idx" ON "_content_v_version_service_data_architecture_tags" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_data_architecture_tags_locale_idx" ON "_content_v_version_service_data_architecture_tags" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_data_architecture_order_idx" ON "_content_v_version_service_data_architecture" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_data_architecture_parent_id_idx" ON "_content_v_version_service_data_architecture" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_data_architecture_locale_idx" ON "_content_v_version_service_data_architecture" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_data_showcase_tags_order_idx" ON "_content_v_version_service_data_showcase_tags" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_data_showcase_tags_parent_id_idx" ON "_content_v_version_service_data_showcase_tags" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_data_showcase_tags_locale_idx" ON "_content_v_version_service_data_showcase_tags" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_data_showcase_order_idx" ON "_content_v_version_service_data_showcase" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_data_showcase_parent_id_idx" ON "_content_v_version_service_data_showcase" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_data_showcase_locale_idx" ON "_content_v_version_service_data_showcase" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_data_process_tags_order_idx" ON "_content_v_version_service_data_process_tags" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_data_process_tags_parent_id_idx" ON "_content_v_version_service_data_process_tags" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_data_process_tags_locale_idx" ON "_content_v_version_service_data_process_tags" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_data_process_order_idx" ON "_content_v_version_service_data_process" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_data_process_parent_id_idx" ON "_content_v_version_service_data_process" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_data_process_locale_idx" ON "_content_v_version_service_data_process" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_data_technologies_order_idx" ON "_content_v_version_service_data_technologies" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_data_technologies_parent_id_idx" ON "_content_v_version_service_data_technologies" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_data_managed_scope_tags_order_idx" ON "_content_v_version_service_data_managed_scope_tags" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_data_managed_scope_tags_parent_id_idx" ON "_content_v_version_service_data_managed_scope_tags" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_data_managed_scope_tags_locale_idx" ON "_content_v_version_service_data_managed_scope_tags" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_data_managed_scope_order_idx" ON "_content_v_version_service_data_managed_scope" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_data_managed_scope_parent_id_idx" ON "_content_v_version_service_data_managed_scope" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_data_managed_scope_locale_idx" ON "_content_v_version_service_data_managed_scope" USING btree ("_locale");
  CREATE INDEX "_cols_v_order_idx" ON "_cols_v" USING btree ("_order");
  CREATE INDEX "_cols_v_parent_id_idx" ON "_cols_v" USING btree ("_parent_id");
  CREATE INDEX "_cols_v_locale_idx" ON "_cols_v" USING btree ("_locale");
  CREATE INDEX "_vals_v_order_idx" ON "_vals_v" USING btree ("_order");
  CREATE INDEX "_vals_v_parent_id_idx" ON "_vals_v" USING btree ("_parent_id");
  CREATE INDEX "_vals_v_locale_idx" ON "_vals_v" USING btree ("_locale");
  CREATE INDEX "_rows_v_order_idx" ON "_rows_v" USING btree ("_order");
  CREATE INDEX "_rows_v_parent_id_idx" ON "_rows_v" USING btree ("_parent_id");
  CREATE INDEX "_rows_v_locale_idx" ON "_rows_v" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_data_faqs_order_idx" ON "_content_v_version_service_data_faqs" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_data_faqs_parent_id_idx" ON "_content_v_version_service_data_faqs" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_data_faqs_locale_idx" ON "_content_v_version_service_data_faqs" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_listing_family_stages_tags_order_idx" ON "_content_v_version_service_listing_family_stages_tags" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_listing_family_stages_tags_parent_id_idx" ON "_content_v_version_service_listing_family_stages_tags" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_listing_family_stages_tags_locale_idx" ON "_content_v_version_service_listing_family_stages_tags" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_listing_family_stages_order_idx" ON "_content_v_version_service_listing_family_stages" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_listing_family_stages_parent_id_idx" ON "_content_v_version_service_listing_family_stages" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_listing_family_stages_locale_idx" ON "_content_v_version_service_listing_family_stages" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_listing_decisions_tags_order_idx" ON "_content_v_version_service_listing_decisions_tags" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_listing_decisions_tags_parent_id_idx" ON "_content_v_version_service_listing_decisions_tags" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_listing_decisions_tags_locale_idx" ON "_content_v_version_service_listing_decisions_tags" USING btree ("_locale");
  CREATE INDEX "_content_v_version_service_listing_decisions_order_idx" ON "_content_v_version_service_listing_decisions" USING btree ("_order");
  CREATE INDEX "_content_v_version_service_listing_decisions_parent_id_idx" ON "_content_v_version_service_listing_decisions" USING btree ("_parent_id");
  CREATE INDEX "_content_v_version_service_listing_decisions_locale_idx" ON "_content_v_version_service_listing_decisions" USING btree ("_locale");
  ALTER TABLE "content" ADD CONSTRAINT "content_service_data_related_managed_service_id_content_id_fk" FOREIGN KEY ("service_data_related_managed_service_id") REFERENCES "public"."content"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_content_v" ADD CONSTRAINT "_content_v_version_service_data_related_managed_service_id_content_id_fk" FOREIGN KEY ("version_service_data_related_managed_service_id") REFERENCES "public"."content"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "content_service_data_service_data_related_managed_servic_idx" ON "content" USING btree ("service_data_related_managed_service_id");
  CREATE INDEX "_content_v_version_service_data_version_service_data_rel_idx" ON "_content_v" USING btree ("version_service_data_related_managed_service_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "content_service_data_pulse" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_data_context_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_data_context" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_data_deliverables_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_data_deliverables" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_data_capabilities_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_data_capabilities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_data_architecture_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_data_architecture" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_data_showcase_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_data_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_data_process_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_data_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_data_technologies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_data_managed_scope_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_data_managed_scope" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cols" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "vals" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "rows" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_data_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_listing_family_stages_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_listing_family_stages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_listing_decisions_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "content_service_listing_decisions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_data_pulse" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_data_context_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_data_context" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_data_deliverables_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_data_deliverables" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_data_capabilities_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_data_capabilities" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_data_architecture_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_data_architecture" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_data_showcase_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_data_showcase" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_data_process_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_data_process" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_data_technologies" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_data_managed_scope_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_data_managed_scope" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_cols_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_vals_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_rows_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_data_faqs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_listing_family_stages_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_listing_family_stages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_listing_decisions_tags" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_content_v_version_service_listing_decisions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "content_service_data_pulse" CASCADE;
  DROP TABLE "content_service_data_context_tags" CASCADE;
  DROP TABLE "content_service_data_context" CASCADE;
  DROP TABLE "content_service_data_deliverables_tags" CASCADE;
  DROP TABLE "content_service_data_deliverables" CASCADE;
  DROP TABLE "content_service_data_capabilities_tags" CASCADE;
  DROP TABLE "content_service_data_capabilities" CASCADE;
  DROP TABLE "content_service_data_architecture_tags" CASCADE;
  DROP TABLE "content_service_data_architecture" CASCADE;
  DROP TABLE "content_service_data_showcase_tags" CASCADE;
  DROP TABLE "content_service_data_showcase" CASCADE;
  DROP TABLE "content_service_data_process_tags" CASCADE;
  DROP TABLE "content_service_data_process" CASCADE;
  DROP TABLE "content_service_data_technologies" CASCADE;
  DROP TABLE "content_service_data_managed_scope_tags" CASCADE;
  DROP TABLE "content_service_data_managed_scope" CASCADE;
  DROP TABLE "cols" CASCADE;
  DROP TABLE "vals" CASCADE;
  DROP TABLE "rows" CASCADE;
  DROP TABLE "content_service_data_faqs" CASCADE;
  DROP TABLE "content_service_listing_family_stages_tags" CASCADE;
  DROP TABLE "content_service_listing_family_stages" CASCADE;
  DROP TABLE "content_service_listing_decisions_tags" CASCADE;
  DROP TABLE "content_service_listing_decisions" CASCADE;
  DROP TABLE "_content_v_version_service_data_pulse" CASCADE;
  DROP TABLE "_content_v_version_service_data_context_tags" CASCADE;
  DROP TABLE "_content_v_version_service_data_context" CASCADE;
  DROP TABLE "_content_v_version_service_data_deliverables_tags" CASCADE;
  DROP TABLE "_content_v_version_service_data_deliverables" CASCADE;
  DROP TABLE "_content_v_version_service_data_capabilities_tags" CASCADE;
  DROP TABLE "_content_v_version_service_data_capabilities" CASCADE;
  DROP TABLE "_content_v_version_service_data_architecture_tags" CASCADE;
  DROP TABLE "_content_v_version_service_data_architecture" CASCADE;
  DROP TABLE "_content_v_version_service_data_showcase_tags" CASCADE;
  DROP TABLE "_content_v_version_service_data_showcase" CASCADE;
  DROP TABLE "_content_v_version_service_data_process_tags" CASCADE;
  DROP TABLE "_content_v_version_service_data_process" CASCADE;
  DROP TABLE "_content_v_version_service_data_technologies" CASCADE;
  DROP TABLE "_content_v_version_service_data_managed_scope_tags" CASCADE;
  DROP TABLE "_content_v_version_service_data_managed_scope" CASCADE;
  DROP TABLE "_cols_v" CASCADE;
  DROP TABLE "_vals_v" CASCADE;
  DROP TABLE "_rows_v" CASCADE;
  DROP TABLE "_content_v_version_service_data_faqs" CASCADE;
  DROP TABLE "_content_v_version_service_listing_family_stages_tags" CASCADE;
  DROP TABLE "_content_v_version_service_listing_family_stages" CASCADE;
  DROP TABLE "_content_v_version_service_listing_decisions_tags" CASCADE;
  DROP TABLE "_content_v_version_service_listing_decisions" CASCADE;
  ALTER TABLE "content" DROP CONSTRAINT "content_service_data_related_managed_service_id_content_id_fk";

  ALTER TABLE "_content_v" DROP CONSTRAINT "_content_v_version_service_data_related_managed_service_id_content_id_fk";

  DROP INDEX "content_service_data_service_data_related_managed_servic_idx";
  DROP INDEX "_content_v_version_service_data_version_service_data_rel_idx";
  ALTER TABLE "content" DROP COLUMN "service_data_code";
  ALTER TABLE "content" DROP COLUMN "service_data_related_managed_service_id";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_category";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_hero_title";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_hero_body";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_overview_title";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_overview_body";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_context_title";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_deliverables_title";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_deliverables_body";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_capabilities_title";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_architecture_title";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_architecture_body";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_showcase_title";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_showcase_body";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_process_title";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_cta_title";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_cta_body";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_managed_scope_title";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_managed_scope_body";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_comparison_intro";
  ALTER TABLE "content_locales" DROP COLUMN "service_data_faq_title";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_eyebrow";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_explore_label";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_consult_label";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_back_label";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_family_title";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_family_body";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_decision_title";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_decision_body";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_overview_label";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_deliverables_label";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_capabilities_label";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_architecture_label";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_process_label";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_technologies_label";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_comparison_label";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_managed_scope_label";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_faq_label";
  ALTER TABLE "content_locales" DROP COLUMN "service_listing_related_label";
  ALTER TABLE "_content_v" DROP COLUMN "version_service_data_code";
  ALTER TABLE "_content_v" DROP COLUMN "version_service_data_related_managed_service_id";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_category";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_hero_title";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_hero_body";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_overview_title";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_overview_body";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_context_title";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_deliverables_title";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_deliverables_body";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_capabilities_title";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_architecture_title";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_architecture_body";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_showcase_title";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_showcase_body";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_process_title";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_cta_title";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_cta_body";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_managed_scope_title";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_managed_scope_body";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_comparison_intro";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_data_faq_title";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_eyebrow";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_explore_label";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_consult_label";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_back_label";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_family_title";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_family_body";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_decision_title";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_decision_body";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_overview_label";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_deliverables_label";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_capabilities_label";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_architecture_label";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_process_label";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_technologies_label";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_comparison_label";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_managed_scope_label";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_faq_label";
  ALTER TABLE "_content_v_locales" DROP COLUMN "version_service_listing_related_label";`)
}
