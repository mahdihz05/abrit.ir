import path from "node:path";
import config from "@payload-config";
import { getPayload, type Payload } from "payload";
import { normalizeSearchText } from "@/lib/search-normalization";
import type { Content, Form, User } from "@/payload-types";
import type { Locale } from "@/lib/types";

const locales: Locale[] = ["fa", "en", "ar-ae"];
type Layout = NonNullable<Content["layout"]>;

const copy = {
  fa: {
    title: "ارزیابی آمادگی فناوری اطلاعات سازمان",
    excerpt: "یک صفحهٔ کامل آزمایشی برای بررسی و ویرایش بلوک‌های Payload، سئو و فرایند انتشار.",
    eyebrow: "نمونهٔ قابل ویرایش",
    intro: "در کمتر از یک جلسه، وضعیت زیرساخت، امنیت، پشتیبان‌گیری و عملیات فناوری اطلاعات را مرور کنید.",
    features: [
      ["زیرساخت", "ظرفیت، سلامت سرویس‌ها و نقاط شکست بررسی می‌شوند."],
      ["امنیت", "دسترسی‌ها، به‌روزرسانی و پوشش ابزارهای حفاظتی مرور می‌شوند."],
      ["تداوم", "نسخه‌های پشتیبان و آمادگی بازیابی با سناریوی واقعی سنجیده می‌شوند."],
    ],
    faq: [["این ارزیابی چقدر زمان می‌برد؟", "ارزیابی اولیه معمولاً در یک جلسه انجام می‌شود و خروجی آن به‌صورت اولویت‌بندی‌شده ارائه می‌گردد."], ["آیا نیاز به تغییر فوری زیرساخت است؟", "خیر؛ ابتدا وضعیت فعلی مستند می‌شود و هر تغییر فقط پس از تأیید دامنه انجام خواهد شد."]],
    cta: "برای شروع ارزیابی آماده‌اید؟",
    action: "درخواست مشاوره",
  },
  en: {
    title: "IT readiness assessment",
    excerpt: "A complete demo page for testing Payload blocks, SEO and publishing workflows.",
    eyebrow: "Editable demo",
    intro: "Review infrastructure, security, backup and IT operations in one focused session.",
    features: [["Infrastructure", "Review capacity, service health and single points of failure."], ["Security", "Review access, patching and protective coverage."], ["Continuity", "Validate backups and recovery readiness against real scenarios."]],
    faq: [["How long does the assessment take?", "The initial assessment normally takes one session and produces a prioritized output."], ["Do we need to change infrastructure immediately?", "No. The current state is documented first and every change requires an approved scope."]],
    cta: "Ready to start the assessment?",
    action: "Request consultation",
  },
  "ar-ae": {
    title: "تقييم جاهزية تقنية المعلومات",
    excerpt: "صفحة تجريبية كاملة لاختبار كتل Payload وتحسين محركات البحث وسير النشر.",
    eyebrow: "نموذج قابل للتحرير",
    intro: "راجع البنية التحتية والأمان والنسخ الاحتياطي والعمليات في جلسة مركزة.",
    features: [["البنية التحتية", "مراجعة السعة وصحة الخدمات ونقاط الفشل."], ["الأمان", "مراجعة الوصول والتحديثات والتغطية الوقائية."], ["الاستمرارية", "التحقق من النسخ الاحتياطية والاستعداد للاستعادة."]],
    faq: [["كم يستغرق التقييم؟", "يستغرق التقييم الأولي عادة جلسة واحدة وينتج قائمة أولويات."], ["هل نحتاج إلى تغيير فوري؟", "لا، يتم توثيق الوضع الحالي أولاً ولا ينفذ أي تغيير دون نطاق معتمد."]],
    cta: "هل أنت مستعد لبدء التقييم؟",
    action: "طلب استشارة",
  },
} as const;

function readinessLayout(locale: Locale): Layout {
  const value = copy[locale];
  return [
    {
      blockType: "hero", enabled: true, variant: "split", eyebrow: value.eyebrow, title: value.title,
      highlight: locale === "en" ? "readiness" : locale === "fa" ? "آمادگی" : "جاهزية", body: value.intro,
      primaryCTA: { label: value.action, url: `/${locale}/contact`, openInNewTab: false },
      secondaryCTA: { label: locale === "en" ? "View services" : locale === "fa" ? "مشاهده خدمات" : "عرض الخدمات", url: `/${locale}/services`, openInNewTab: false },
      points: ["24/7", "99.9%", "360°"].map((text) => ({ text })),
    },
    {
      blockType: "featureGrid", enabled: true, variant: "cards", eyebrow: value.eyebrow, heading: value.title, intro: value.excerpt,
      items: value.features.map(([title, description], index) => ({ icon: ["network", "shield", "backup"][index], title, description })),
    },
    { blockType: "faq", enabled: true, variant: "simple", heading: locale === "en" ? "Frequently asked questions" : locale === "fa" ? "پرسش‌های متداول" : "الأسئلة الشائعة", items: value.faq.map(([question, answer]) => ({ question, answer })) },
    { blockType: "cta", enabled: true, variant: "split", eyebrow: "AbrIT", title: value.cta, body: value.excerpt, primaryCTA: { label: value.action, url: `/${locale}/contact`, openInNewTab: false } },
  ];
}

