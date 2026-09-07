import { createRequire } from "node:module";
import { getPayload, type Payload } from "payload";
import { managedItPackages } from "@/lib/managed-it-packages";
import { contractTerms, featureGroupLabels, managementLevels, productPackages } from "@/lib/product-packages";
import { localizedPackages, pageCopy, services, solutions, staticNavigation, staticSettings } from "@/lib/public-content";
import { normalizeSearchText } from "@/lib/search-normalization";
import { internalCopy } from "@/lib/internal-copy";
import type { Locale } from "@/lib/types";
import type { Content, Form, Navigation } from "@/payload-types";

const { loadEnvConfig } = createRequire(import.meta.url)("@next/env") as typeof import("@next/env");
loadEnvConfig(process.cwd());

const locales: Locale[] = ["fa", "en", "ar-ae"];

type LocalizedPage = Record<Locale, { title: string; heading?: string; excerpt: string; topics?: string[]; eyebrow?: string; pills?: string[] }>;
type ContentSeed = { key: string; kind: Content["kind"]; path: string; slug: string; templateKey: string; translations: LocalizedPage };

const pages: ContentSeed[] = [
  {
    key: "home", kind: "page", path: "", slug: "home", templateKey: "home",
    translations: {
      fa: { title: "ابریت | مدیریت یکپارچه فناوری اطلاعات", excerpt: "خدمات مدیریت‌شده فناوری اطلاعات، امنیت، شبکه، پشتیبان‌گیری، مانیتورینگ و اتوماسیون." },
      en: { title: "AbrIT | Managed IT & IT as a Service", excerpt: "Managed IT, security, networking, backup, monitoring, digital workplace and automation services." },
      "ar-ae": { title: "AbrIT | خدمات تقنية المعلومات المُدارة", excerpt: "خدمات تقنية المعلومات المُدارة والأمن والشبكات والنسخ الاحتياطي والمراقبة والأتمتة." },
    },
  },
  {
    key: "services", kind: "page", path: "services", slug: "services", templateKey: "listing",
    translations: Object.fromEntries(locales.map((locale) => [locale, { title: pageCopy[locale].servicesTitle, excerpt: pageCopy[locale].servicesIntro }])) as LocalizedPage,
  },
  {
    key: "solutions", kind: "page", path: "solutions", slug: "solutions", templateKey: "listing",
    translations: Object.fromEntries(locales.map((locale) => [locale, { title: pageCopy[locale].solutionsTitle, excerpt: pageCopy[locale].solutionsIntro }])) as LocalizedPage,
  },
  {
    key: "products", kind: "page", path: "products", slug: "products", templateKey: "products",
    translations: {
      fa: { title: "پکیج مناسب فناوری اطلاعات سازمان خود را انتخاب کنید", excerpt: "پکیج‌های ابریت براساس تعداد کاربران، اندازه کسب‌وکار و سطح مدیریت موردنیاز طراحی شده‌اند. تعداد کاربران را مشخص کنید، قیمت‌ها را ببینید و خدمات هر سطح را مقایسه کنید.", eyebrow: "پکیج‌های مدیریت فناوری اطلاعات ابریت", pills: ["پیشنهاد براساس تعداد کاربران", "قیمت شفاف هر دوره", "مقایسه روشن خدمات"] },
      en: { title: "Choose the right IT package for your organization", excerpt: "AbrIT packages are designed around your user count, company size and required management level. Set your users, review prices and compare each service level.", eyebrow: "AbrIT managed IT packages", pills: ["User-based recommendation", "Clear term pricing", "Simple service comparison"] },
      "ar-ae": { title: "اختر باقة تقنية المعلومات المناسبة لمؤسستك", excerpt: "صُممت باقات AbrIT وفق عدد المستخدمين وحجم المؤسسة ومستوى الإدارة المطلوب. حدد المستخدمين وراجع الأسعار وقارن الخدمات في كل مستوى.", eyebrow: "باقات إدارة تقنية المعلومات من AbrIT", pills: ["اقتراح حسب عدد المستخدمين", "سعر واضح لكل مدة", "مقارنة بسيطة للخدمات"] },
    },
  },
  {
    key: "pricing", kind: "page", path: "pricing", slug: "pricing", templateKey: "pricing",
    translations: Object.fromEntries(locales.map((locale) => [locale, { title: internalCopy[locale].pricingTitle, excerpt: internalCopy[locale].pricingIntro, eyebrow: internalCopy[locale].pricingEyebrow }])) as LocalizedPage,
  },
  {
    key: "about", kind: "page", path: "about", slug: "about", templateKey: "about",
    translations: {
      fa: { title: "درباره AbrIT", heading: "مدیریت یکپارچه فناوری اطلاعات برای سازمان‌ها", excerpt: "AbrIT خدمات زیرساخت، شبکه، امنیت، پشتیبان‌گیری، فضای کار دیجیتال و اتوماسیون را در یک مدل عملیاتی هماهنگ ارائه می‌کند.", topics: ["ارزیابی وضعیت موجود", "طراحی محدوده روشن", "اجرای مرحله‌ای", "مدیریت و بهبود مستمر"] },
      en: { title: "About AbrIT", heading: "Integrated IT management for organizations", excerpt: "AbrIT brings infrastructure, networking, security, backup, digital workspace and automation into one coordinated operating model.", topics: ["Current-state assessment", "Clear scope design", "Staged implementation", "Continuous management"] },
      "ar-ae": { title: "عن AbrIT", heading: "إدارة تقنية معلومات متكاملة للمؤسسات", excerpt: "تجمع AbrIT البنية التحتية والشبكات والأمان والنسخ وبيئة العمل الرقمية والأتمتة ضمن نموذج تشغيل منسق.", topics: ["تقييم الوضع الحالي", "تصميم نطاق واضح", "تنفيذ مرحلي", "إدارة وتحسين مستمر"] },
    },
  },
  {
    key: "contact", kind: "page", path: "contact", slug: "contact", templateKey: "contact",
    translations: {
      fa: { title: "تماس با AbrIT", heading: "گفت‌وگو درباره وضعیت فناوری اطلاعات سازمان", excerpt: "برای شروع ارزیابی، تعریف محدوده خدمات یا بررسی بسته مناسب می‌توانید با AbrIT تماس بگیرید." },
      en: { title: "Contact AbrIT", heading: "Discuss your organization's IT environment", excerpt: "Contact AbrIT to begin an assessment, define a service scope or review the suitable package." },
      "ar-ae": { title: "اتصل بـ AbrIT", heading: "ناقش بيئة تقنية المعلومات في مؤسستك", excerpt: "تواصل مع AbrIT لبدء التقييم أو تحديد نطاق الخدمة أو مراجعة الباقة المناسبة." },
    },
  },
  ...(["knowledge", "news"] as const).map((key): ContentSeed => ({
    key, kind: "page", path: key, slug: key, templateKey: key,
    translations: {
      fa: key === "knowledge" ? { title: "دانش و منابع", heading: "راهنماهای کاربردی فناوری اطلاعات", excerpt: "محتوای تأییدشده درباره زیرساخت، امنیت، پشتیبان‌گیری و مدیریت فناوری اطلاعات.", topics: ["زیرساخت و شبکه", "امنیت و دسترسی", "پشتیبان‌گیری و تداوم", "مدیریت IT"] } : { title: "اخبار و رسانه", heading: "تازه‌های AbrIT", excerpt: "خبرها، اطلاعیه‌ها، رویدادها و محتوای رسانه‌ای تأییدشده AbrIT.", topics: ["اخبار", "اطلاعیه‌ها", "رویدادها", "رسانه"] },
      en: key === "knowledge" ? { title: "Knowledge & resources", heading: "Practical IT guidance", excerpt: "Approved content about infrastructure, security, backup and IT management.", topics: ["Infrastructure & network", "Security & access", "Backup & continuity", "IT management"] } : { title: "News & media", heading: "Updates from AbrIT", excerpt: "Approved news, announcements, events and media from AbrIT.", topics: ["News", "Announcements", "Events", "Media"] },
      "ar-ae": key === "knowledge" ? { title: "المعرفة والموارد", heading: "إرشادات عملية لتقنية المعلومات", excerpt: "محتوى معتمد حول البنية التحتية والأمان والنسخ وإدارة التقنية.", topics: ["البنية والشبكات", "الأمان والوصول", "النسخ والاستمرارية", "إدارة التقنية"] } : { title: "الأخبار والإعلام", heading: "مستجدات AbrIT", excerpt: "الأخبار والإعلانات والفعاليات والمواد الإعلامية المعتمدة من AbrIT.", topics: ["الأخبار", "الإعلانات", "الفعاليات", "الإعلام"] },
    },
  })),
];

