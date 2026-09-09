import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('fa', 'en', 'ar-ae');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor', 'seo', 'form-manager', 'pricing-manager', 'viewer');
  CREATE TYPE "public"."enum_content_kind" AS ENUM('page', 'service', 'solution', 'independent-service', 'product', 'knowledge', 'news');
  CREATE TYPE "public"."enum_content_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_content_seo_robots" AS ENUM('index,follow', 'noindex,nofollow');
  CREATE TYPE "public"."enum__content_v_version_kind" AS ENUM('page', 'service', 'solution', 'independent-service', 'product', 'knowledge', 'news');
  CREATE TYPE "public"."enum__content_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__content_v_published_locale" AS ENUM('fa', 'en', 'ar-ae');
  CREATE TYPE "public"."enum__content_v_version_seo_robots" AS ENUM('index,follow', 'noindex,nofollow');
  CREATE TYPE "public"."enum_packages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__packages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__packages_v_published_locale" AS ENUM('fa', 'en', 'ar-ae');
  CREATE TYPE "public"."enum_forms_fields_type" AS ENUM('text', 'textarea', 'email', 'phone', 'select');
  CREATE TYPE "public"."enum_form_submissions_status" AS ENUM('new', 'in-progress', 'resolved', 'spam');
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"is_private" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "content_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"primary_action_label" varchar,
  	"primary_action_href" varchar,
  	"secondary_action_label" varchar,
  	"secondary_action_href" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "content_blocks_feature_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"href" varchar
  );
  
  CREATE TABLE "content_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "content_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar
  );
  
  CREATE TABLE "content_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "content_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"action_label" varchar,
  	"action_href" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "content" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legacy_i_d" varchar,
  	"kind" "enum_content_kind",
  	"featured_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_content_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "content_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"excerpt" varchar,
  	"legacy_path" varchar,
  	"legacy_blocks" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"seo_canonical" varchar,
  	"seo_robots" "enum_content_seo_robots",
  	"seo_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_content_v_blocks_hero" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"primary_action_label" varchar,
  	"primary_action_href" varchar,
  	"secondary_action_label" varchar,
  	"secondary_action_href" varchar,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_content_v_blocks_feature_grid_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"icon" varchar,
  	"href" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_content_v_blocks_feature_grid" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_content_v_blocks_faq_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_content_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_content_v_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"action_label" varchar,
  	"action_href" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_content_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_legacy_i_d" varchar,
  	"version_kind" "enum__content_v_version_kind",
  	"version_featured_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__content_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__content_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_content_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_excerpt" varchar,
  	"version_legacy_path" varchar,
  	"version_legacy_blocks" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"version_seo_canonical" varchar,
  	"version_seo_robots" "enum__content_v_version_seo_robots",
  	"version_seo_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "packages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"legacy_i_d" varchar,
  	"key" varchar,
  	"order" numeric DEFAULT 0,
  	"base_monthly_toman" numeric,
  	"included_users" numeric,
  	"included_endpoints" numeric,
  	"included_servers" numeric,
  	"included_sites" numeric,
  	"user_rate_toman" numeric,
  	"endpoint_rate_toman" numeric,
  	"is_featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_packages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "packages_locales" (
  	"name" varchar,
  	"description" varchar,
  	"sla" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_packages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_legacy_i_d" varchar,
  	"version_key" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_base_monthly_toman" numeric,
  	"version_included_users" numeric,
  	"version_included_endpoints" numeric,
  	"version_included_servers" numeric,
  	"version_included_sites" numeric,
  	"version_user_rate_toman" numeric,
  	"version_endpoint_rate_toman" numeric,
  	"version_is_featured" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__packages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__packages_v_published_locale",
  	"latest" boolean
  );
  
  CREATE TABLE "_packages_v_locales" (
  	"version_name" varchar,
  	"version_description" varchar,
  	"version_sla" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "forms_fields_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "forms_fields_options_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms_fields" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"type" "enum_forms_fields_type" NOT NULL,
  	"required" boolean DEFAULT false
  );
  
  CREATE TABLE "forms_fields_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "forms" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"is_active" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "forms_locales" (
  	"title" varchar NOT NULL,
  	"consent_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "form_submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"form_key" varchar NOT NULL,
  	"status" "enum_form_submissions_status" DEFAULT 'new',
  	"data" jsonb NOT NULL,
  	"consent" boolean DEFAULT false NOT NULL,
  	"source" varchar,
  	"ip_hash" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"content_id" integer,
  	"packages_id" integer,
  	"forms_id" integer,
  	"form_submissions_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"brand_name" varchar DEFAULT 'AbrIT' NOT NULL,
  	"phone" varchar,
  	"email" varchar,
  	"logo_id" integer,
  	"favicon_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_locales" (
  	"address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "navigation_header" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "navigation_footer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_blocks_hero" ADD CONSTRAINT "content_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "content_blocks_hero" ADD CONSTRAINT "content_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_blocks_feature_grid_items" ADD CONSTRAINT "content_blocks_feature_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_blocks_feature_grid" ADD CONSTRAINT "content_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_blocks_faq_items" ADD CONSTRAINT "content_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_blocks_faq" ADD CONSTRAINT "content_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_blocks_cta" ADD CONSTRAINT "content_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content" ADD CONSTRAINT "content_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "content_locales" ADD CONSTRAINT "content_locales_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "content_locales" ADD CONSTRAINT "content_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_blocks_hero" ADD CONSTRAINT "_content_v_blocks_hero_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_content_v_blocks_hero" ADD CONSTRAINT "_content_v_blocks_hero_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_blocks_feature_grid_items" ADD CONSTRAINT "_content_v_blocks_feature_grid_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v_blocks_feature_grid"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_blocks_feature_grid" ADD CONSTRAINT "_content_v_blocks_feature_grid_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_blocks_faq_items" ADD CONSTRAINT "_content_v_blocks_faq_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_blocks_faq" ADD CONSTRAINT "_content_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v_blocks_cta" ADD CONSTRAINT "_content_v_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_v" ADD CONSTRAINT "_content_v_parent_id_content_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."content"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_content_v" ADD CONSTRAINT "_content_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_content_v_locales" ADD CONSTRAINT "_content_v_locales_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_content_v_locales" ADD CONSTRAINT "_content_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "packages_locales" ADD CONSTRAINT "packages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_packages_v" ADD CONSTRAINT "_packages_v_parent_id_packages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."packages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_packages_v_locales" ADD CONSTRAINT "_packages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_packages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_fields_options" ADD CONSTRAINT "forms_fields_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_fields_options_locales" ADD CONSTRAINT "forms_fields_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_fields_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_fields" ADD CONSTRAINT "forms_fields_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_fields_locales" ADD CONSTRAINT "forms_fields_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms_fields"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "forms_locales" ADD CONSTRAINT "forms_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_content_fk" FOREIGN KEY ("content_id") REFERENCES "public"."content"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_packages_fk" FOREIGN KEY ("packages_id") REFERENCES "public"."packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_forms_fk" FOREIGN KEY ("forms_id") REFERENCES "public"."forms"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_form_submissions_fk" FOREIGN KEY ("form_submissions_id") REFERENCES "public"."form_submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_favicon_id_media_id_fk" FOREIGN KEY ("favicon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header" ADD CONSTRAINT "navigation_header_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer" ADD CONSTRAINT "navigation_footer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "content_blocks_hero_order_idx" ON "content_blocks_hero" USING btree ("_order");
  CREATE INDEX "content_blocks_hero_parent_id_idx" ON "content_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "content_blocks_hero_path_idx" ON "content_blocks_hero" USING btree ("_path");
  CREATE INDEX "content_blocks_hero_locale_idx" ON "content_blocks_hero" USING btree ("_locale");
  CREATE INDEX "content_blocks_hero_image_idx" ON "content_blocks_hero" USING btree ("image_id");
  CREATE INDEX "content_blocks_feature_grid_items_order_idx" ON "content_blocks_feature_grid_items" USING btree ("_order");
  CREATE INDEX "content_blocks_feature_grid_items_parent_id_idx" ON "content_blocks_feature_grid_items" USING btree ("_parent_id");
  CREATE INDEX "content_blocks_feature_grid_items_locale_idx" ON "content_blocks_feature_grid_items" USING btree ("_locale");
  CREATE INDEX "content_blocks_feature_grid_order_idx" ON "content_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "content_blocks_feature_grid_parent_id_idx" ON "content_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "content_blocks_feature_grid_path_idx" ON "content_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "content_blocks_feature_grid_locale_idx" ON "content_blocks_feature_grid" USING btree ("_locale");
  CREATE INDEX "content_blocks_faq_items_order_idx" ON "content_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "content_blocks_faq_items_parent_id_idx" ON "content_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "content_blocks_faq_items_locale_idx" ON "content_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "content_blocks_faq_order_idx" ON "content_blocks_faq" USING btree ("_order");
  CREATE INDEX "content_blocks_faq_parent_id_idx" ON "content_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "content_blocks_faq_path_idx" ON "content_blocks_faq" USING btree ("_path");
  CREATE INDEX "content_blocks_faq_locale_idx" ON "content_blocks_faq" USING btree ("_locale");
  CREATE INDEX "content_blocks_cta_order_idx" ON "content_blocks_cta" USING btree ("_order");
  CREATE INDEX "content_blocks_cta_parent_id_idx" ON "content_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "content_blocks_cta_path_idx" ON "content_blocks_cta" USING btree ("_path");
  CREATE INDEX "content_blocks_cta_locale_idx" ON "content_blocks_cta" USING btree ("_locale");
  CREATE UNIQUE INDEX "content_legacy_i_d_idx" ON "content" USING btree ("legacy_i_d");
  CREATE INDEX "content_featured_image_idx" ON "content" USING btree ("featured_image_id");
  CREATE INDEX "content_updated_at_idx" ON "content" USING btree ("updated_at");
  CREATE INDEX "content_created_at_idx" ON "content" USING btree ("created_at");
  CREATE INDEX "content__status_idx" ON "content" USING btree ("_status");
  CREATE INDEX "content_slug_idx" ON "content_locales" USING btree ("slug","_locale");
  CREATE INDEX "content_legacy_path_idx" ON "content_locales" USING btree ("legacy_path","_locale");
  CREATE INDEX "content_seo_seo_image_idx" ON "content_locales" USING btree ("seo_image_id");
  CREATE UNIQUE INDEX "content_locales_locale_parent_id_unique" ON "content_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_content_v_blocks_hero_order_idx" ON "_content_v_blocks_hero" USING btree ("_order");
  CREATE INDEX "_content_v_blocks_hero_parent_id_idx" ON "_content_v_blocks_hero" USING btree ("_parent_id");
  CREATE INDEX "_content_v_blocks_hero_path_idx" ON "_content_v_blocks_hero" USING btree ("_path");
  CREATE INDEX "_content_v_blocks_hero_locale_idx" ON "_content_v_blocks_hero" USING btree ("_locale");
  CREATE INDEX "_content_v_blocks_hero_image_idx" ON "_content_v_blocks_hero" USING btree ("image_id");
  CREATE INDEX "_content_v_blocks_feature_grid_items_order_idx" ON "_content_v_blocks_feature_grid_items" USING btree ("_order");
  CREATE INDEX "_content_v_blocks_feature_grid_items_parent_id_idx" ON "_content_v_blocks_feature_grid_items" USING btree ("_parent_id");
  CREATE INDEX "_content_v_blocks_feature_grid_items_locale_idx" ON "_content_v_blocks_feature_grid_items" USING btree ("_locale");
  CREATE INDEX "_content_v_blocks_feature_grid_order_idx" ON "_content_v_blocks_feature_grid" USING btree ("_order");
  CREATE INDEX "_content_v_blocks_feature_grid_parent_id_idx" ON "_content_v_blocks_feature_grid" USING btree ("_parent_id");
  CREATE INDEX "_content_v_blocks_feature_grid_path_idx" ON "_content_v_blocks_feature_grid" USING btree ("_path");
  CREATE INDEX "_content_v_blocks_feature_grid_locale_idx" ON "_content_v_blocks_feature_grid" USING btree ("_locale");
  CREATE INDEX "_content_v_blocks_faq_items_order_idx" ON "_content_v_blocks_faq_items" USING btree ("_order");
  CREATE INDEX "_content_v_blocks_faq_items_parent_id_idx" ON "_content_v_blocks_faq_items" USING btree ("_parent_id");
  CREATE INDEX "_content_v_blocks_faq_items_locale_idx" ON "_content_v_blocks_faq_items" USING btree ("_locale");
  CREATE INDEX "_content_v_blocks_faq_order_idx" ON "_content_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_content_v_blocks_faq_parent_id_idx" ON "_content_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_content_v_blocks_faq_path_idx" ON "_content_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_content_v_blocks_faq_locale_idx" ON "_content_v_blocks_faq" USING btree ("_locale");
  CREATE INDEX "_content_v_blocks_cta_order_idx" ON "_content_v_blocks_cta" USING btree ("_order");
  CREATE INDEX "_content_v_blocks_cta_parent_id_idx" ON "_content_v_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "_content_v_blocks_cta_path_idx" ON "_content_v_blocks_cta" USING btree ("_path");
  CREATE INDEX "_content_v_blocks_cta_locale_idx" ON "_content_v_blocks_cta" USING btree ("_locale");
  CREATE INDEX "_content_v_parent_idx" ON "_content_v" USING btree ("parent_id");
  CREATE INDEX "_content_v_version_version_legacy_i_d_idx" ON "_content_v" USING btree ("version_legacy_i_d");
  CREATE INDEX "_content_v_version_version_featured_image_idx" ON "_content_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_content_v_version_version_updated_at_idx" ON "_content_v" USING btree ("version_updated_at");
  CREATE INDEX "_content_v_version_version_created_at_idx" ON "_content_v" USING btree ("version_created_at");
  CREATE INDEX "_content_v_version_version__status_idx" ON "_content_v" USING btree ("version__status");
  CREATE INDEX "_content_v_created_at_idx" ON "_content_v" USING btree ("created_at");
  CREATE INDEX "_content_v_updated_at_idx" ON "_content_v" USING btree ("updated_at");
  CREATE INDEX "_content_v_snapshot_idx" ON "_content_v" USING btree ("snapshot");
  CREATE INDEX "_content_v_published_locale_idx" ON "_content_v" USING btree ("published_locale");
  CREATE INDEX "_content_v_latest_idx" ON "_content_v" USING btree ("latest");
  CREATE INDEX "_content_v_autosave_idx" ON "_content_v" USING btree ("autosave");
  CREATE INDEX "_content_v_version_version_slug_idx" ON "_content_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_content_v_version_version_legacy_path_idx" ON "_content_v_locales" USING btree ("version_legacy_path","_locale");
  CREATE INDEX "_content_v_version_seo_version_seo_image_idx" ON "_content_v_locales" USING btree ("version_seo_image_id");
  CREATE UNIQUE INDEX "_content_v_locales_locale_parent_id_unique" ON "_content_v_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "packages_legacy_i_d_idx" ON "packages" USING btree ("legacy_i_d");
  CREATE UNIQUE INDEX "packages_key_idx" ON "packages" USING btree ("key");
  CREATE INDEX "packages_updated_at_idx" ON "packages" USING btree ("updated_at");
  CREATE INDEX "packages_created_at_idx" ON "packages" USING btree ("created_at");
  CREATE INDEX "packages__status_idx" ON "packages" USING btree ("_status");
  CREATE UNIQUE INDEX "packages_locales_locale_parent_id_unique" ON "packages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_packages_v_parent_idx" ON "_packages_v" USING btree ("parent_id");
  CREATE INDEX "_packages_v_version_version_legacy_i_d_idx" ON "_packages_v" USING btree ("version_legacy_i_d");
  CREATE INDEX "_packages_v_version_version_key_idx" ON "_packages_v" USING btree ("version_key");
  CREATE INDEX "_packages_v_version_version_updated_at_idx" ON "_packages_v" USING btree ("version_updated_at");
  CREATE INDEX "_packages_v_version_version_created_at_idx" ON "_packages_v" USING btree ("version_created_at");
  CREATE INDEX "_packages_v_version_version__status_idx" ON "_packages_v" USING btree ("version__status");
  CREATE INDEX "_packages_v_created_at_idx" ON "_packages_v" USING btree ("created_at");
  CREATE INDEX "_packages_v_updated_at_idx" ON "_packages_v" USING btree ("updated_at");
  CREATE INDEX "_packages_v_snapshot_idx" ON "_packages_v" USING btree ("snapshot");
  CREATE INDEX "_packages_v_published_locale_idx" ON "_packages_v" USING btree ("published_locale");
  CREATE INDEX "_packages_v_latest_idx" ON "_packages_v" USING btree ("latest");
  CREATE UNIQUE INDEX "_packages_v_locales_locale_parent_id_unique" ON "_packages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_fields_options_order_idx" ON "forms_fields_options" USING btree ("_order");
  CREATE INDEX "forms_fields_options_parent_id_idx" ON "forms_fields_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_fields_options_locales_locale_parent_id_unique" ON "forms_fields_options_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "forms_fields_order_idx" ON "forms_fields" USING btree ("_order");
  CREATE INDEX "forms_fields_parent_id_idx" ON "forms_fields" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "forms_fields_locales_locale_parent_id_unique" ON "forms_fields_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "forms_key_idx" ON "forms" USING btree ("key");
  CREATE INDEX "forms_updated_at_idx" ON "forms" USING btree ("updated_at");
  CREATE INDEX "forms_created_at_idx" ON "forms" USING btree ("created_at");
  CREATE UNIQUE INDEX "forms_locales_locale_parent_id_unique" ON "forms_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "form_submissions_form_key_idx" ON "form_submissions" USING btree ("form_key");
  CREATE INDEX "form_submissions_updated_at_idx" ON "form_submissions" USING btree ("updated_at");
  CREATE INDEX "form_submissions_created_at_idx" ON "form_submissions" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_content_id_idx" ON "payload_locked_documents_rels" USING btree ("content_id");
  CREATE INDEX "payload_locked_documents_rels_packages_id_idx" ON "payload_locked_documents_rels" USING btree ("packages_id");
  CREATE INDEX "payload_locked_documents_rels_forms_id_idx" ON "payload_locked_documents_rels" USING btree ("forms_id");
  CREATE INDEX "payload_locked_documents_rels_form_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("form_submissions_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_logo_idx" ON "site_settings" USING btree ("logo_id");
  CREATE INDEX "site_settings_favicon_idx" ON "site_settings" USING btree ("favicon_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_header_order_idx" ON "navigation_header" USING btree ("_order");
  CREATE INDEX "navigation_header_parent_id_idx" ON "navigation_header" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_locale_idx" ON "navigation_header" USING btree ("_locale");
  CREATE INDEX "navigation_footer_order_idx" ON "navigation_footer" USING btree ("_order");
  CREATE INDEX "navigation_footer_parent_id_idx" ON "navigation_footer" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_locale_idx" ON "navigation_footer" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "content_blocks_hero" CASCADE;
  DROP TABLE "content_blocks_feature_grid_items" CASCADE;
  DROP TABLE "content_blocks_feature_grid" CASCADE;
  DROP TABLE "content_blocks_faq_items" CASCADE;
  DROP TABLE "content_blocks_faq" CASCADE;
  DROP TABLE "content_blocks_cta" CASCADE;
  DROP TABLE "content" CASCADE;
  DROP TABLE "content_locales" CASCADE;
  DROP TABLE "_content_v_blocks_hero" CASCADE;
  DROP TABLE "_content_v_blocks_feature_grid_items" CASCADE;
  DROP TABLE "_content_v_blocks_feature_grid" CASCADE;
  DROP TABLE "_content_v_blocks_faq_items" CASCADE;
  DROP TABLE "_content_v_blocks_faq" CASCADE;
  DROP TABLE "_content_v_blocks_cta" CASCADE;
  DROP TABLE "_content_v" CASCADE;
  DROP TABLE "_content_v_locales" CASCADE;
  DROP TABLE "packages" CASCADE;
  DROP TABLE "packages_locales" CASCADE;
  DROP TABLE "_packages_v" CASCADE;
  DROP TABLE "_packages_v_locales" CASCADE;
  DROP TABLE "forms_fields_options" CASCADE;
  DROP TABLE "forms_fields_options_locales" CASCADE;
  DROP TABLE "forms_fields" CASCADE;
  DROP TABLE "forms_fields_locales" CASCADE;
  DROP TABLE "forms" CASCADE;
  DROP TABLE "forms_locales" CASCADE;
  DROP TABLE "form_submissions" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "navigation_header" CASCADE;
  DROP TABLE "navigation_footer" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_content_kind";
  DROP TYPE "public"."enum_content_status";
  DROP TYPE "public"."enum_content_seo_robots";
  DROP TYPE "public"."enum__content_v_version_kind";
  DROP TYPE "public"."enum__content_v_version_status";
  DROP TYPE "public"."enum__content_v_published_locale";
  DROP TYPE "public"."enum__content_v_version_seo_robots";
  DROP TYPE "public"."enum_packages_status";
  DROP TYPE "public"."enum__packages_v_version_status";
  DROP TYPE "public"."enum__packages_v_published_locale";
  DROP TYPE "public"."enum_forms_fields_type";
  DROP TYPE "public"."enum_form_submissions_status";`)
}
