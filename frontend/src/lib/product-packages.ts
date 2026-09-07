import type { Locale } from "@/lib/types";

export type ProductPackageKey = "basic" | "standard" | "advanced" | "professional" | "premium";
export type ContractTerm = "monthly" | "quarterly" | "semiannual";
export type ManagementLevel = "basic" | "centralized" | "professional" | "complete";
export type FeatureGroupKey = "software" | "network" | "security" | "cloud" | "capacity";
export type InfrastructureNodeKey =
  | "internet"
  | "network"
  | "users"
  | "firewall"
  | "antivirus"
  | "directory"
  | "vpn"
  | "monitoring"
  | "server"
  | "cloud"
  | "backup";

export type LocalizedText = Record<Locale, string>;

export type ProductPackage = {
  key: ProductPackageKey;
  order: number;
  name: LocalizedText;
  tagline: LocalizedText;
  audience: LocalizedText;
  includedUsers: number;
  maxExtraUsers: number;
  whmcs: {
    slug: string;
  };
  extraUserMonthlyToman: number;
  cloudGb: number;
  managedServers: number;
  criticalResponse: LocalizedText;
  prices: Record<ContractTerm, number>;
  nodes: readonly InfrastructureNodeKey[];
  moduleValues: {
    network: LocalizedText;
    security: LocalizedText;
    monitoring: LocalizedText;
  };
  groups: Record<FeatureGroupKey, readonly LocalizedText[]>;
  unlocks: readonly LocalizedText[];
};

const t = (fa: string, en: string, ar: string): LocalizedText => ({ fa, en, "ar-ae": ar });

export const contractTerms = [
  { key: "monthly", months: 1, label: t("ماهانه", "Monthly", "شهري") },
  { key: "quarterly", months: 3, label: t("سه‌ماهه", "3 months", "3 أشهر") },
  { key: "semiannual", months: 6, label: t("شش‌ماهه", "6 months", "6 أشهر") },
] as const satisfies ReadonlyArray<{ key: ContractTerm; months: number; label: LocalizedText }>;

export const managementLevels = [
  { key: "basic", minimumOrder: 1, label: t("پایه", "Essential", "أساسي") },
  { key: "centralized", minimumOrder: 2, label: t("متمرکز", "Centralized", "مركزي") },
  { key: "professional", minimumOrder: 4, label: t("حرفه‌ای", "Professional", "احترافي") },
  { key: "complete", minimumOrder: 5, label: t("جامع", "Complete", "شامل") },
] as const satisfies ReadonlyArray<{ key: ManagementLevel; minimumOrder: number; label: LocalizedText }>;

export const featureGroupLabels: Record<FeatureGroupKey, LocalizedText> = {
  software: t("پشتیبانی نرم‌افزاری", "Software support", "دعم البرمجيات"),
  network: t("شبکه و زیرساخت", "Network & infrastructure", "الشبكة والبنية التحتية"),
  security: t("امنیت", "Security", "الأمن"),
  cloud: t("فضای ابری و پایش", "Cloud & monitoring", "السحابة والمراقبة"),
  capacity: t("ظرفیت و سطح خدمت", "Capacity & service level", "السعة ومستوى الخدمة"),
};