for (const item of services) pages.push({
  key: `service-${item.slug}`, kind: "service", path: `services/${item.slug}`, slug: item.slug, templateKey: "service",
  translations: Object.fromEntries(locales.map((locale) => [locale, { title: item.title[locale], excerpt: item.excerpt[locale] }])) as LocalizedPage,
});
for (const item of solutions) pages.push({
  key: `solution-${item.slug}`, kind: "solution", path: `solutions/${item.slug}`, slug: item.slug, templateKey: "solution",
  translations: Object.fromEntries(locales.map((locale) => [locale, { title: item.title[locale], excerpt: item.excerpt[locale] }])) as LocalizedPage,
});
function layoutFor(page: LocalizedPage[Locale]): NonNullable<Content["layout"]> {
  const content = { heading: page.heading ?? page.title, eyebrow: page.eyebrow ?? "", topics: page.topics ?? [], pills: page.pills ?? [] };
  return [{ blockType: "contentSection", sectionType: "rich_text", variant: "default", enabled: true, content: JSON.parse(JSON.stringify(content)) }];
}

function homeLayout(locale: Locale, page: LocalizedPage[Locale]) {
  const labels = {
    fa: { eyebrow: "ABRIT · مدیریت فناوری اطلاعات", services: "خدمات یکپارچه فناوری اطلاعات", pricing: "بسته‌های خدمات مدیریت‌شده", cta: "برای ارزیابی وضعیت فناوری اطلاعات آماده‌اید؟", action: "درخواست ارزیابی", explore: "مشاهده خدمات" },
    en: { eyebrow: "ABRIT · MANAGED IT", services: "Integrated IT services", pricing: "Managed service packages", cta: "Ready to assess your IT environment?", action: "Request assessment", explore: "Explore services" },
    "ar-ae": { eyebrow: "ABRIT · تقنية المعلومات المُدارة", services: "خدمات تقنية معلومات متكاملة", pricing: "باقات الخدمات المُدارة", cta: "هل أنت مستعد لتقييم بيئة تقنية المعلومات؟", action: "طلب تقييم", explore: "عرض الخدمات" },
  }[locale];
  return [
    { blockType: "contentSection" as const, sectionType: "hero" as const, variant: "dashboard" as const, enabled: true, content: { eyebrow: labels.eyebrow, title: page.title, body: page.excerpt, primary_cta: { label: labels.action, url: `/${locale}/contact` }, secondary_cta: { label: labels.explore, url: `/${locale}/services` }, points: ["24/7", "99.9%", "360°"] } },
    { blockType: "contentSection" as const, sectionType: "service_grid" as const, variant: "bento" as const, enabled: true, content: { title: labels.services } },
    { blockType: "contentSection" as const, sectionType: "pricing" as const, variant: "cards" as const, enabled: true, content: { title: labels.pricing } },
    { blockType: "contentSection" as const, sectionType: "cta" as const, variant: "split" as const, enabled: true, content: { title: labels.cta, body: page.excerpt, primary_cta: { label: labels.action, url: `/${locale}/contact` } } },
  ];
}

