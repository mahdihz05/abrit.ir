import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/lead-form";
import { ProductConfigurator } from "@/components/product-configurator";
import styles from "@/components/product-configurator.module.css";
import { isLocale } from "@/lib/locales";
import { isProductPackageKey } from "@/lib/product-packages";
import { routeMetadata } from "@/lib/seo";
import type { Locale } from "@/lib/types";

const pageCopy: Record<Locale, { title: string; description: string; eyebrow: string; pills: string[] }> = {
  fa: {
    title: "پکیج مناسب فناوری اطلاعات سازمان خود را انتخاب کنید",
    description: "پکیج‌های ابریت براساس تعداد کاربران، اندازه کسب‌وکار و سطح مدیریت موردنیاز طراحی شده‌اند. تعداد کاربران را مشخص کنید، قیمت‌ها را ببینید و خدمات هر سطح را مقایسه کنید.",
    eyebrow: "پکیج‌های مدیریت فناوری اطلاعات ابریت",
    pills: ["پیشنهاد براساس تعداد کاربران", "قیمت شفاف هر دوره", "مقایسه روشن خدمات"],
  },
  en: {
    title: "Choose the right IT package for your organization",
    description: "AbrIT packages are designed around your user count, company size and required management level. Set your users, review prices and compare each service level.",
    eyebrow: "AbrIT managed IT packages",
    pills: ["User-based recommendation", "Clear term pricing", "Simple service comparison"],
  },
  "ar-ae": {
    title: "اختر باقة تقنية المعلومات المناسبة لمؤسستك",
    description: "صُممت باقات AbrIT وفق عدد المستخدمين وحجم المؤسسة ومستوى الإدارة المطلوب. حدد المستخدمين وراجع الأسعار وقارن الخدمات في كل مستوى.",
    eyebrow: "باقات إدارة تقنية المعلومات من AbrIT",
    pills: ["اقتراح حسب عدد المستخدمين", "سعر واضح لكل مدة", "مقارنة بسيطة للخدمات"],
  },
};

export async function generateMetadata({ params }: PageProps<"/[locale]/products">): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const content = pageCopy[locale];
  return routeMetadata(locale, "products", content.title, content.description);
}

export default async function ProductsPage({ params, searchParams }: PageProps<"/[locale]/products">) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const requestedPackage = typeof query.package === "string" ? query.package : undefined;
  const initialPackage = isProductPackageKey(requestedPackage) ? requestedPackage : "basic";
  const content = pageCopy[locale];

  return <main className={`${styles.page} internal-main`}>
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <span className={styles.heroEyebrow}>{content.eyebrow}</span>
        <h1>{content.title}</h1>
        <p>{content.description}</p>
        <div className={styles.heroPills}>{content.pills.map((pill) => <span key={pill}>{pill}</span>)}</div>
      </div>
    </section>
    <ProductConfigurator locale={locale} initialPackage={initialPackage} />
    <section className={styles.consultationSection}>
      <div className={styles.consultationInner}>
        <LeadForm locale={locale} context="products-consultation" compact />
      </div>
    </section>
  </main>;
}
