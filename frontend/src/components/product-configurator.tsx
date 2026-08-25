"use client";

import { useMemo, useState, type ReactNode } from "react";
import styles from "./product-configurator.module.css";
import {
  calculateProductPrice,
  buildProductCheckoutUrl,
  contractTerms,
  featureGroupLabels,
  productPackages,
  type ContractTerm,
  type FeatureGroupKey,
  type InfrastructureNodeKey,
  type ProductPackage,
  type ProductPackageKey,
} from "@/lib/product-packages";
import type { Locale } from "@/lib/types";

type UiCopy = {
  selectorEyebrow: string; selectorTitle: string; selectorText: string; users: string; usersValue: (value: string) => string; contract: string;
  recommended: string; recommendedFor: (value: string) => string; plansEyebrow: string; plansTitle: string; plansText: string;
  priceForTerm: string; toman: string; capacity: (value: string) => string; extraCapacity: (base: string, extra: string) => string; cloud: (value: string) => string; noCloud: string;
  selectPlan: string; selectedPlan: string; infrastructureEyebrow: string; infrastructureTitle: string; infrastructureText: string;
  quickSwitch: string; quickSwitchHint: string; active: string; inactive: string; comparisonEyebrow: string; comparisonTitle: string;
  comparisonText: string; showFull: string; showLess: string; feature: string; compareCapacity: string; userSupport: string;
  directory: string; vpn: string; monitoring: string; managedServer: string; cloudStorage: string; onsite: string; backup: string;
  sla: string; included: string; notIncluded: string; serverCount: (value: string) => string; detailsEyebrow: string; detailsTitle: string;
  detailsText: string; summary: string; estimatedTotal: string; quote: string; quoteHint: string; cta: string; priceHint: string;
  extraUsers: string; extraUsersRange: (value: string) => string; decreaseExtraUsers: string; increaseExtraUsers: string;
};