async function upsertContent(payload: Payload, seed: ContentSeed) {
  const existing = await payload.find({ collection: "content", limit: 1, overrideAccess: true, where: { key: { equals: seed.key } } });
  let id = existing.docs[0]?.id;
  const preserveExistingHomeLayout = seed.key === "home" && Boolean(id);
  for (const locale of locales) {
    const translated = seed.translations[locale];
    const localizedData = {
      title: translated.title, slug: seed.slug, path: seed.path, excerpt: translated.excerpt,
      translationStatus: "reviewed" as const, workflowStatus: "published" as const, searchText: normalizeSearchText(`${translated.title} ${translated.excerpt}`),
      ...(!preserveExistingHomeLayout ? { layout: seed.key === "home" ? homeLayout(locale, translated) : layoutFor(translated) } : {}),
      seo: { title: translated.title.slice(0, 70), description: translated.excerpt.slice(0, 170), robotsIndex: true, robotsFollow: true },
      _status: "published" as const,
    };
    if (!id) {
      const created = await payload.create({ collection: "content", locale, overrideAccess: true, data: { key: seed.key, kind: seed.kind, templateKey: seed.templateKey, isActive: true, ...localizedData } });
      id = created.id;
    } else {
      await payload.update({ collection: "content", id, locale, overrideAccess: true, data: { key: seed.key, kind: seed.kind, templateKey: seed.templateKey, isActive: true, ...localizedData } });
    }
  }
}

