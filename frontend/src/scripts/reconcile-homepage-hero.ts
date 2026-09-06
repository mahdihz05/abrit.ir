import { createRequire } from "node:module";
import { getPayload } from "payload";
import type { Locale } from "@/lib/types";

const { loadEnvConfig } = createRequire(import.meta.url)("@next/env") as typeof import("@next/env");
loadEnvConfig(process.cwd());

const checkOnly = process.argv.includes("--check");
const locales: Locale[] = ["fa", "en", "ar-ae"];
const copy = {
  fa: [
    { eyebrow: "یک شریک برای تمام مسیر فناوری اطلاعات شما", title: "فناوری اطلاعات شرکت شما، یکپارچه و تحت مدیریت", highlight: "یکپارچه", body: "ابریت فناوری اطلاعات سازمان شما را از مجموعه‌ای پراکنده از سیستم‌ها، کاربران و سرویس‌ها، به یک زیرساخت یکپارچه، امن، پایدار و پاسخ‌گو تبدیل می‌کند. از مدیریت کاربران و شبکه تا پشتیبانی، امنیت، بکاپ، مانیتورینگ و اتوماسیون؛ همه‌چیز در قالب یک سرویس مدیریت‌شده و متناسب با نیاز کسب‌وکار شما.", primary: "درخواست ارزیابی IT", secondary: "مشاهده خدمات", points: ["مدیریت یکپارچه", "پایش و پاسخ‌گویی", "امنیت و بکاپ"] },
    { eyebrow: "تفاوت Abrit", title: "بیشتر از پشتیبانی؛ مدیریت فناوری اطلاعات", highlight: "مدیریت فناوری اطلاعات", body: "مدل Abrit بر حل موردی مشکلات متکی نیست. هدف این است که IT سازمان قابل مشاهده، مستند، قابل کنترل و قابل توسعه باشد. Monitoring، Ticketing، Documentation، Backup، Security و Automation در کنار پشتیبانی فنی قرار می‌گیرند تا فناوری اطلاعات به یک سرویس مدیریتی واقعی تبدیل شود.", primary: "شناخت مدل مدیریت", secondary: "راهکارهای ابریت", points: ["یکپارچگی به‌جای پراکندگی", "پیشگیری به‌جای واکنش صرف", "اتوماسیون به‌جای کار تکراری"] },
  ],
  en: [
    { eyebrow: "One partner across your entire IT journey", title: "Your company IT, unified and managed", highlight: "unified", body: "Abrit turns a fragmented mix of systems, users and services into an integrated, secure, stable and responsive IT environment. From user and network management to support, security, backup, monitoring and automation, everything is delivered through a managed service aligned with your business needs.", primary: "Request IT Assessment", secondary: "Explore Services", points: ["Unified management", "Monitoring & response", "Security & backup"] },
    { eyebrow: "The Abrit difference", title: "Beyond support: managed information technology", highlight: "managed information technology", body: "Abrit is not built around fixing isolated incidents. The goal is to make organizational IT visible, documented, controllable and ready to evolve. Monitoring, Ticketing, Documentation, Backup, Security and Automation work alongside technical support to turn IT into a real managed service.", primary: "Discover the Model", secondary: "Explore Solutions", points: ["Integration over fragmentation", "Prevention over reaction", "Automation over repetitive work"] },
  ],
  "ar-ae": [
    { eyebrow: "شريك واحد في كامل رحلة تقنية المعلومات", title: "تقنية المعلومات في شركتك، موحّدة وتحت الإدارة", highlight: "موحّدة", body: "تحوّل Abrit بيئة تقنية المعلومات من مجموعة متفرقة من الأنظمة والمستخدمين والخدمات إلى بنية متكاملة وآمنة ومستقرة وسريعة الاستجابة. من إدارة المستخدمين والشبكات إلى الدعم والأمن والنسخ الاحتياطي والمراقبة والأتمتة، تُقدَّم جميعها ضمن خدمة مُدارة تتوافق مع احتياجات أعمالك.", primary: "طلب تقييم تقنية المعلومات", secondary: "استعراض الخدمات", points: ["إدارة متكاملة", "مراقبة واستجابة", "أمن ونسخ احتياطي"] },
    { eyebrow: "ما يميز Abrit", title: "أكثر من الدعم؛ إدارة حقيقية لتقنية المعلومات", highlight: "إدارة حقيقية لتقنية المعلومات", body: "لا يعتمد نموذج Abrit على معالجة المشكلات بصورة منفصلة. الهدف هو جعل تقنية المعلومات في المؤسسة واضحة وموثقة وقابلة للتحكم والتطوير. تعمل المراقبة والتذاكر والتوثيق والنسخ الاحتياطي والأمن والأتمتة إلى جانب الدعم الفني لتحويل تقنية المعلومات إلى خدمة مُدارة فعلية.", primary: "تعرّف إلى نموذج الإدارة", secondary: "استعراض الحلول", points: ["التكامل بدل التشتت", "الوقاية بدل رد الفعل", "الأتمتة بدل العمل المتكرر"] },
  ],
} as const;

function heroes(locale: Locale) {
  return copy[locale].map((item, index) => ({
    blockType: "hero" as const,
    enabled: true,
    variant: "dashboard" as const,
    eyebrow: item.eyebrow,
    title: item.title,
    highlight: item.highlight,
    body: item.body,
    primaryCTA: { label: item.primary, url: index === 0 ? `/${locale}/contact` : `/${locale}/about`, openInNewTab: false },
    secondaryCTA: { label: item.secondary, url: index === 0 ? `/${locale}/services` : `/${locale}/solutions`, openInNewTab: false },
    points: item.points.map((text) => ({ text })),
  }));
}

function normalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(normalize);
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value as Record<string, unknown>)
    .filter(([key, item]) => item != null && key !== "id" && key !== "blockName")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, item]) => [key, normalize(item)]));
}

async function main() {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) throw new Error("DATABASE_URI and PAYLOAD_SECRET are required.");
  const { default: config } = await import("@payload-config");
  const payload = await getPayload({ config });
  for (const locale of locales) {
    const result = await payload.find({ collection: "content", locale, fallbackLocale: false, depth: 0, draft: true, limit: 2, overrideAccess: true, where: { key: { equals: "home" } } });
    const home = result.docs[0];
    if (!home || result.docs.length !== 1) throw new Error(`Expected one home document for ${locale}.`);
    const expected = heroes(locale);
    const existing = home.layout?.filter((block) => block.blockType === "hero") ?? [];
    if (existing.length && JSON.stringify(normalize(existing)) !== JSON.stringify(normalize(expected))) throw new Error(`Seed conflict for home/${locale}: existing HeroBlocks differ.`);
    if (checkOnly && existing.length !== expected.length) throw new Error(`HeroBlocks missing for home/${locale}; run without --check.`);
    if (!checkOnly && !existing.length) await payload.update({ collection: "content", id: home.id, locale, overrideAccess: true, data: { layout: [...(home.layout ?? []), ...expected] } as never });
  }
  payload.logger.info(`Homepage Hero reconciliation ${checkOnly ? "check" : "complete"}: 3 locale projections.`);
  process.exit(0);
}

await main();