const copy: Record<Locale, UiCopy> = {
  fa: {
    selectorEyebrow: "انتخاب سریع پکیج", selectorTitle: "ابتدا تعداد کاربران و دوره قرارداد را مشخص کنید", selectorText: "با تغییر تعداد کاربران، مناسب‌ترین پکیج ابریت به‌صورت خودکار مشخص می‌شود. انتخاب نهایی همچنان با شماست.",
    users: "تعداد کاربران", usersValue: (value) => `${value} کاربر`, contract: "دوره قرارداد", recommended: "پیشنهاد ابریت", recommendedFor: (value) => `مناسب برای ${value} کاربر`,
    plansEyebrow: "پکیج‌های مدیریت فناوری اطلاعات", plansTitle: "پکیج مناسب سازمان خود را انتخاب کنید", plansText: "قیمت و مهم‌ترین خدمات هر سطح را کنار هم ببینید. برای مشاهده دامنه کامل خدمات، بخش جزئیات پایین صفحه در دسترس است.",
    priceForTerm: "مبلغ ماهانه", toman: "تومان", capacity: (value) => `تا ${value} کاربر`, extraCapacity: (base, extra) => `${base} کاربر پایه + تا ${extra} کاربر اضافه`, cloud: (value) => `${value} گیگابایت فضای ابری`, noCloud: "بدون فضای ابری", selectPlan: "انتخاب پکیج", selectedPlan: "پکیج انتخاب‌شده",
    infrastructureEyebrow: "پیش‌نمایش پوشش زیرساخت", infrastructureTitle: "ببینید چه بخش‌هایی از سازمان تحت مدیریت قرار می‌گیرند", infrastructureText: "این نما فقط برای درک سریع دامنه پوشش است. پکیج را از نوار بالا انتخاب کنید تا اجزای فعال همان‌جا نمایش داده شوند.",
    quickSwitch: "مقایسه سریع پکیج‌ها", quickSwitchHint: "یک پکیج را انتخاب کنید؛ نتیجه همین‌جا تغییر می‌کند.", active: "فعال", inactive: "در سطح‌های بالاتر",
    comparisonEyebrow: "مقایسه امکانات کلیدی", comparisonTitle: "تفاوت پکیج‌ها را سریع مقایسه کنید", comparisonText: "ابتدا مهم‌ترین تفاوت‌ها نمایش داده شده‌اند تا جدول ساده و قابل اسکن باقی بماند.", showFull: "مشاهده مقایسه کامل", showLess: "نمایش مقایسه کوتاه",
    feature: "امکانات", compareCapacity: "حداکثر کاربران", userSupport: "پشتیبانی کاربران", directory: "اکتیودایرکتوری", vpn: "وی‌پی‌ان", monitoring: "پایش زیرساخت", managedServer: "سرور مدیریت‌شده", cloudStorage: "فضای ابری", onsite: "پشتیبانی حضوری", backup: "پشتیبان‌گیری و بازیابی", sla: "زمان پاسخ بحرانی", included: "شامل", notIncluded: "—", serverCount: (value) => `${value} سرور`,
    detailsEyebrow: "جزئیات خدمات", detailsTitle: "دامنه کامل پکیج انتخابی را بررسی کنید", detailsText: "اطلاعات هر پکیج در گروه‌های مشخص قرار گرفته است؛ فقط بخشی را که نیاز دارید باز کنید.", summary: "خلاصه انتخاب شما", estimatedTotal: "مبلغ برآوردی قرارداد", quote: "نیازمند استعلام اختصاصی", quoteHint: "تعداد کاربران از ظرفیت قابل افزایش این پکیج بیشتر است.", cta: "ادامه در سبد خرید", priceHint: "مبلغ انتخاب‌شده با همین تعداد کاربر اضافه در سبد خرید ثبت می‌شود.",
    extraUsers: "کاربر اضافه", extraUsersRange: (value) => `از صفر تا ${value} نفر`, decreaseExtraUsers: "کم‌کردن کاربر اضافه", increaseExtraUsers: "افزودن کاربر اضافه",
  },
  en: {
    selectorEyebrow: "Quick package selection", selectorTitle: "Start with your user count and contract term", selectorText: "The closest AbrIT package is recommended automatically as the user count changes. You can still choose any package.",
    users: "Number of users", usersValue: (value) => `${value} users`, contract: "Contract term", recommended: "AbrIT recommendation", recommendedFor: (value) => `Suitable for ${value} users`,
    plansEyebrow: "Managed IT packages", plansTitle: "Choose the right package for your organization", plansText: "Compare prices and the most important services. The complete scope is available in the details section below.",
    priceForTerm: "Monthly price", toman: "toman", capacity: (value) => `Up to ${value} users`, extraCapacity: (base, extra) => `${base} included + up to ${extra} extra users`, cloud: (value) => `${value} GB cloud storage`, noCloud: "No cloud storage", selectPlan: "Choose package", selectedPlan: "Selected package",
    infrastructureEyebrow: "Infrastructure coverage preview", infrastructureTitle: "See which parts of your organization become managed", infrastructureText: "This view is only a quick coverage aid. Choose a package above it to update the active components in place.",
    quickSwitch: "Quick package comparison", quickSwitchHint: "Choose a package and see the result update here.", active: "Active", inactive: "Available at higher levels",
    comparisonEyebrow: "Key feature comparison", comparisonTitle: "Compare package differences quickly", comparisonText: "Only the most important differences are shown first so the table stays easy to scan.", showFull: "View full comparison", showLess: "Show compact comparison",
    feature: "Feature", compareCapacity: "Maximum users", userSupport: "User support", directory: "Active Directory", vpn: "VPN", monitoring: "Infrastructure monitoring", managedServer: "Managed server", cloudStorage: "Cloud storage", onsite: "On-site support", backup: "Backup & recovery", sla: "Critical response", included: "Included", notIncluded: "—", serverCount: (value) => `${value} server${value === "1" ? "" : "s"}`,
    detailsEyebrow: "Service details", detailsTitle: "Review the complete selected package scope", detailsText: "Services are organized into clear groups. Open only the section you need.", summary: "Your selection summary", estimatedTotal: "Estimated contract total", quote: "Custom quote required", quoteHint: "The user count exceeds this package's supported extension range.", cta: "Continue to cart", priceHint: "The selected amount and extra-user count are passed directly to the cart.",
    extraUsers: "Extra users", extraUsersRange: (value) => `0 to ${value}`, decreaseExtraUsers: "Remove one extra user", increaseExtraUsers: "Add one extra user",
  },
  "ar-ae": {
    selectorEyebrow: "اختيار سريع للباقة", selectorTitle: "ابدأ بعدد المستخدمين ومدة العقد", selectorText: "يتم اقتراح باقة AbrIT الأقرب تلقائياً عند تغيير عدد المستخدمين، مع بقاء حرية اختيار أي باقة.",
    users: "عدد المستخدمين", usersValue: (value) => `${value} مستخدمين`, contract: "مدة العقد", recommended: "اقتراح AbrIT", recommendedFor: (value) => `مناسبة لـ ${value} مستخدمين`,
    plansEyebrow: "باقات إدارة تقنية المعلومات", plansTitle: "اختر الباقة المناسبة لمؤسستك", plansText: "قارن الأسعار وأهم الخدمات. يتوفر النطاق الكامل في قسم التفاصيل أدناه.",
    priceForTerm: "السعر الشهري", toman: "تومان", capacity: (value) => `حتى ${value} مستخدماً`, extraCapacity: (base, extra) => `${base} مستخدمين أساسيين + حتى ${extra} إضافيين`, cloud: (value) => `${value} جيجابايت تخزين سحابي`, noCloud: "دون تخزين سحابي", selectPlan: "اختيار الباقة", selectedPlan: "الباقة المختارة",
    infrastructureEyebrow: "معاينة تغطية البنية التحتية", infrastructureTitle: "شاهد أجزاء المؤسسة التي تصبح تحت الإدارة", infrastructureText: "هذه المعاينة وسيلة مساعدة سريعة فقط. اختر باقة من الشريط لتحديث المكونات النشطة مباشرة.",
    quickSwitch: "مقارنة سريعة للباقات", quickSwitchHint: "اختر باقة وشاهد النتيجة تتغير هنا.", active: "فعال", inactive: "متاح في مستوى أعلى",
    comparisonEyebrow: "مقارنة الميزات الرئيسية", comparisonTitle: "قارن الفروق بين الباقات بسرعة", comparisonText: "تظهر الفروق الأهم أولاً لتبقى المقارنة سهلة القراءة.", showFull: "عرض المقارنة الكاملة", showLess: "عرض المقارنة المختصرة",
    feature: "الميزة", compareCapacity: "الحد الأقصى للمستخدمين", userSupport: "دعم المستخدمين", directory: "Active Directory", vpn: "VPN", monitoring: "مراقبة البنية التحتية", managedServer: "خادم مُدار", cloudStorage: "التخزين السحابي", onsite: "الدعم الميداني", backup: "النسخ والاستعادة", sla: "الاستجابة الحرجة", included: "مشمول", notIncluded: "—", serverCount: (value) => `${value} خادم`,
    detailsEyebrow: "تفاصيل الخدمات", detailsTitle: "راجع النطاق الكامل للباقة المختارة", detailsText: "تم تنظيم الخدمات في مجموعات واضحة؛ افتح القسم الذي تحتاجه فقط.", summary: "ملخص اختيارك", estimatedTotal: "إجمالي العقد التقديري", quote: "يتطلب عرض سعر خاصاً", quoteHint: "يتجاوز عدد المستخدمين نطاق التمديد المدعوم لهذه الباقة.", cta: "المتابعة إلى السلة", priceHint: "يتم تمرير المبلغ وعدد المستخدمين الإضافيين مباشرة إلى السلة.",
    extraUsers: "مستخدمون إضافيون", extraUsersRange: (value) => `من 0 إلى ${value}`, decreaseExtraUsers: "تقليل مستخدم إضافي", increaseExtraUsers: "إضافة مستخدم إضافي",
  },
};

