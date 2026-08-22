import type { ContentSummary, Locale, NavigationItem, Package, SiteSettings } from "./types";

type Localized = Record<Locale, string>;

export type CapabilityKey =
  | "helpdesk" | "operations" | "monitoring" | "documentation" | "security"
  | "network" | "identity" | "workspace" | "backup" | "automation"
  | "virtualization" | "telephony" | "remote" | "reporting";

export type PublicService = {
  slug: string;
  title: Localized;
  excerpt: Localized;
  capabilities: CapabilityKey[];
  technologies: string[];
};

export type PublicSolution = {
  slug: string;
  title: Localized;
  excerpt: Localized;
  serviceSlugs: string[];
};

const capabilityData: Record<CapabilityKey, { title: Localized; description: Localized }> = {
  helpdesk: {
    title: { fa: "پشتیبانی و Help Desk", en: "Help desk & support", "ar-ae": "الدعم ومكتب الخدمة" },
    description: { fa: "دریافت، اولویت‌بندی و پیگیری درخواست‌های کاربران از مسیر مشخص.", en: "Structured intake, prioritization and follow-up for user requests.", "ar-ae": "استقبال طلبات المستخدمين وترتيبها ومتابعتها ضمن مسار واضح." },
  },
  operations: {
    title: { fa: "مدیریت عملیات IT", en: "IT operations management", "ar-ae": "إدارة عمليات تقنية المعلومات" },
    description: { fa: "هماهنگی زیرساخت، کاربران و سرویس‌ها در یک مدل عملیاتی یکپارچه.", en: "Coordinate infrastructure, users and services through one operating model.", "ar-ae": "تنسيق البنية التحتية والمستخدمين والخدمات ضمن نموذج تشغيلي واحد." },
  },
  monitoring: {
    title: { fa: "مانیتورینگ و هشدار", en: "Monitoring & alerting", "ar-ae": "المراقبة والتنبيهات" },
    description: { fa: "پایش دسترس‌پذیری، سلامت سرویس و ظرفیت‌های مهم با هشدار قابل پیگیری.", en: "Track availability, service health and important capacity signals.", "ar-ae": "متابعة التوفر وصحة الخدمات ومؤشرات السعة المهمة." },
  },
  documentation: {
    title: { fa: "مستندسازی", en: "Living documentation", "ar-ae": "التوثيق المستمر" },
    description: { fa: "ثبت ساختار، دسترسی‌ها و تغییرات برای کاهش وابستگی به دانش شفاهی.", en: "Record structure, access and changes to reduce verbal dependency.", "ar-ae": "توثيق البنية والصلاحيات والتغييرات وتقليل الاعتماد على المعرفة الشفهية." },
  },
  security: {
    title: { fa: "کنترل‌های امنیتی", en: "Security controls", "ar-ae": "ضوابط الأمان" },
    description: { fa: "مدیریت سیاست‌های پایه امنیت، Firewall و وضعیت Endpointهای تحت پوشش.", en: "Manage baseline security, firewall policy and covered endpoints.", "ar-ae": "إدارة سياسات الأمان والجدار الناري وحالة الأجهزة المشمولة." },
  },
  network: {
    title: { fa: "شبکه و ارتباط امن", en: "Network & secure connectivity", "ar-ae": "الشبكات والاتصال الآمن" },
    description: { fa: "طراحی و مدیریت VLAN، Routing، VPN و ارتباط کنترل‌شده میان سایت‌ها.", en: "Design and manage VLAN, routing, VPN and controlled site connectivity.", "ar-ae": "تصميم وإدارة VLAN والتوجيه وVPN والاتصال المنضبط بين المواقع." },
  },
  identity: {
    title: { fa: "هویت و دسترسی", en: "Identity & access", "ar-ae": "الهوية والوصول" },
    description: { fa: "مدیریت User، Group، Domain و سیاست‌های دسترسی مبتنی بر نقش.", en: "Manage users, groups, domains and role-based access policy.", "ar-ae": "إدارة المستخدمين والمجموعات والنطاق وسياسات الوصول حسب الدور." },
  },
  workspace: {
    title: { fa: "همکاری و فایل سازمانی", en: "Collaboration & files", "ar-ae": "التعاون والملفات" },
    description: { fa: "اشتراک فایل، Office Online و دسترسی سازمانی کنترل‌شده.", en: "File sharing, online office and controlled organizational access.", "ar-ae": "مشاركة الملفات والمكتب عبر الإنترنت والوصول المؤسسي المنضبط." },
  },
  backup: {
    title: { fa: "Backup و Restore", en: "Backup & restore", "ar-ae": "النسخ والاستعادة" },
    description: { fa: "پایش Jobهای بکاپ، بررسی خطا و برنامه‌ریزی تست بازیابی.", en: "Monitor backup jobs, review failures and plan restore checks.", "ar-ae": "مراقبة مهام النسخ ومراجعة الأعطال والتخطيط لاختبارات الاستعادة." },
  },
  automation: {
    title: { fa: "Workflow و Integration", en: "Workflow & integration", "ar-ae": "سير العمل والتكامل" },
    description: { fa: "خودکارسازی اعلان‌ها، گردش‌کارها و عملیات تکراری قابل تعریف.", en: "Automate defined notifications, workflows and repeatable operations.", "ar-ae": "أتمتة الإشعارات ومسارات العمل والعمليات المتكررة المحددة." },
  },
  virtualization: {
    title: { fa: "سرور و مجازی‌سازی", en: "Servers & virtualization", "ar-ae": "الخوادم والافتراضية" },
    description: { fa: "پایش و مدیریت Server/VM و زیرساخت مجازی در محدوده توافق‌شده.", en: "Monitor and manage agreed server, VM and virtualization scope.", "ar-ae": "مراقبة وإدارة الخوادم والآلات الافتراضية ضمن النطاق المتفق عليه." },
  },
  telephony: {
    title: { fa: "تلفن سازمانی", en: "Business telephony", "ar-ae": "الاتصالات الهاتفية" },
    description: { fa: "مدیریت VoIP، داخلی‌ها، Trunk، IVR و ارتباط صوتی شعب.", en: "Manage VoIP, extensions, trunks, IVR and branch voice connectivity.", "ar-ae": "إدارة VoIP والامتدادات والخطوط وIVR واتصال الفروع الصوتي." },
  },
  remote: {
    title: { fa: "مدیریت از راه دور", en: "Remote management", "ar-ae": "الإدارة عن بُعد" },
    description: { fa: "Inventory، وضعیت سیستم‌ها و دسترسی امن برای عملیات پشتیبانی.", en: "Inventory, system status and secure access for support operations.", "ar-ae": "الجرد وحالة الأنظمة والوصول الآمن لعمليات الدعم." },
  },
  reporting: {
    title: { fa: "گزارش و بهبود", en: "Reporting & improvement", "ar-ae": "التقارير والتحسين" },
    description: { fa: "مرور رخدادها، وضعیت سرویس و پیشنهادهای اصلاحی اولویت‌دار.", en: "Review incidents, service posture and prioritized improvements.", "ar-ae": "مراجعة الحوادث وحالة الخدمات والتحسينات ذات الأولوية." },
  },
};