async function seedDemoPage(payload: Payload) {
  const found = await payload.find({ collection: "content", limit: 1, overrideAccess: true, where: { key: { equals: "demo-it-readiness" } } });
  let id = found.docs[0]?.id;
  for (const locale of locales) {
    const value = copy[locale];
    const data = {
      key: "demo-it-readiness", kind: "page" as const, templateKey: "blocks", isActive: true,
      title: value.title, slug: "it-readiness", path: "it-readiness", excerpt: value.excerpt,
      translationStatus: "reviewed" as const, workflowStatus: "published" as const,
      searchText: normalizeSearchText(`${value.title} ${value.excerpt}`), layout: readinessLayout(locale),
      seo: { title: value.title.slice(0, 70), description: value.excerpt.slice(0, 170), robotsIndex: true, robotsFollow: true },
      _status: "published" as const,
    };
    const saved = id
      ? await payload.update({ collection: "content", id, locale, overrideAccess: true, data })
      : await payload.create({ collection: "content", locale, overrideAccess: true, data });
    id = saved.id;
  }

  const draft = await payload.find({ collection: "content", limit: 1, overrideAccess: true, where: { key: { equals: "demo-security-draft" } } });
  const draftData = {
    key: "demo-security-draft", kind: "knowledge" as const, templateKey: "blocks", isActive: true,
    title: "چک‌لیست امنیتی در حال بازبینی", slug: "security-checklist-draft", path: "security-checklist-draft",
    excerpt: "نمونهٔ پیش‌نویس برای آزمایش Autosave، نسخه‌ها و انتشار در Payload.", translationStatus: "draft" as const,
    workflowStatus: "review" as const, searchText: normalizeSearchText("چک لیست امنیتی پیش نویس"),
    layout: [{ blockType: "faq" as const, enabled: true, variant: "simple" as const, heading: "موارد بازبینی", items: [{ question: "آیا MFA فعال است؟", answer: "دسترسی‌های مدیریتی باید احراز هویت چندمرحله‌ای داشته باشند." }] }],
    seo: { robotsIndex: false, robotsFollow: false }, _status: "draft" as const,
  };
  if (draft.docs[0]) await payload.update({ collection: "content", id: draft.docs[0].id, locale: "fa", draft: true, overrideAccess: true, data: draftData });
  else await payload.create({ collection: "content", locale: "fa", draft: true, overrideAccess: true, data: draftData });
}

async function seedMedia(payload: Payload) {
  const media = [
    ["demo-globe", "abrit-reference-globe.jpg", "نمای زیرساخت ابری AbrIT"],
    ["demo-brand", "abrit-reference-brand.png", "هویت بصری AbrIT"],
  ] as const;
  for (const [legacyID, filename, alt] of media) {
    const found = await payload.find({ collection: "media", limit: 1, overrideAccess: true, where: { or: [{ legacyID: { equals: legacyID } }, { filename: { equals: filename } }] } });
    if (found.docs[0]) {
      if (found.docs[0].legacyID) await payload.update({ collection: "media", id: found.docs[0].id, overrideAccess: true, data: { legacyID: null } });
    } else {
      await payload.create({ collection: "media", overrideAccess: true, filePath: path.resolve(process.cwd(), "public", filename), data: { isPublic: true, alt, title: alt } });
    }
  }
}

async function seedSubmissions(payload: Payload) {
  const formResult = await payload.find({ collection: "forms", limit: 1, overrideAccess: true, where: { key: { equals: "consultation" } } });
  const form = formResult.docs[0] as Form | undefined;
  if (!form) throw new Error("Run npm run seed before npm run seed:demo so the consultation form exists.");
  const users = await payload.find({ collection: "users", limit: 1, overrideAccess: true });
  const assignee = users.docs[0] as User | undefined;
  const statuses = ["new", "new", "contacted", "qualified", "closed", "contacted", "qualified", "new"] as const;
  const priorities = ["urgent", "high", "normal", "normal", "low", "high", "normal", "low"] as const;
  for (let index = 0; index < statuses.length; index += 1) {
    const legacyID = `demo-submission-${index + 1}`;
    const email = `lead${index + 1}@example.test`;
    const found = await payload.find({ collection: "form-submissions", limit: 1, overrideAccess: true, where: { or: [{ legacyID: { equals: legacyID } }, { contactEmail: { equals: email } }] } });
    if (found.docs[0]) {
      if (found.docs[0].legacyID) await payload.update({ collection: "form-submissions", id: found.docs[0].id, overrideAccess: true, data: { legacyID: null } });
      continue;
    }
    const data = {
      form: form.id, locale: (index % 3 === 0 ? "en" : "fa") as Locale,
      data: { full_name: `مخاطب آزمایشی ${index + 1}`, phone: `0912000000${index}`, email, company: `شرکت نمونه ${index + 1}`, need_type: index % 2 ? "managed-it" : "security", details: "این رکورد فقط برای آزمایش صندوق ورودی پنل ایجاد شده است." },
      status: statuses[index], priority: priorities[index], assignedTo: assignee?.id,
      sourceURL: "/fa/contact", consentGiven: true, consentText: "رضایت آزمایشی", ipHash: `demo-hash-${index + 1}`,
      expiresAt: new Date(Date.now() + 365 * 86_400_000).toISOString(), internalNotes: index === 0 ? "برای تست در اولویت بررسی شود." : undefined,
    };
    await payload.create({ collection: "form-submissions", overrideAccess: true, data });
  }
}

async function main() {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) throw new Error("DATABASE_URI and PAYLOAD_SECRET are required.");
  const payload = await getPayload({ config });
  await seedDemoPage(payload);
  await seedMedia(payload);
  await seedSubmissions(payload);
  payload.logger.info("Demo seed complete: editable landing page, draft, media and 8 sample submissions.");
  process.exit(0);
}

await main();