const infrastructureLabels: Record<InfrastructureNodeKey, Record<Locale, string>> = {
  internet: { fa: "اینترنت", en: "Internet", "ar-ae": "الإنترنت" }, network: { fa: "شبکه سازمان", en: "Office network", "ar-ae": "شبكة المؤسسة" }, users: { fa: "کاربران", en: "Users", "ar-ae": "المستخدمون" },
  firewall: { fa: "فایروال", en: "Firewall", "ar-ae": "جدار الحماية" }, antivirus: { fa: "آنتی‌ویروس", en: "Antivirus", "ar-ae": "مكافحة الفيروسات" }, directory: { fa: "اکتیودایرکتوری", en: "Active Directory", "ar-ae": "Active Directory" },
  vpn: { fa: "وی‌پی‌ان", en: "VPN", "ar-ae": "VPN" }, monitoring: { fa: "پایش", en: "Monitoring", "ar-ae": "المراقبة" }, server: { fa: "سرور مدیریت‌شده", en: "Managed server", "ar-ae": "خادم مُدار" },
  cloud: { fa: "فضای ابری", en: "Cloud storage", "ar-ae": "التخزين السحابي" }, backup: { fa: "پشتیبان‌گیری", en: "Backup & recovery", "ar-ae": "النسخ والاستعادة" },
};
const infrastructureNodes = Object.keys(infrastructureLabels) as InfrastructureNodeKey[];
const detailGroups: FeatureGroupKey[] = ["software", "network", "security", "cloud", "capacity"];

