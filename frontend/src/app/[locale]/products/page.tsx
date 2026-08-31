import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductConfigurator } from "@/components/product-configurator";
import styles from "@/components/product-configurator.module.css";
import { isLocale } from "@/lib/locales";
import { cms } from "@/lib/payload-cms";
import { isProductPackageKey } from "@/lib/product-catalog";
import { routeMetadata } from "@/lib/seo";

function heroData(content: Awaited<ReturnType<typeof cms.content>>) {
  const props = content?.blocks[0]?.props ?? {};
  return { eyebrow: String(props.eyebrow ?? ""), pills: Array.isArray(props.pills) ? props.pills.map(String) : [] };
}

export async function generateMetadata({ params }: PageProps<"/[locale]/products">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = await cms.content(locale, "products");
  if (!content) return {};
  return routeMetadata(locale, "products", content.seo.title, content.seo.description);
}

export default async function ProductsPage({ params, searchParams }: PageProps<"/[locale]/products">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const [catalog, content] = await Promise.all([cms.productCatalog(), cms.content(locale, "products")]);
  if (!catalog.packages.length || !content) notFound();
  const requestedPackage = typeof query.package === "string" ? query.package : undefined;
  const initialPackage = isProductPackageKey(requestedPackage, catalog.packages) ? requestedPackage : catalog.packages[0].key;
  const hero = heroData(content);

  return <main className={`${styles.page} internal-main`}>
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <span className={styles.heroEyebrow}>{hero.eyebrow}</span>
        <h1>{content.title}</h1>
        <p>{content.excerpt}</p>
        <div className={styles.heroPills}>{hero.pills.map((pill) => <span key={pill}>{pill}</span>)}</div>
      </div>
    </section>
    <ProductConfigurator locale={locale} initialPackage={initialPackage} catalog={catalog} />
  </main>;
}