export const services: PublicService[] = [
  { slug: "managed-it", title: { fa: "مدیریت IT", en: "Managed IT", "ar-ae": "إدارة تقنية المعلومات" }, excerpt: { fa: "پشتیبانی کاربران، مدیریت سیستم‌ها، رسیدگی ساختاریافته به درخواست‌ها و مدیریت مستمر زیرساخت فناوری اطلاعات.", en: "User support, systems management, structured request handling and continuous management of your IT infrastructure.", "ar-ae": "دعم المستخدمين وإدارة الأنظمة ومعالجة الطلبات بصورة منظمة والإدارة المستمرة للبنية التحتية." }, capabilities: ["helpdesk", "operations", "monitoring", "documentation", "reporting"], technologies: ["GLPI", "TacticalRMM", "NetXMS"] },
  { slug: "digital-workspace", title: { fa: "فضای کار سازمانی", en: "Digital Workspace", "ar-ae": "بيئة العمل الرقمية" }, excerpt: { fa: "فضای کار سازمانی برای فایل‌ها، اشتراک‌گذاری، همکاری تیمی، Office Online و دسترسی کنترل‌شده به اطلاعات.", en: "Organizational files, sharing, team collaboration, online office and controlled access to information.", "ar-ae": "ملفات المؤسسة والمشاركة والتعاون بين الفرق والمكتب عبر الإنترنت والوصول المنضبط إلى المعلومات." }, capabilities: ["workspace", "identity", "backup", "documentation"], technologies: ["Nextcloud", "OnlyOffice", "TrueNAS"] },
  { slug: "network-security", title: { fa: "شبکه و امنیت", en: "Network & Security", "ar-ae": "الشبكات والأمن" }, excerpt: { fa: "طراحی و مدیریت شبکه، Firewall، VPN، Segmentation، ارتباط شعب و دسترسی امن به سرویس‌های سازمان.", en: "Network design and management, firewall, VPN, segmentation, branch connectivity and secure service access.", "ar-ae": "تصميم الشبكات وإدارتها والجدار الناري وVPN والتقسيم وربط الفروع والوصول الآمن للخدمات." }, capabilities: ["network", "security", "monitoring", "documentation"], technologies: ["pfSense", "MikroTik", "Cisco", "WireGuard"] },
  { slug: "identity-access", title: { fa: "هویت و دسترسی", en: "Identity & Access", "ar-ae": "الهوية والوصول" }, excerpt: { fa: "مدیریت متمرکز کاربران، Active Directory، LDAP، SSO و دسترسی مبتنی بر نقش و گروه.", en: "Centralized user management, Active Directory, LDAP, SSO and role- or group-based access.", "ar-ae": "إدارة مركزية للمستخدمين عبر Active Directory وLDAP وSSO وصلاحيات حسب الدور والمجموعة." }, capabilities: ["identity", "security", "documentation", "monitoring"], technologies: ["Microsoft Active Directory", "LDAP", "SSO"] },
  { slug: "backup-recovery", title: { fa: "بکاپ و بازیابی", en: "Backup & Recovery", "ar-ae": "النسخ الاحتياطي والاستعادة" }, excerpt: { fa: "پشتیبان‌گیری از داده‌ها و سرویس‌های حیاتی، سیاست نگهداری و برنامه‌ریزی برای بازیابی و تداوم کسب‌وکار.", en: "Protection of critical data and services, retention policies, recovery planning and business continuity.", "ar-ae": "حماية البيانات والخدمات الحيوية وسياسات الاحتفاظ والتخطيط للاستعادة واستمرارية الأعمال." }, capabilities: ["backup", "monitoring", "documentation", "reporting"], technologies: ["TrueNAS", "Proxmox Backup", "Nextcloud"] },
  { slug: "monitoring", title: { fa: "مانیتورینگ", en: "Monitoring", "ar-ae": "المراقبة" }, excerpt: { fa: "پایش شبکه، سرورها و سرویس‌ها برای شناسایی اختلال، بررسی ظرفیت و ایجاد فرایند منظم Alert تا Resolution.", en: "Network, server and service monitoring to identify incidents, track capacity and manage alert-to-resolution.", "ar-ae": "مراقبة الشبكات والخوادم والخدمات لاكتشاف الأعطال ومتابعة السعة وإدارة التنبيه حتى المعالجة." }, capabilities: ["monitoring", "reporting", "operations", "automation"], technologies: ["NetXMS", "TacticalRMM", "GLPI"] },
  { slug: "erp-automation", title: { fa: "ERP و اتوماسیون", en: "ERP & Automation", "ar-ae": "ERP والأتمتة" }, excerpt: { fa: "راهکارهای ERP، CRM، فروش، منابع سازمانی و اتوماسیون فرایندها بر بستر Odoo Enterprise.", en: "ERP, CRM, sales, enterprise resources and process automation based on Odoo Enterprise.", "ar-ae": "حلول ERP وCRM والمبيعات وموارد المؤسسة وأتمتة العمليات بالاعتماد على Odoo Enterprise." }, capabilities: ["automation", "operations", "reporting", "identity"], technologies: ["Odoo Enterprise", "n8n"] },
  { slug: "business-telephony", title: { fa: "تلفن سازمانی", en: "Business Telephony", "ar-ae": "الاتصالات الهاتفية المؤسسية" }, excerpt: { fa: "راهکارهای VoIP، مرکز تلفن، داخلی‌ها، IVR، ارتباط شعب و مدیریت ارتباطات صوتی سازمان.", en: "VoIP, PBX, extensions, IVR, branch connectivity and managed organizational voice communications.", "ar-ae": "VoIP ومقسم الهاتف والامتدادات وIVR وربط الفروع وإدارة الاتصالات الصوتية." }, capabilities: ["telephony", "network", "monitoring", "documentation"], technologies: ["Issabel", "VoIP", "SIP"] },
  { slug: "remote-management", title: { fa: "مدیریت از راه دور", en: "Remote Management", "ar-ae": "الإدارة عن بُعد" }, excerpt: { fa: "مدیریت متمرکز Endpointها، Remote Support، Inventory، Monitoring و اجرای عملیات مدیریتی روی سیستم‌ها.", en: "Centralized endpoint management, remote support, inventory, monitoring and remote administration.", "ar-ae": "إدارة مركزية للأجهزة والدعم عن بُعد والجرد والمراقبة وتنفيذ المهام الإدارية." }, capabilities: ["remote", "helpdesk", "monitoring", "security"], technologies: ["TacticalRMM", "GLPI", "Endpoint Security"] },
  { slug: "it-automation", title: { fa: "اتوماسیون IT", en: "IT Automation", "ar-ae": "أتمتة تقنية المعلومات" }, excerpt: { fa: "خودکارسازی Workflowها، اعلان‌ها، Integrationها و فرایندهای تکراری برای افزایش سرعت و کاهش عملیات دستی.", en: "Automating workflows, notifications, integrations and repetitive processes to reduce manual work and increase speed.", "ar-ae": "أتمتة سير العمل والإشعارات والتكاملات والعمليات المتكررة لتقليل العمل اليدوي وزيادة السرعة." }, capabilities: ["automation", "operations", "monitoring", "reporting"], technologies: ["n8n", "API Integration", "Webhooks"] },
];