function SectionHeading({ eyebrow, title, text, id }: { eyebrow: string; title: string; text: string; id: string }) {
  return <header className={styles.sectionHeading}><span>{eyebrow}</span><h2 id={id}>{title}</h2><p>{text}</p></header>;
}

function InfraIcon({ node }: { node: InfrastructureNodeKey }) {
  const glyphs: Record<InfrastructureNodeKey, ReactNode> = {
    internet: <><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4c2.4 2.2 3.4 4.9 3.4 8S14.4 17.8 12 20c-2.4-2.2-3.4-4.9-3.4-8S9.6 6.2 12 4Z" /></>, network: <><rect x="4" y="5" width="16" height="10" rx="2" /><path d="M8 19h8M12 15v4M8 10h.01M12 10h.01M16 10h.01" /></>, users: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="10" r="2" /><path d="M3.5 19c.6-3.6 2.4-5.4 5.5-5.4s4.9 1.8 5.5 5.4M15 14.5c2.8.1 4.5 1.6 5 4.5" /></>,
    firewall: <><path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z" /><path d="M8 10h8M10 7v6M14 10v5" /></>, antivirus: <><path d="M12 3 5 6v5c0 4.6 2.8 8 7 10 4.2-2 7-5.4 7-10V6l-7-3Z" /><path d="m8.5 12 2.2 2.2 4.8-5" /></>, directory: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /><path d="M10 7h5a2 2 0 0 1 2 2v5M7 10v5a2 2 0 0 0 2 2h5" /></>,
    vpn: <><rect x="4" y="10" width="16" height="10" rx="2" /><path d="M8 10V8a4 4 0 0 1 8 0v2M12 14v3" /></>, monitoring: <><path d="M3 12h4l2-5 4 10 2-5h6" /><circle cx="12" cy="12" r="9" /></>, server: <><rect x="5" y="4" width="14" height="7" rx="2" /><rect x="5" y="13" width="14" height="7" rx="2" /><path d="M9 7.5h.01M9 16.5h.01M12 7.5h4M12 16.5h4" /></>, cloud: <path d="M7 18h10a4 4 0 0 0 .5-8 6 6 0 0 0-11.4 1.5A3.3 3.3 0 0 0 7 18Z" />, backup: <><path d="M5 7v5h5M6 12a7 7 0 1 0 2-6" /><path d="M12 8v5l3 2" /></>,
  };
  return <svg aria-hidden="true" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.65" viewBox="0 0 24 24">{glyphs[node]}</svg>;
}