const formDefinitions = [
  {
    key: "consultation",
    fields: [
      ["full_name", "text", true, 2, 120], ["phone", "phone", true, 7, 25], ["email", "email", false, null, 180], ["company", "text", false, null, 160],
      ["company_size", "select", false, null, null, ["1-10", "11-50", "51-200", "201+"]],
      ["need_type", "select", true, null, null, ["assessment", "managed-it", "security", "cloud", "backup", "automation", "other"]],
      ["details", "textarea", true, 10, 2000], ["preferred_contact", "select", false, null, null, ["phone", "email", "whatsapp"]], ["context", "hidden", false],
    ],
  },
  {
    key: "quote-request",
    fields: [["full_name", "text", true, 2, 120], ["phone", "phone", true, 7, 25], ["email", "email", false, null, 180], ["company", "text", false, null, 160], ["users", "number", true, null, null, null, 1, 100000], ["sites", "number", false, null, null, null, 1, 100000], ["details", "textarea", false, null, 2000], ["package", "hidden", false]],
  },
] as const;

async function seedForms(payload: Payload) {
  const messages: Record<Locale, { title: string; success: string; consent: string }> = {
    fa: { title: "درخواست مشاوره", success: "درخواست شما ثبت شد؛ به‌زودی با شما تماس می‌گیریم.", consent: "با نگهداری اطلاعات برای بررسی و پیگیری درخواست موافقم." },
    en: { title: "Consultation request", success: "Your request has been received. We will contact you shortly.", consent: "I agree that the information may be retained to review and follow up my request." },
    "ar-ae": { title: "طلب استشارة", success: "تم استلام طلبك وسنتواصل معك قريباً.", consent: "أوافق على حفظ المعلومات لمراجعة طلبي ومتابعته." },
  };
  for (const definition of formDefinitions) {
    const found = await payload.find({ collection: "forms", limit: 1, overrideAccess: true, where: { key: { equals: definition.key } } });
    let form: Form | undefined = found.docs[0];
    for (const locale of locales) {
      const data = {
        key: definition.key, isActive: true, requiresPrivacyConsent: true, retentionMonths: 12,
        title: messages[locale].title, successMessage: messages[locale].success, consentLabel: messages[locale].consent,
        fields: definition.fields.map((field, index) => ({ key: field[0], fieldType: field[1], required: field[2], minLength: field[3] ?? undefined, maxLength: field[4] ?? undefined, options: field[5] ? [...field[5]] : undefined, minValue: field[6] ?? undefined, maxValue: field[7] ?? undefined, label: field[0], enabled: true, ...(form?.fields?.[index]?.id ? { id: form.fields[index].id } : {}) })),
      };
      if (form) {
        form = await payload.update({ collection: "forms", id: form.id, locale, overrideAccess: true, data });
      } else {
        form = await payload.create({ collection: "forms", locale, overrideAccess: true, data });
      }
    }
  }
}