export const solutions: PublicSolution[] = [
  { slug: "integrated-it-management", title: { fa: "مدیریت یکپارچه IT", en: "Integrated IT Management", "ar-ae": "الإدارة المتكاملة لتقنية المعلومات" }, excerpt: { fa: "شبکه، کاربران، امنیت، بکاپ، مانیتورینگ و پشتیبانی در یک ساختار هماهنگ.", en: "Networks, users, security, backup, monitoring and support in one coordinated structure.", "ar-ae": "الشبكات والمستخدمون والأمن والنسخ والمراقبة والدعم ضمن هيكل منسق." }, serviceSlugs: ["managed-it", "monitoring", "network-security", "backup-recovery"] },
  { slug: "it-outsourcing", title: { fa: "برون‌سپاری IT", en: "IT Outsourcing", "ar-ae": "الاستعانة بمصادر خارجية" }, excerpt: { fa: "دسترسی به تخصص‌های فناوری اطلاعات بدون ایجاد و مدیریت یک تیم کامل داخلی.", en: "Access multiple IT disciplines without building and managing a complete internal team.", "ar-ae": "الوصول إلى تخصصات تقنية متعددة دون إنشاء وإدارة فريق داخلي كامل." }, serviceSlugs: ["managed-it", "remote-management", "monitoring"] },
  { slug: "security-continuity", title: { fa: "امنیت و تداوم کسب‌وکار", en: "Security & Business Continuity", "ar-ae": "الأمن واستمرارية الأعمال" }, excerpt: { fa: "کنترل دسترسی، امنیت زیرساخت، بکاپ، مانیتورینگ و برنامه بازیابی برای کاهش ریسک.", en: "Access control, infrastructure security, backup, monitoring and recovery planning to reduce risk.", "ar-ae": "ضبط الوصول وأمن البنية والنسخ والمراقبة وخطة الاستعادة لتقليل المخاطر." }, serviceSlugs: ["network-security", "identity-access", "backup-recovery", "monitoring"] },
  { slug: "branch-management", title: { fa: "مدیریت شعب و دفاتر", en: "Multi-site & Branch Management", "ar-ae": "إدارة الفروع والمواقع" }, excerpt: { fa: "ارتباط امن و قابل مدیریت میان دفتر مرکزی، شعب، کاربران و سرویس‌های سازمانی.", en: "Secure, manageable connectivity between headquarters, branches, users and services.", "ar-ae": "اتصال آمن وقابل للإدارة بين المقر والفروع والمستخدمين والخدمات." }, serviceSlugs: ["network-security", "monitoring", "remote-management", "business-telephony"] },
  { slug: "digital-workplace", title: { fa: "محیط کار دیجیتال", en: "Digital Workplace", "ar-ae": "مكان العمل الرقمي" }, excerpt: { fa: "دسترسی کنترل‌شده به فایل‌ها، ابزارهای همکاری، Office Online و منابع کاری.", en: "Controlled access to files, collaboration tools, online office and work resources.", "ar-ae": "وصول منضبط إلى الملفات وأدوات التعاون والمكتب عبر الإنترنت وموارد العمل." }, serviceSlugs: ["digital-workspace", "identity-access", "remote-management"] },
  { slug: "process-automation", title: { fa: "اتوماسیون فرایندها", en: "Process Automation", "ar-ae": "أتمتة العمليات" }, excerpt: { fa: "اتصال سیستم‌ها و خودکارسازی کارهای تکراری برای کاهش عملیات دستی و افزایش مقیاس‌پذیری.", en: "Connect systems and automate repetitive work to reduce manual operations and improve scale.", "ar-ae": "ربط الأنظمة وأتمتة الأعمال المتكررة لتقليل العمليات اليدوية وتحسين قابلية التوسع." }, serviceSlugs: ["erp-automation", "it-automation", "monitoring"] },
];