function PackageTabs({ locale, ui, selectedKey, number, onSelect }: { locale: Locale; ui: UiCopy; selectedKey: ProductPackageKey; number: Intl.NumberFormat; onSelect: (key: ProductPackageKey) => void }) {
  return <div className={styles.quickSwitcher}><div className={styles.quickSwitcherCopy}><b>{ui.quickSwitch}</b><small>{ui.quickSwitchHint}</small></div><div className={styles.quickTabs} role="tablist" aria-label={ui.quickSwitch}>{productPackages.map((item) => <button key={item.key} type="button" role="tab" aria-selected={item.key === selectedKey} className={item.key === selectedKey ? styles.quickTabActive : ""} onClick={() => onSelect(item.key)}><small>{number.format(item.order)}</small><span><b>{item.name[locale]}</b><em>{ui.extraCapacity(number.format(item.includedUsers), number.format(item.maxExtraUsers))}</em></span><i aria-hidden="true">{item.key === selectedKey ? "✓" : ""}</i></button>)}</div></div>;
}

function ExtraUserStepper({ product, value, number, ui, onChange, compact = false }: { product: ProductPackage; value: number; number: Intl.NumberFormat; ui: UiCopy; onChange: (value: number) => void; compact?: boolean }) {
  return <div className={`${styles.extraUserControl} ${compact ? styles.extraUserControlCompact : ""}`}>
    <div><b>{ui.extraUsers}</b><small>{ui.extraUsersRange(number.format(product.maxExtraUsers))}</small></div>
    <div className={styles.stepper} role="group" aria-label={ui.extraUsers}>
      <button type="button" aria-label={ui.decreaseExtraUsers} disabled={value === 0} onClick={() => onChange(value - 1)}>−</button>
      <output aria-live="polite">{number.format(value)}</output>
      <button type="button" aria-label={ui.increaseExtraUsers} disabled={value === product.maxExtraUsers} onClick={() => onChange(value + 1)}>+</button>
    </div>
  </div>;
}

function cardFeatures(product: ProductPackage, locale: Locale, ui: UiCopy, number: Intl.NumberFormat) {
  return [...product.unlocks.slice(0, 3).map((item) => item[locale]), product.cloudGb ? ui.cloud(number.format(product.cloudGb)) : ui.noCloud, product.criticalResponse[locale]];
}