async function seedGlobals(payload: Payload) {
  await payload.updateGlobal({
    slug: "product-catalog",
    overrideAccess: true,
    data: { catalog: { packages: productPackages, contractTerms, managementLevels, featureGroupLabels } },
  });
  let navigation = await payload.findGlobal({ slug: "navigation", locale: "fa", fallbackLocale: false, depth: 0, overrideAccess: true });
  const preserveRowIDs = (items: NonNullable<Navigation["header"]>, existing: Navigation["header"]) =>
    items.map((item, index) => ({
      ...item,
      ...(existing?.[index]?.id ? { id: existing[index].id } : {}),
      ...(item.children ? { children: item.children.map((child, childIndex) => ({ ...child, ...(existing?.[index]?.children?.[childIndex]?.id ? { id: existing[index].children![childIndex].id } : {}) })) } : {}),
    }));
  for (const locale of locales) {
    const settings = staticSettings(locale);
    await payload.updateGlobal({ slug: "site-settings", locale, overrideAccess: true, data: { brandName: settings.brand_name, phone: settings.phone, email: settings.email || undefined, customerPortalURL: settings.customer_portal_url, locationLabel: settings.location, address: settings.address, defaultSEOTitle: settings.seo.title, defaultSEODescription: settings.seo.description } });
    const items: NonNullable<Navigation["header"]> = staticNavigation(locale).map((item) => ({
      title: item.title, description: item.description, path: item.url.replace(new RegExp(`^/${locale}/?`), ""), enabled: true, openInNewTab: item.open_in_new_tab,
      children: item.url.endsWith("/solutions") ? solutions.map((solution) => ({ title: solution.title[locale], description: solution.excerpt[locale], path: `solutions/${solution.slug}`, enabled: true })) : [],
    }));
    navigation = await payload.updateGlobal({
      slug: "navigation",
      locale,
      overrideAccess: true,
      data: {
        header: preserveRowIDs(items, navigation.header),
        footer: preserveRowIDs(items, navigation.footer),
        mobile: preserveRowIDs(items, navigation.mobile),
      },
    });
  }
}

async function seedPackages(payload: Payload) {
  const termRules = { 3: { discountBps: 300, onboardingBps: 5000 }, 6: { discountBps: 500, onboardingBps: 2500 }, 12: { discountBps: 800, onboardingBps: 0 } } as const;
  for (const managed of managedItPackages) {
    const existing = await payload.find({ collection: "packages", limit: 1, overrideAccess: true, where: { key: { equals: managed.key } } });
    let id = existing.docs[0]?.id;
    for (const locale of locales) {
      const current = localizedPackages(locale).find((item) => item.key === managed.key);
      if (!current) continue;
      const data = {
        key: managed.key, order: managed.order, name: managed.name[locale], caption: managed.caption[locale], baseMonthlyToman: current.base_monthly_toman,
        includedUsers: current.included_users, maxExtraUsers: managed.maxExtraUsers, includedEndpoints: current.included_endpoints,
        includedServers: current.included_servers, includedSites: current.included_sites, extraUserMonthlyToman: current.addon_rates.user,
        extraEndpointMonthlyToman: current.addon_rates.endpoint, currency: "IRT", isFeatured: current.is_featured, isActive: true,
        termPrices: Object.entries(managed.pricing).map(([cycle, totalToman]) => {
          const months = cycle === "quarterly" ? 3 : cycle === "semiannually" ? 6 : 12;
          return { cycle: cycle as "quarterly" | "semiannually" | "annually", months, totalToman, ...termRules[months] };
        }),
        features: [{ key: "sla", label: "SLA", value: current.sla, included: true }],
        whmcsProductId: managed.whmcs.productId ?? undefined, whmcsExtraUserOptionId: managed.whmcs.extraUserOptionId ?? undefined, whmcsExtraEndpointOptionId: managed.whmcs.extraEndpointOptionId ?? undefined,
      };
      const saved = id
        ? await payload.update({ collection: "packages", id, locale, overrideAccess: true, data })
        : await payload.create({ collection: "packages", locale, overrideAccess: true, data });
      id = saved.id;
    }
  }
}

async function main() {
  if (!process.env.DATABASE_URI || !process.env.PAYLOAD_SECRET) throw new Error("DATABASE_URI and PAYLOAD_SECRET are required.");
  const { default: config } = await import("@payload-config");
  const payload = await getPayload({ config });
  const adminEmail = process.env.PAYLOAD_ADMIN_EMAIL;
  const adminPassword = process.env.PAYLOAD_ADMIN_PASSWORD;
  if (adminEmail && adminPassword) {
    const users = await payload.find({ collection: "users", limit: 1, overrideAccess: true, where: { email: { equals: adminEmail } } });
    if (!users.docs.length) await payload.create({ collection: "users", overrideAccess: true, draft: false, data: { email: adminEmail, password: adminPassword, name: "AbrIT Administrator", role: "admin" } });
  }
  for (const page of pages) await upsertContent(payload, page);
  await Promise.all([seedGlobals(payload), seedPackages(payload), seedForms(payload)]);
  payload.logger.info(`Seed complete: ${pages.length} content items, ${managedItPackages.length} packages, ${formDefinitions.length} forms.`);
  process.exit(0);
}

await main();