export const pageCopy = {
  fa: {
    servicesTitle: "خدمات مدیریت‌شده فناوری اطلاعات", servicesIntro: "از پشتیبانی کاربران تا امنیت، شبکه، بکاپ و اتوماسیون؛ هر خدمت بخشی از یک مدل عملیاتی یکپارچه است.",
    solutionsTitle: "راهکارهایی برای نیازهای واقعی کسب‌وکار", solutionsIntro: "ابتدا مسئله، وضعیت فعلی و ریسک بررسی می‌شود؛ سپس ترکیب مناسب خدمات و فناوری شکل می‌گیرد.",
    service: "خدمت", solution: "راهکار", details: "مشاهده جزئیات", assessment: "درخواست ارزیابی IT", back: "بازگشت به فهرست",
    overview: "نمای کلی", capabilities: "قابلیت‌های اصلی", technologies: "فناوری‌های مرتبط", process: "مدل ارائه خدمت", related: "خدمات مرتبط",
    processSteps: ["ارزیابی وضعیت", "طراحی محدوده", "اجرای مرحله‌ای", "مدیریت و بهبود"],
  },
  en: {
    servicesTitle: "Managed IT services", servicesIntro: "From user support to security, networking, backup and automation—each service is part of one operating model.",
    solutionsTitle: "Solutions for real business needs", solutionsIntro: "We assess the current state, problem and risk first, then shape the right service and technology mix.",
    service: "Service", solution: "Solution", details: "View details", assessment: "Request IT assessment", back: "Back to list",
    overview: "Overview", capabilities: "Core capabilities", technologies: "Related technologies", process: "Delivery model", related: "Related services",
    processSteps: ["Assess current state", "Design the scope", "Implement in stages", "Manage and improve"],
  },
  "ar-ae": {
    servicesTitle: "خدمات تقنية المعلومات المُدارة", servicesIntro: "من دعم المستخدمين إلى الأمن والشبكات والنسخ والأتمتة؛ كل خدمة جزء من نموذج تشغيلي متكامل.",
    solutionsTitle: "حلول لاحتياجات الأعمال الحقيقية", solutionsIntro: "نقيّم الوضع الحالي والمشكلة والمخاطر أولاً، ثم نصمم مزيج الخدمات والتقنيات المناسب.",
    service: "الخدمة", solution: "الحل", details: "عرض التفاصيل", assessment: "طلب تقييم تقنية المعلومات", back: "العودة إلى القائمة",
    overview: "نظرة عامة", capabilities: "القدرات الأساسية", technologies: "التقنيات المرتبطة", process: "نموذج تقديم الخدمة", related: "الخدمات المرتبطة",
    processSteps: ["تقييم الوضع الحالي", "تصميم النطاق", "التنفيذ على مراحل", "الإدارة والتحسين"],
  },
} as const;

