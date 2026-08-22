import Link from "next/link";
import type { Locale, SiteSettings } from "@/lib/types";

const content = {
  fa: {
    about: ["درباره AbrIT", "مدیریت یکپارچه فناوری اطلاعات برای سازمان‌ها", "AbrIT خدمات زیرساخت، شبکه، امنیت، پشتیبان‌گیری، فضای کار دیجیتال و اتوماسیون را در یک مدل عملیاتی هماهنگ ارائه می‌کند.", ["ارزیابی وضعیت موجود", "طراحی محدوده روشن", "اجرای مرحله‌ای", "مدیریت و بهبود مستمر"]],
    contact: ["تماس با AbrIT", "گفت‌وگو درباره وضعیت فناوری اطلاعات سازمان", "برای شروع ارزیابی، تعریف محدوده خدمات یا بررسی بسته مناسب می‌توانید با AbrIT تماس بگیرید.", []],
    knowledge: ["دانش و منابع", "راهنماهای کاربردی فناوری اطلاعات", "این بخش برای انتشار محتوای تأییدشده درباره زیرساخت، امنیت، پشتیبان‌گیری و مدیریت فناوری اطلاعات آماده شده است.", ["زیرساخت و شبکه", "امنیت و دسترسی", "پشتیبان‌گیری و تداوم", "مدیریت IT"]],
    news: ["اخبار و رسانه", "تازه‌های AbrIT", "خبرها، اطلاعیه‌ها، رویدادها و محتوای رسانه‌ای پس از تأیید نهایی در این بخش منتشر می‌شوند.", ["اخبار", "اطلاعیه‌ها", "رویدادها", "رسانه"]],
  },
  en: {
    about: ["About AbrIT", "Integrated IT management for organizations", "AbrIT brings infrastructure, networking, security, backup, digital workspace and automation into one coordinated operating model.", ["Current-state assessment", "Clear scope design", "Staged implementation", "Continuous management"]],
    contact: ["Contact AbrIT", "Discuss your organization's IT environment", "Contact AbrIT to begin an assessment, define a service scope or review the suitable package.", []],
    knowledge: ["Knowledge & resources", "Practical IT guidance", "This area is ready for approved content about infrastructure, security, backup and IT management.", ["Infrastructure & network", "Security & access", "Backup & continuity", "IT management"]],
    news: ["News & media", "Updates from AbrIT", "Approved news, announcements, events and media will be published here.", ["News", "Announcements", "Events", "Media"]],
  },
  "ar-ae": {
    about: ["عن AbrIT", "إدارة تقنية معلومات متكاملة للمؤسسات", "تجمع AbrIT البنية التحتية والشبكات والأمان والنسخ وبيئة العمل الرقمية والأتمتة ضمن نموذج تشغيل منسق.", ["تقييم الوضع الحالي", "تصميم نطاق واضح", "تنفيذ مرحلي", "إدارة وتحسين مستمر"]],
    contact: ["اتصل بـ AbrIT", "ناقش بيئة تقنية المعلومات في مؤسستك", "تواصل مع AbrIT لبدء التقييم أو تحديد نطاق الخدمة أو مراجعة الباقة المناسبة.", []],
    knowledge: ["المعرفة والموارد", "إرشادات عملية لتقنية المعلومات", "هذا القسم جاهز للمحتوى المعتمد حول البنية التحتية والأمان والنسخ وإدارة تقنية المعلومات.", ["البنية والشبكات", "الأمان والوصول", "النسخ والاستمرارية", "إدارة التقنية"]],
    news: ["الأخبار والإعلام", "مستجدات AbrIT", "ستنشر هنا الأخبار والإعلانات والفعاليات والمواد الإعلامية بعد اعتمادها.", ["الأخبار", "الإعلانات", "الفعاليات", "الإعلام"]],
  },
} as const;

export type PublicPageSlug = keyof typeof content.fa;
export function getPublicPage(locale: Locale, slug: string) { return content[locale][slug as PublicPageSlug]; }

export function GenericPage({ locale, slug, settings }: { locale: Locale; slug: PublicPageSlug; settings: SiteSettings }) {
  const [title, heading, intro, topics] = content[locale][slug];
  return <main className="internal-main"><section className="internal-hero"><div className="container"><span className="internal-eyebrow">ABRIT · {slug.toUpperCase()}</span><h1>{title}</h1><p>{intro}</p></div></section><section className="internal-section"><div className="container generic-layout"><aside><span>01</span><b>AbrIT</b></aside><article><h2>{heading}</h2><p>{intro}</p>{slug === "contact" ? <div className="contact-cards"><a href={`tel:${settings.phone}`}><small>PHONE</small><b dir="ltr">{settings.phone}</b></a><div><small>LOCATION</small><b>{settings.location}</b></div></div> : <div className="topic-grid">{topics.map((topic, index) => <div key={topic}><span>{String(index + 1).padStart(2, "0")}</span><h3>{topic}</h3></div>)}</div>}<Link className="reference-button primary" href={slug === "contact" ? `tel:${settings.phone}` : `/${locale}/services`}>{slug === "contact" ? settings.phone : locale === "fa" ? "مشاهده خدمات" : locale === "en" ? "Explore services" : "عرض الخدمات"}</Link></article></div></section></main>;
}