export function ProductConfigurator({ locale, initialPackage }: { locale: Locale; initialPackage: ProductPackageKey }) {
  const ui = copy[locale];
  const [selectedKey, setSelectedKey] = useState<ProductPackageKey>(initialPackage);
  const [extraUsersByPackage, setExtraUsersByPackage] = useState<Record<ProductPackageKey, number>>({ basic: 0, standard: 0, advanced: 0, professional: 0, premium: 0 });
  const [fullComparison, setFullComparison] = useState(false);
  const number = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const stepNumber = useMemo(() => new Intl.NumberFormat(locale, { minimumIntegerDigits: 2, useGrouping: false }), [locale]);
  const selected = productPackages.find((item) => item.key === selectedKey) ?? productPackages[0];
  const selectedExtraUsers = extraUsersByPackage[selected.key];
  const users = selected.includedUsers + selectedExtraUsers;
  const term: ContractTerm = "monthly";
  const estimate = useMemo(() => calculateProductPrice(selected, term, users), [selected, term, users]);
  const activeNodeSet = useMemo(() => new Set(selected.nodes), [selected.nodes]);
  const displayUsers = number.format(users);
  const checkoutHref = buildProductCheckoutUrl(selected, term, selectedExtraUsers);
  const setExtraUsers = (key: ProductPackageKey, value: number) => {
    const product = productPackages.find((item) => item.key === key);
    if (!product) return;
    const safeValue = Math.min(product.maxExtraUsers, Math.max(0, value));
    setSelectedKey(key);
    setExtraUsersByPackage((current) => ({ ...current, [key]: safeValue }));
  };
  const comparisonRows = [
    { label: ui.compareCapacity, value: (item: ProductPackage) => ui.extraCapacity(number.format(item.includedUsers), number.format(item.maxExtraUsers)) }, { label: ui.userSupport, value: () => ui.included },
    { label: ui.directory, value: (item: ProductPackage) => item.nodes.includes("directory") ? "✓" : ui.notIncluded }, { label: ui.vpn, value: (item: ProductPackage) => item.nodes.includes("vpn") ? "✓" : ui.notIncluded },
    { label: ui.monitoring, value: (item: ProductPackage) => item.nodes.includes("monitoring") ? "✓" : ui.notIncluded }, { label: ui.managedServer, value: (item: ProductPackage) => item.managedServers ? ui.serverCount(number.format(item.managedServers)) : ui.notIncluded },
    { label: ui.cloudStorage, value: (item: ProductPackage) => item.cloudGb ? ui.cloud(number.format(item.cloudGb)) : ui.notIncluded }, { label: ui.onsite, value: (item: ProductPackage) => item.order >= 4 ? "✓" : ui.notIncluded },
    { label: ui.backup, value: (item: ProductPackage) => item.nodes.includes("backup") ? "✓" : ui.notIncluded }, { label: ui.sla, value: (item: ProductPackage) => item.criticalResponse[locale] },
  ];

  return <div className={styles.configurator}>
    <section className={styles.plansSection} aria-labelledby="plans-title"><SectionHeading id="plans-title" eyebrow={ui.plansEyebrow} title={ui.plansTitle} text={ui.plansText} />
      <div className={styles.cardsGrid}>{productPackages.map((item) => {
        const isSelected = item.key === selected.key;
        const itemExtraUsers = extraUsersByPackage[item.key];
        const itemUsers = item.includedUsers + itemExtraUsers;
        const itemEstimate = calculateProductPrice(item, term, itemUsers);
        const itemCheckoutHref = buildProductCheckoutUrl(item, term, itemExtraUsers);
        return <article className={`${styles.planCard} ${isSelected ? styles.planSelected : ""}`} key={item.key}>
          <div className={styles.planCardHeading}><span>{stepNumber.format(item.order)}</span><div><h3>{item.name[locale]}</h3><p>{item.tagline[locale]}</p></div></div>
          <p className={styles.planAudience}>{item.audience[locale]}</p>
          <div className={styles.planPrice}><small>{ui.priceForTerm}</small><b>{number.format(itemEstimate.total ?? item.prices[term])}</b><span>{ui.toman}</span></div>
          <div className={styles.planFacts}><span>{ui.extraCapacity(number.format(item.includedUsers), number.format(item.maxExtraUsers))}</span><span>{item.cloudGb ? ui.cloud(number.format(item.cloudGb)) : ui.noCloud}</span></div>
          <ExtraUserStepper product={item} value={itemExtraUsers} number={number} ui={ui} onChange={(value) => setExtraUsers(item.key, value)} />
          <ul>{cardFeatures(item, locale, ui, number).map((feature) => <li key={feature}><i aria-hidden="true">✓</i>{feature}</li>)}</ul>
          <a className={styles.planCheckoutLink} href={itemCheckoutHref} onClick={() => setSelectedKey(item.key)}>{ui.cta}<span aria-hidden="true">←</span></a>
        </article>;
      })}</div>
      <aside className={styles.selectionSummary} aria-label={ui.summary}>
        <div><small>{ui.summary}</small><b>{selected.name[locale]}</b></div>
        <ExtraUserStepper product={selected} value={selectedExtraUsers} number={number} ui={ui} onChange={(value) => setExtraUsers(selected.key, value)} compact />
        <div><small>{ui.users}</small><b>{ui.usersValue(displayUsers)}</b></div>
        <div><small>{ui.estimatedTotal}</small><b>{estimate.total === null ? ui.quote : `${number.format(estimate.total)} ${ui.toman}`}</b></div>
        <a href={checkoutHref}>{ui.cta}<span aria-hidden="true">←</span></a>
      </aside>
    </section>

    <section className={styles.infrastructureSection} aria-labelledby="infrastructure-title"><div className={styles.infrastructureHeading}><SectionHeading id="infrastructure-title" eyebrow={ui.infrastructureEyebrow} title={ui.infrastructureTitle} text={ui.infrastructureText} /><div className={styles.legend}><span><i />{ui.active}</span><span><i />{ui.inactive}</span></div></div><PackageTabs locale={locale} ui={ui} selectedKey={selected.key} number={number} onSelect={setSelectedKey} /><div className={styles.infrastructurePanel} role="tabpanel"><div className={styles.infrastructureTopline}><span>ABRIT / INFRASTRUCTURE</span><b aria-live="polite">{selected.name[locale]}</b><i aria-hidden="true" /></div><div className={styles.infrastructureMap}><div className={styles.mapLines} aria-hidden="true"><i /><i /><i /><i /><i /></div>{infrastructureNodes.map((node) => { const active = activeNodeSet.has(node); return <div className={`${styles.infrastructureNode} ${active ? styles.infrastructureNodeActive : ""}`} data-node={node} key={node} aria-label={`${infrastructureLabels[node][locale]}، ${active ? ui.active : ui.inactive}`}><span><InfraIcon node={node} /></span><b>{infrastructureLabels[node][locale]}</b><i aria-hidden="true" /></div>; })}</div></div></section>

    <section className={styles.comparisonSection} aria-labelledby="comparison-title"><SectionHeading id="comparison-title" eyebrow={ui.comparisonEyebrow} title={ui.comparisonTitle} text={ui.comparisonText} /><div className={styles.tableScroller} tabIndex={0}><table><thead><tr><th>{ui.feature}</th>{productPackages.map((item) => <th className={item.key === selected.key ? styles.selectedColumn : ""} key={item.key}>{item.name[locale]}</th>)}</tr></thead><tbody>{comparisonRows.slice(0, fullComparison ? comparisonRows.length : 6).map((row) => <tr key={row.label}><th>{row.label}</th>{productPackages.map((item) => <td className={item.key === selected.key ? styles.selectedColumn : ""} key={item.key}>{row.value(item)}</td>)}</tr>)}</tbody></table></div><button className={styles.compareToggle} type="button" aria-expanded={fullComparison} onClick={() => setFullComparison((value) => !value)}>{fullComparison ? ui.showLess : ui.showFull}<span aria-hidden="true">{fullComparison ? "↑" : "↓"}</span></button></section>

    <section className={styles.detailsSection} aria-labelledby="details-title"><SectionHeading id="details-title" eyebrow={ui.detailsEyebrow} title={ui.detailsTitle} text={ui.detailsText} /><PackageTabs locale={locale} ui={ui} selectedKey={selected.key} number={number} onSelect={setSelectedKey} /><div className={styles.detailsLayout}><div className={styles.accordions}><div className={styles.selectedIntro}><span>{number.format(selected.order)}</span><div><small>{selected.tagline[locale]}</small><h3>{selected.name[locale]}</h3><p>{selected.audience[locale]}</p></div></div>{detailGroups.map((group, index) => <details key={`${selected.key}-${group}`} open={index === 0}><summary><span>{stepNumber.format(index + 1)}</span><b>{featureGroupLabels[group][locale]}</b><i aria-hidden="true">+</i></summary><div><ul>{selected.groups[group].map((feature) => <li key={feature[locale]}><i aria-hidden="true">✓</i>{feature[locale]}</li>)}</ul></div></details>)}</div><aside className={styles.compactSummary}><small>{ui.summary}</small><h3>{selected.name[locale]}</h3><p>{ui.usersValue(displayUsers)} · {contractTerms.find((item) => item.key === term)?.label[locale]}</p><ExtraUserStepper product={selected} value={selectedExtraUsers} number={number} ui={ui} onChange={(value) => setExtraUsers(selected.key, value)} compact /><div className={styles.summaryPrice}><span>{ui.estimatedTotal}</span>{estimate.total === null ? <b>{ui.quote}</b> : <><strong>{number.format(estimate.total)}</strong><em>{ui.toman}</em></>}</div><p>{estimate.quoteRequired ? ui.quoteHint : ui.priceHint}</p><a href={checkoutHref}>{ui.cta}<span aria-hidden="true">←</span></a></aside></div></section>
    <aside className={styles.mobileSummary} aria-label={ui.summary}><div><small>{selected.name[locale]} · {ui.usersValue(displayUsers)}</small><b>{estimate.total === null ? ui.quote : `${number.format(estimate.total)} ${ui.toman}`}</b></div><a href={checkoutHref}>{ui.cta}<span aria-hidden="true">←</span></a></aside>
  </div>;
}