export function localizedServices(locale: Locale): ContentSummary[] {
  return services.map((service) => ({ id: service.slug, key: service.slug, kind: "service", locale, title: service.title[locale], slug: service.slug, url: `/${locale}/services/${service.slug}`, excerpt: service.excerpt[locale] }));
}

export function localizedSolutions(locale: Locale): ContentSummary[] {
  return solutions.map((solution) => ({ id: solution.slug, key: solution.slug, kind: "solution", locale, title: solution.title[locale], slug: solution.slug, url: `/${locale}/solutions/${solution.slug}`, excerpt: solution.excerpt[locale] }));
}

export function getService(slug: string) { return services.find((service) => service.slug === slug); }
export function getSolution(slug: string) { return solutions.find((solution) => solution.slug === slug); }
export function getCapability(key: CapabilityKey) { return capabilityData[key]; }

const packageNames: Record<string, Localized> = {
  essential: { fa: "پایه", en: "Essential", "ar-ae": "الأساسية" },
  standard: { fa: "استاندارد", en: "Standard", "ar-ae": "القياسية" },
  professional: { fa: "حرفه‌ای", en: "Professional", "ar-ae": "الاحترافية" },
  business: { fa: "سازمانی", en: "Business", "ar-ae": "الأعمال" },
  enterprise: { fa: "سازمانی پلاس", en: "Enterprise", "ar-ae": "المؤسسات" },
};