export const productPackages: readonly ProductPackage[] = [
  {
    key: "basic",
    order: 1,
    name: t("پایه", "Basic", "الأساسية"),
    tagline: t("شروع مطمئن", "A confident start", "بداية موثوقة"),
    audience: t("برای کسب‌وکارهای کوچک و استارتاپ‌هایی که به پشتیبانی منظم کاربران، نرم‌افزارها، شبکه داخلی و امنیت اولیه نیاز دارند.", "For small businesses and startups that need dependable user, software, local-network and baseline security support.", "للشركات الصغيرة والناشئة التي تحتاج إلى دعم موثوق للمستخدمين والبرمجيات والشبكة والأمن الأساسي."),
    includedUsers: 4,
    maxExtraUsers: 1,
    whmcs: { slug: "basic" },
    extraUserMonthlyToman: 990_000,
    cloudGb: 0,
    managedServers: 0,
    criticalResponse: t("حداکثر ۳ ساعت کاری", "Up to 3 business hours", "حتى 3 ساعات عمل"),
    prices: { monthly: 9_950_000, quarterly: 28_954_500, semiannual: 56_715_000 },
    nodes: ["internet", "network", "users", "firewall", "antivirus"],
    moduleValues: {
      network: t("بررسی شبکه پایه", "Basic network checks", "فحص أساسي للشبكة"),
      security: t("آنتی‌ویروس و فایروال اولیه", "Antivirus & basic firewall", "مكافحة الفيروسات وجدار حماية أساسي"),
      monitoring: t("بررسی موردی", "On-demand checks", "فحص عند الطلب"),
    },
    groups: {
      software: [t("رفع مشکلات سیستم‌عامل و نرم‌افزارها", "Operating system and software troubleshooting", "معالجة مشكلات نظام التشغيل والبرمجيات"), t("پشتیبانی کاربران از راه دور", "Remote user support", "دعم المستخدمين عن بُعد"), t("مدیریت درخواست‌ها و تیکت‌ها", "Request and ticket management", "إدارة الطلبات والتذاكر")],
      network: [t("بررسی اتصال شبکه داخلی", "Local network connectivity checks", "فحص اتصال الشبكة الداخلية"), t("بررسی تنظیمات اولیه مودم و روتر", "Basic modem and router checks", "فحص إعدادات المودم والموجّه الأساسية"), t("بررسی عملکرد ارتباطات شبکه", "Network communication checks", "فحص أداء اتصالات الشبكة")],
      security: [t("نصب و مدیریت آنتی‌ویروس", "Antivirus installation and management", "تثبيت وإدارة مكافحة الفيروسات"), t("پیکربندی اولیه فایروال", "Basic firewall configuration", "الإعداد الأساسي لجدار الحماية")],
      cloud: [t("فضای ابری در این سطح ارائه نمی‌شود", "Cloud storage is not included at this level", "لا يشمل هذا المستوى مساحة تخزين سحابية")],
      capacity: [t("۴ کاربر پایه؛ امکان افزودن ۱ کاربر اضافه", "4 included users; up to 1 additional user", "4 مستخدمين أساسيين؛ حتى مستخدم إضافي واحد"), t("کاربر اضافه ماهانه ۹۹۰٬۰۰۰ تومان", "Extra user: 990,000 toman per month", "المستخدم الإضافي: 990,000 تومان شهرياً"), t("زمان پاسخ بحرانی: حداکثر ۳ ساعت کاری", "Critical response: up to 3 business hours", "الاستجابة الحرجة: حتى 3 ساعات عمل")],
    },
    unlocks: [t("پشتیبانی کاربران و نرم‌افزارها", "User and software support", "دعم المستخدمين والبرمجيات"), t("آنتی‌ویروس و فایروال اولیه", "Antivirus and basic firewall", "مكافحة الفيروسات وجدار حماية أساسي")],
  },
  {
    key: "standard",
    order: 2,
    name: t("استاندارد", "Standard", "القياسية"),
    tagline: t("مدیریت متمرکز", "Centralized management", "إدارة مركزية"),
    audience: t("برای شرکت‌های کوچک که علاوه بر پشتیبانی روزمره، به مدیریت کاربران، دسترسی‌ها و نظم بیشتر در زیرساخت نیاز دارند.", "For small companies that need user, access and infrastructure management in addition to everyday support.", "للشركات الصغيرة التي تحتاج إلى إدارة المستخدمين والصلاحيات والبنية التحتية إلى جانب الدعم اليومي."),
    includedUsers: 7,
    maxExtraUsers: 2,
    whmcs: { slug: "standard" },
    extraUserMonthlyToman: 1_290_000,
    cloudGb: 5,
    managedServers: 0,
    criticalResponse: t("حداکثر ۱ ساعت کاری", "Up to 1 business hour", "حتى ساعة عمل واحدة"),
    prices: { monthly: 12_490_000, quarterly: 36_345_900, semiannual: 71_193_000 },
    nodes: ["internet", "network", "users", "firewall", "antivirus", "directory", "cloud"],
    moduleValues: {
      network: t("مدیریت و مستندسازی", "Managed & documented", "إدارة وتوثيق"),
      security: t("دایرکتوری و سیاست پایه", "Directory & baseline policies", "دليل وسياسات أساسية"),
      monitoring: t("گزارش دوره‌ای", "Periodic reporting", "تقارير دورية"),
    },
    groups: {
      software: [t("رفع مشکلات سیستم‌عامل، نرم‌افزار، پرینتر و اینترنت", "Operating system, software, printer and internet support", "دعم نظام التشغيل والبرمجيات والطابعة والإنترنت"), t("پشتیبانی کاربران از راه دور", "Remote user support", "دعم المستخدمين عن بُعد"), t("مدیریت حساب کاربران و سطح دسترسی‌ها", "User account and access management", "إدارة حسابات المستخدمين والصلاحيات"), t("به‌روزرسانی سیستم‌ها", "System updates", "تحديث الأنظمة"), t("ثبت و پیگیری تیکت‌ها", "Ticket registration and follow-up", "تسجيل التذاكر ومتابعتها")],
      network: [t("بررسی شبکه داخلی، مودم و روتر", "Local network, modem and router checks", "فحص الشبكة الداخلية والمودم والموجّه"), t("ثبت و مستندسازی دارایی‌ها و تجهیزات فناوری اطلاعات", "IT asset and equipment documentation", "توثيق أصول ومعدات تقنية المعلومات")],
      security: [t("نصب و مدیریت آنتی‌ویروس", "Antivirus installation and management", "تثبيت وإدارة مكافحة الفيروسات"), t("پیکربندی اولیه فایروال", "Basic firewall configuration", "الإعداد الأساسي لجدار الحماية"), t("مدیریت کاربران با اکتیودایرکتوری", "User management with Active Directory", "إدارة المستخدمين عبر Active Directory"), t("اعمال سیاست‌های امنیتی پایه", "Baseline security policies", "تطبيق سياسات أمنية أساسية")],
      cloud: [t("گزارش دوره‌ای وضعیت", "Periodic status reporting", "تقارير دورية للحالة"), t("۵ گیگابایت فضای ذخیره‌سازی ابری", "5 GB cloud storage", "5 جيجابايت تخزين سحابي")],
      capacity: [t("۷ کاربر پایه؛ امکان افزودن ۲ کاربر اضافه", "7 included users; up to 2 additional users", "7 مستخدمين أساسيين؛ حتى مستخدمين إضافيين"), t("کاربر اضافه ماهانه ۱٬۲۹۰٬۰۰۰ تومان", "Extra user: 1,290,000 toman per month", "المستخدم الإضافي: 1,290,000 تومان شهرياً"), t("زمان پاسخ بحرانی: حداکثر ۱ ساعت کاری", "Critical response: up to 1 business hour", "الاستجابة الحرجة: حتى ساعة عمل واحدة")],
    },
    unlocks: [t("مدیریت کاربران و سطح دسترسی", "User and access management", "إدارة المستخدمين والصلاحيات"), t("اکتیودایرکتوری و سیاست‌های امنیتی", "Active Directory and security policies", "Active Directory والسياسات الأمنية"), t("فضای ذخیره‌سازی ابری", "Cloud storage", "التخزين السحابي")],
  },
  {
    key: "advanced",
    order: 3,
    name: t("پیشرفته", "Advanced", "المتقدمة"),
    tagline: t("ارتباط امن", "Secure connectivity", "اتصال آمن"),
    audience: t("برای شرکت‌های متوسط، چندشعبه‌ای یا دارای کاربران دورکار که به ارتباط امن و پایش بهتر سرویس‌ها نیاز دارند.", "For medium, multi-branch or remote-work companies that need secure connectivity and stronger service monitoring.", "للشركات المتوسطة أو متعددة الفروع أو التي لديها موظفون عن بُعد وتحتاج إلى اتصال آمن ومراقبة أفضل للخدمات."),
    includedUsers: 10,
    maxExtraUsers: 3,
    whmcs: { slug: "advance" },
    extraUserMonthlyToman: 1_690_000,
    cloudGb: 10,
    managedServers: 0,
    criticalResponse: t("حداکثر ۳۰ دقیقه", "Up to 30 minutes", "حتى 30 دقيقة"),
    prices: { monthly: 18_950_000, quarterly: 55_144_500, semiannual: 108_015_000 },
    nodes: ["internet", "network", "users", "firewall", "antivirus", "directory", "vpn", "monitoring", "cloud"],
    moduleValues: {
      network: t("وی‌پی‌ان و سلامت شبکه", "VPN & network health", "VPN وصحة الشبكة"),
      security: t("دسترسی و وصله‌های امنیتی", "Access & security patches", "الصلاحيات والتحديثات الأمنية"),
      monitoring: t("پایش سرویس‌های مهم", "Key service monitoring", "مراقبة الخدمات المهمة"),
    },
    groups: {
      software: [t("رفع مشکلات سیستم‌عامل، نرم‌افزار، پرینتر و اینترنت", "Operating system, software, printer and internet support", "دعم نظام التشغيل والبرمجيات والطابعة والإنترنت"), t("پشتیبانی کاربران دورکار", "Remote workforce support", "دعم المستخدمين عن بُعد"), t("مدیریت حساب کاربران و سطح دسترسی‌ها", "User account and access management", "إدارة حسابات المستخدمين والصلاحيات"), t("به‌روزرسانی سیستم‌ها و رسیدگی به رخدادهای تکراری", "System updates and recurring incident handling", "تحديث الأنظمة ومعالجة الحوادث المتكررة"), t("ثبت و پیگیری تیکت‌ها", "Ticket registration and follow-up", "تسجيل التذاكر ومتابعتها")],
      network: [t("بررسی شبکه داخلی، مودم و روتر", "Local network, modem and router checks", "فحص الشبكة الداخلية والمودم والموجّه"), t("راه‌اندازی و نگهداری وی‌پی‌ان برای شعب و کاربران دورکار", "VPN setup and maintenance for branches and remote users", "إعداد وصيانة VPN للفروع والمستخدمين عن بُعد"), t("بررسی دوره‌ای سلامت شبکه", "Periodic network health checks", "فحص دوري لصحة الشبكة"), t("مستندسازی تجهیزات فناوری اطلاعات", "IT equipment documentation", "توثيق معدات تقنية المعلومات")],
      security: [t("نصب و مدیریت آنتی‌ویروس و فایروال", "Antivirus and firewall management", "إدارة مكافحة الفيروسات وجدار الحماية"), t("مدیریت اکتیودایرکتوری و سیاست‌های امنیتی", "Active Directory and security policy management", "إدارة Active Directory والسياسات الأمنية"), t("بررسی دسترسی‌ها و وصله‌های امنیتی", "Access and patch reviews", "مراجعة الصلاحيات والتحديثات الأمنية")],
      cloud: [t("پایش سرویس‌های مهم و گزارش وضعیت", "Key service monitoring and status reports", "مراقبة الخدمات المهمة وتقارير الحالة"), t("۱۰ گیگابایت فضای ذخیره‌سازی ابری", "10 GB cloud storage", "10 جيجابايت تخزين سحابي")],
      capacity: [t("۱۰ کاربر پایه؛ امکان افزودن ۳ کاربر اضافه", "10 included users; up to 3 additional users", "10 مستخدمين أساسيين؛ حتى 3 مستخدمين إضافيين"), t("کاربر اضافه ماهانه ۱٬۶۹۰٬۰۰۰ تومان", "Extra user: 1,690,000 toman per month", "المستخدم الإضافي: 1,690,000 تومان شهرياً"), t("زمان پاسخ بحرانی: حداکثر ۳۰ دقیقه", "Critical response: up to 30 minutes", "الاستجابة الحرجة: حتى 30 دقيقة")],
    },
    unlocks: [t("وی‌پی‌ان برای شعب و کاربران دورکار", "VPN for branches and remote users", "VPN للفروع والمستخدمين عن بُعد"), t("بررسی دوره‌ای سلامت شبکه", "Periodic network health checks", "فحص دوري لصحة الشبكة"), t("پایش سرویس‌های مهم", "Key service monitoring", "مراقبة الخدمات المهمة")],
  },
  {
    key: "professional",
    order: 4,
    name: t("حرفه‌ای", "Professional", "الاحترافية"),
    tagline: t("کنترل حرفه‌ای", "Professional control", "تحكم احترافي"),
    audience: t("برای شرکت‌هایی با شبکه و تجهیزات حرفه‌ای‌تر که به مدیریت تخصصی زیرساخت، پایش و خدمات حضوری نیاز دارند.", "For companies with professional networks and equipment that need specialist infrastructure management, monitoring and on-site service.", "للشركات ذات الشبكات والمعدات الاحترافية التي تحتاج إلى إدارة متخصصة للبنية التحتية والمراقبة والخدمة الميدانية."),
    includedUsers: 20,
    maxExtraUsers: 5,
    whmcs: { slug: "professionall" },
    extraUserMonthlyToman: 2_490_000,
    cloudGb: 20,
    managedServers: 1,
    criticalResponse: t("حداکثر ۱۵ دقیقه", "Up to 15 minutes", "حتى 15 دقيقة"),
    prices: { monthly: 29_490_000, quarterly: 85_815_900, semiannual: 168_093_000 },
    nodes: ["internet", "network", "users", "firewall", "antivirus", "directory", "vpn", "monitoring", "server", "cloud"],
    moduleValues: {
      network: t("مدیریت تجهیزات حرفه‌ای", "Professional equipment management", "إدارة احترافية للمعدات"),
      security: t("سیاست و پایش کلیدی", "Policies & key monitoring", "السياسات والمراقبة الرئيسية"),
      monitoring: t("پایش حرفه‌ای", "Professional monitoring", "مراقبة احترافية"),
    },
    groups: {
      software: [t("رفع مشکلات سیستم‌عامل، نرم‌افزار، پرینتر و اینترنت", "Operating system, software, printer and internet support", "دعم نظام التشغيل والبرمجيات والطابعة والإنترنت"), t("پشتیبانی از راه دور و حضوری کاربران", "Remote and on-site user support", "دعم المستخدمين عن بُعد وميدانياً"), t("پشتیبانی کاربران دورکار و مدیریت دسترسی‌ها", "Remote workforce and access management", "دعم المستخدمين عن بُعد وإدارة الصلاحيات"), t("به‌روزرسانی سیستم‌ها و رسیدگی به رخدادهای تکراری", "System updates and recurring incident handling", "تحديث الأنظمة ومعالجة الحوادث المتكررة")],
      network: [t("بررسی و مدیریت شبکه داخلی", "Local network review and management", "فحص وإدارة الشبكة الداخلية"), t("راه‌اندازی و نگهداری وی‌پی‌ان", "VPN setup and maintenance", "إعداد وصيانة VPN"), t("بررسی دوره‌ای سلامت شبکه", "Periodic network health checks", "فحص دوري لصحة الشبكة"), t("مدیریت و عیب‌یابی سوییچ، روتر، وای‌فای و میکروتیک", "Switch, router, Wi-Fi and MikroTik management", "إدارة واستكشاف أعطال المحولات والموجّهات وWi-Fi وMikroTik"), t("یک بازدید حضوری ماهانه در مشهد", "One monthly on-site visit in Mashhad", "زيارة ميدانية شهرية واحدة في مشهد"), t("یک سرور مجازی مدیریت‌شده", "One managed virtual server", "خادم افتراضي مُدار واحد")],
      security: [t("نصب و مدیریت آنتی‌ویروس و فایروال", "Antivirus and firewall management", "إدارة مكافحة الفيروسات وجدار الحماية"), t("مدیریت اکتیودایرکتوری و سیاست‌های امنیتی", "Active Directory and security policy management", "إدارة Active Directory والسياسات الأمنية"), t("پایش تجهیزات و سرویس‌های کلیدی", "Key equipment and service monitoring", "مراقبة المعدات والخدمات الرئيسية")],
      cloud: [t("مستندسازی شبکه و گزارش فنی دوره‌ای", "Network documentation and periodic technical reports", "توثيق الشبكة وتقارير فنية دورية"), t("۲۰ گیگابایت فضای ذخیره‌سازی ابری", "20 GB cloud storage", "20 جيجابايت تخزين سحابي")],
      capacity: [t("۲۰ کاربر پایه؛ امکان افزودن ۵ کاربر اضافه", "20 included users; up to 5 additional users", "20 مستخدماً أساسياً؛ حتى 5 مستخدمين إضافيين"), t("کاربر اضافه ماهانه ۲٬۴۹۰٬۰۰۰ تومان", "Extra user: 2,490,000 toman per month", "المستخدم الإضافي: 2,490,000 تومان شهرياً"), t("زمان پاسخ بحرانی: حداکثر ۱۵ دقیقه", "Critical response: up to 15 minutes", "الاستجابة الحرجة: حتى 15 دقيقة")],
    },
    unlocks: [t("مدیریت تجهیزات حرفه‌ای شبکه", "Professional network equipment management", "إدارة احترافية لمعدات الشبكة"), t("سرور مجازی مدیریت‌شده", "Managed virtual server", "خادم افتراضي مُدار"), t("پشتیبانی حضوری و گزارش فنی", "On-site support and technical reporting", "دعم ميداني وتقارير فنية")],
  },
  {
    key: "premium",
    order: 5,
    name: t("ممتاز", "Premium", "الممتازة"),
    tagline: t("مدیریت یکپارچه", "Unified management", "إدارة متكاملة"),
    audience: t("برای سازمان‌هایی که فناوری اطلاعات بخش حیاتی عملیات روزانه آن‌هاست و به مدیریت جامع، امنیت بیشتر و پشتیبانی اولویت‌دار نیاز دارند.", "For organizations where IT is mission-critical and requires complete management, stronger security and priority support.", "للمؤسسات التي تمثل تقنية المعلومات جزءاً حيوياً من عملياتها وتحتاج إلى إدارة شاملة وأمن أقوى ودعم ذي أولوية."),
    includedUsers: 30,
    maxExtraUsers: 7,
    whmcs: { slug: "vip" },
    extraUserMonthlyToman: 3_490_000,
    cloudGb: 40,
    managedServers: 2,
    criticalResponse: t("پاسخ‌گویی لحظه‌ای", "Immediate response", "استجابة فورية"),
    prices: { monthly: 42_990_000, quarterly: 125_100_900, semiannual: 245_043_000 },
    nodes: ["internet", "network", "users", "firewall", "antivirus", "directory", "vpn", "monitoring", "server", "cloud", "backup"],
    moduleValues: {
      network: t("مدیریت جامع زیرساخت", "Complete infrastructure management", "إدارة شاملة للبنية التحتية"),
      security: t("بازبینی مستمر امنیت", "Continuous security review", "مراجعة أمنية مستمرة"),
      monitoring: t("پایش مستمر و مدیریت سطح خدمت", "Continuous monitoring & SLA", "مراقبة مستمرة وإدارة مستوى الخدمة"),
    },
    groups: {
      software: [t("رفع مشکلات سیستم‌عامل، نرم‌افزار، پرینتر و اینترنت", "Operating system, software, printer and internet support", "دعم نظام التشغيل والبرمجيات والطابعة والإنترنت"), t("پشتیبانی از راه دور و حضوری کاربران", "Remote and on-site user support", "دعم المستخدمين عن بُعد وميدانياً"), t("اولویت بالاتر در رسیدگی به رخدادهای بحرانی", "Priority handling of critical incidents", "أولوية أعلى للحوادث الحرجة"), t("مدیریت کاربران، دسترسی‌ها، به‌روزرسانی‌ها و تیکت‌ها", "User, access, update and ticket management", "إدارة المستخدمين والصلاحيات والتحديثات والتذاكر")],
      network: [t("مدیریت جامع زیرساخت و تجهیزات فناوری اطلاعات", "Complete IT infrastructure and equipment management", "إدارة شاملة للبنية التحتية ومعدات تقنية المعلومات"), t("راه‌اندازی و نگهداری وی‌پی‌ان", "VPN setup and maintenance", "إعداد وصيانة VPN"), t("یک بازدید حضوری هفتگی در مشهد", "One weekly on-site visit in Mashhad", "زيارة ميدانية أسبوعية واحدة في مشهد"), t("دو سرور مجازی مدیریت‌شده", "Two managed virtual servers", "خادمان افتراضيان مُداران")],
      security: [t("نصب و مدیریت آنتی‌ویروس و فایروال", "Antivirus and firewall management", "إدارة مكافحة الفيروسات وجدار الحماية"), t("مدیریت اکتیودایرکتوری و سیاست‌های امنیتی", "Active Directory and security policy management", "إدارة Active Directory والسياسات الأمنية"), t("پشتیبان‌گیری و بازیابی", "Backup and recovery", "النسخ الاحتياطي والاستعادة"), t("مدیریت سطح خدمت و بازبینی مستمر امنیت", "SLA management and continuous security review", "إدارة مستوى الخدمة والمراجعة الأمنية المستمرة")],
      cloud: [t("پایش مستمر تجهیزات و سرویس‌ها", "Continuous equipment and service monitoring", "مراقبة مستمرة للمعدات والخدمات"), t("گزارش مدیریتی", "Management reporting", "تقارير إدارية"), t("۴۰ گیگابایت فضای ذخیره‌سازی ابری", "40 GB cloud storage", "40 جيجابايت تخزين سحابي")],
      capacity: [t("۳۰ کاربر پایه؛ امکان افزودن ۷ کاربر اضافه", "30 included users; up to 7 additional users", "30 مستخدماً أساسياً؛ حتى 7 مستخدمين إضافيين"), t("کاربر اضافه ماهانه ۳٬۴۹۰٬۰۰۰ تومان", "Extra user: 3,490,000 toman per month", "المستخدم الإضافي: 3,490,000 تومان شهرياً"), t("زمان پاسخ بحرانی: پاسخ‌گویی لحظه‌ای", "Critical response: immediate", "الاستجابة الحرجة: فورية")],
    },
    unlocks: [t("پایش مستمر زیرساخت", "Continuous infrastructure monitoring", "مراقبة مستمرة للبنية التحتية"), t("پشتیبان‌گیری و بازیابی", "Backup and recovery", "النسخ الاحتياطي والاستعادة"), t("مدیریت سطح خدمت و امنیت", "SLA and security management", "إدارة مستوى الخدمة والأمن")],
  },
] as const;

