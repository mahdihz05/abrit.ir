import Image from "next/image";
import Link from "next/link";
import { localizedPackages, localizedServices, pageCopy } from "@/lib/public-content";
import type { Locale } from "@/lib/types";
import styles from "./techor-homepage.module.css";

const copy = {
  fa: { eyebrow: "فناوری اطلاعات، آماده برای رشد", hero: "عملیات فناوری اطلاعات را به یک مزیت قابل اتکا تبدیل کنید.", body: "ابریت شبکه، امنیت، کاربران، داده و سرویس‌های سازمان شما را در یک مدل عملیاتی شفاف مدیریت می‌کند.", start: "درخواست ارزیابی", explore: "مشاهده خدمات", services: "خدمات مدیریت‌شده", pricing: "پکیج‌های خدمات", process: "روش همکاری", processBody: "از ارزیابی تا بهبود مستمر، هر گام با اولویت‌های کسب‌وکار شما هماهنگ می‌شود.", steps: ["ارزیابی وضعیت", "طراحی محدوده", "استقرار مرحله‌ای", "پایش و بهبود"], cta: "برای زیرساختی آرام‌تر و تیمی متمرکزتر آماده‌اید؟", ctaAction: "گفت‌وگو با ابریت" },
  en: { eyebrow: "IT built for momentum", hero: "Turn IT operations into a dependable business advantage.", body: "AbrIT manages your networks, security, people, data and services through one transparent operating model.", start: "Request an assessment", explore: "Explore services", services: "Managed services", pricing: "Service packages", process: "How we work", processBody: "From assessment to continuous improvement, every step is aligned to your business priorities.", steps: ["Assess", "Design the scope", "Implement in stages", "Monitor and improve"], cta: "Ready for calmer infrastructure and a more focused team?", ctaAction: "Talk to AbrIT" },
  "ar-ae": { eyebrow: "تقنية معلومات تدعم النمو", hero: "حوّل عمليات تقنية المعلومات إلى ميزة أعمال موثوقة.", body: "تدير AbrIT الشبكات والأمن والمستخدمين والبيانات والخدمات ضمن نموذج تشغيلي شفاف واحد.", start: "اطلب تقييماً", explore: "استكشف الخدمات", services: "الخدمات المُدارة", pricing: "باقات الخدمات", process: "منهجية العمل", processBody: "من التقييم إلى التحسين المستمر، تتوافق كل خطوة مع أولويات أعمالك.", steps: ["تقييم الوضع", "تصميم النطاق", "تنفيذ مرحلي", "مراقبة وتحسين"], cta: "هل أنت مستعد لبنية تحتية أكثر استقراراً وفريق أكثر تركيزاً؟", ctaAction: "تواصل مع AbrIT" },
} as const;

export function TechorHomepage({ locale }: { locale: Locale }) {
  const text = copy[locale];
  const services = localizedServices(locale).slice(0, 6);
  const packages = localizedPackages(locale);
  const serviceCopy = pageCopy[locale];

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={`${styles.wrap} ${styles.heroLayout}`}>
          <div className={styles.heroCopy}>
            <p className={styles.eyebrow}>{text.eyebrow}</p>
            <h1>{text.hero}</h1>
            <p>{text.body}</p>
            <div className={styles.actions}>
              <Link className={styles.primary} href={`/${locale}/contact`}>{text.start}</Link>
              <Link className={styles.secondary} href={`/${locale}/services`}>{text.explore}</Link>
            </div>
          </div>
          <div className={styles.visual}>
            <div className={styles.visualHalo} />
            <Image src="/media/homepage/infrastructure-console.webp" alt="" width={960} height={640} priority />
            <div className={styles.statusCard}><span>ABRIT OPS</span><strong>24/7</strong><small>Visibility across your operation</small></div>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.wrap}>
          <div className={styles.heading}><p>{text.services}</p><h2>{serviceCopy.servicesTitle}</h2><span>{serviceCopy.servicesIntro}</span></div>
          <div className={styles.serviceGrid}>
            {services.map((service, index) => <Link className={styles.serviceCard} href={service.url} key={service.id}><i>{String(index + 1).padStart(2, "0")}</i><h3>{service.title}</h3><p>{service.excerpt}</p><b>↗</b></Link>)}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.darkSection}`}>
        <div className={styles.wrap}>
          <div className={styles.heading}><p>{text.process}</p><h2>{text.processBody}</h2></div>
          <ol className={styles.steps}>{text.steps.map((step, index) => <li key={step}><span>0{index + 1}</span><b>{step}</b></li>)}</ol>
        </div>
      </section>

      <section className={`${styles.section} ${styles.pricingSection}`}>
        <div className={styles.wrap}>
          <div className={styles.heading}><p>{text.pricing}</p><h2>{locale === "fa" ? "سطح مناسب پشتیبانی برای امروز و فردای سازمان" : locale === "en" ? "The right level of support for today and tomorrow" : "مستوى الدعم المناسب لمؤسستك اليوم وغداً"}</h2></div>
          <div className={styles.packageGrid}>{packages.map((item) => <Link href={`/${locale}/pricing`} className={`${styles.package} ${item.is_featured ? styles.featured : ""}`} key={item.key}><small>{item.is_featured ? "ABRIT SELECT" : "MANAGED IT"}</small><h3>{item.name}</h3><strong>{new Intl.NumberFormat(locale).format(item.base_monthly_toman)} <em>تومان</em></strong><p>{item.sla}</p><span>{item.included_users} users · {item.included_endpoints} endpoints</span></Link>)}</div>
        </div>
      </section>

      <section className={styles.cta}><div className={styles.wrap}><h2>{text.cta}</h2><Link className={styles.primary} href={`/${locale}/contact`}>{text.ctaAction}</Link></div></section>
    </main>
  );
}