const packageRows = [
  ["essential", 1, 12_950_000, 5, 6, 0, 1, 1_590_000, 790_000, "حداکثر ۸ ساعت کاری", "Up to 8 business hours", "حتى 8 ساعات عمل"],
  ["standard", 2, 19_500_000, 10, 12, 1, 1, 1_990_000, 990_000, "حداکثر ۴ ساعت کاری", "Up to 4 business hours", "حتى 4 ساعات عمل"],
  ["professional", 3, 32_900_000, 15, 20, 2, 2, 2_690_000, 1_290_000, "حداکثر ۲ ساعت کاری", "Up to 2 business hours", "حتى ساعتَي عمل"],
  ["business", 4, 52_900_000, 25, 35, 4, 3, 3_790_000, 1_790_000, "حداکثر ۱ ساعت کاری", "Up to 1 business hour", "حتى ساعة عمل واحدة"],
  ["enterprise", 5, 79_900_000, 40, 60, 8, 5, 4_990_000, 2_490_000, "P1 حداکثر ۳۰ دقیقه", "P1 up to 30 minutes", "P1 حتى 30 دقيقة"],
] as const;

export function localizedPackages(locale: Locale): Package[] {
  return packageRows.map(([key, order, base, users, endpoints, servers, sites, userRate, endpointRate, faSla, enSla, arSla]) => ({
    key, order, name: packageNames[key][locale], audience: "", description: "", base_monthly_toman: base, currency: "TOMAN",
    included_users: users, included_endpoints: endpoints, included_servers: servers, included_sites: sites,
    sla: locale === "fa" ? faSla : locale === "en" ? enSla : arSla,
    addon_rates: { user: userRate, endpoint: endpointRate }, is_featured: key === "professional",
  }));
}

export function staticNavigation(locale: Locale): NavigationItem[] {
  const labels = {
    fa: ["خانه", "خدمات", "راهکارها", "تعرفه‌ها", "دانش و منابع", "اخبار و رسانه", "درباره AbrIT", "تماس"],
    en: ["Home", "Services", "Solutions", "Pricing", "Knowledge", "News & Media", "About AbrIT", "Contact"],
    "ar-ae": ["الرئيسية", "الخدمات", "الحلول", "الأسعار", "المعرفة", "الأخبار والإعلام", "عن AbrIT", "اتصل بنا"],
  }[locale];
  const paths = ["", "services", "solutions", "pricing", "knowledge", "news", "about", "contact"];
  return paths.map((path, index) => ({ id: `static-${index}`, title: labels[index], description: "", url: `/${locale}${path ? `/${path}` : ""}`, icon: "", column: 1, open_in_new_tab: false, featured_image: null, children: [] }));
}

export function staticSettings(locale: Locale): SiteSettings {
  const location = { fa: "ایران، مشهد", en: "Iran, Mashhad", "ar-ae": "إيران، مشهد" }[locale];
  return { brand_name: "AbrIT", phone: "05131881000", email: "", default_locale: "fa", customer_portal_url: "", location, address: "", seo: { title: "AbrIT", description: pageCopy[locale].servicesIntro }, logo_url: null };
}