export function isProductPackageKey(value: string | undefined): value is ProductPackageKey {
  return productPackages.some((item) => item.key === value);
}

export function recommendProductPackage({ users, multipleBranches, remoteUsers, managementLevel }: { users: number; multipleBranches: boolean; remoteUsers: boolean; managementLevel: ManagementLevel }) {
  const capacityOrder = productPackages.find((item) => users <= item.includedUsers + item.maxExtraUsers)?.order ?? 5;
  const levelOrder = managementLevels.find((item) => item.key === managementLevel)?.minimumOrder ?? 1;
  const operationalOrder = multipleBranches || remoteUsers ? 3 : 1;
  const recommendedOrder = Math.max(capacityOrder, levelOrder, operationalOrder);
  return productPackages.find((item) => item.order === recommendedOrder) ?? productPackages[4];
}

export function calculateProductPrice(product: ProductPackage, term: ContractTerm, users: number) {
  const termData = contractTerms.find((item) => item.key === term) ?? contractTerms[0];
  const extraUsers = Math.max(0, users - product.includedUsers);
  const quoteRequired = extraUsers > product.maxExtraUsers;
  const extras = quoteRequired ? null : extraUsers * product.extraUserMonthlyToman * termData.months;
  return {
    extraUsers,
    quoteRequired,
    extras,
    total: extras === null ? null : product.prices[term] + extras,
  };
}

export function buildProductCheckoutUrl(product: ProductPackage) {
  return `https://my.abrit.ir/store/packages/${product.whmcs.slug}`;
}
