import type { Locale } from "./types";

export const internalCopy = {
  fa: {
    servicesEyebrow: "MANAGED IT SERVICES", servicesTitle: "خدمات مدیریت‌شده فناوری اطلاعات",
    servicesIntro: "از پشتیبانی کاربران تا امنیت، شبکه، بکاپ و اتوماسیون؛ هر خدمت بخشی از یک مدل عملیاتی یکپارچه است.",
    solutionsEyebrow: "BUSINESS SOLUTIONS", solutionsTitle: "راهکارهایی بر اساس نیاز واقعی کسب‌وکار",
    solutionsIntro: "مسئله و ریسک را می‌سنجیم و سپس ترکیب مناسب خدمات و فناوری را طراحی می‌کنیم.",
    pricingEyebrow: "MSP PACKAGES · 1405", pricingTitle: "پکیج مناسب ظرفیت و سطح خدمت خود را پیدا کنید",
    pricingIntro: "محاسبه‌ی شفاف بر اساس پکیج پایه، تعداد کاربران، Endpointها و مدت قرارداد انجام می‌شود.",
    service: "خدمت", solution: "راهکار", readMore: "مشاهده جزئیات", back: "بازگشت به فهرست",
    assessment: "درخواست ارزیابی IT", included: "ظرفیت پایه", users: "کاربر", endpoints: "Endpoint",
    servers: "سرور", sites: "سایت", monthly: "تومان / ماه", configure: "تنظیم پکیج",
  },
  en: {
    servicesEyebrow: "MANAGED IT SERVICES", servicesTitle: "Managed IT services",
    servicesIntro: "From user support to security, networking, backup and automation—each service is part of one integrated operating model.",
    solutionsEyebrow: "BUSINESS SOLUTIONS", solutionsTitle: "Solutions shaped around real business needs",
    solutionsIntro: "We assess the problem and risk first, then design the right service and technology mix.",
    pricingEyebrow: "MSP PACKAGES · 2026", pricingTitle: "Find the right capacity and service level",
    pricingIntro: "Transparent calculation based on the base package, users, endpoints and contract duration.",
    service: "Service", solution: "Solution", readMore: "View details", back: "Back to list",
    assessment: "Request IT assessment", included: "Base capacity", users: "users", endpoints: "endpoints",
    servers: "servers", sites: "sites", monthly: "Toman / month", configure: "Configure package",
  },
  "ar-ae": {
    servicesEyebrow: "MANAGED IT SERVICES", servicesTitle: "خدمات تقنية المعلومات المُدارة",
    servicesIntro: "من دعم المستخدمين إلى الأمن والشبكات والنسخ والأتمتة؛ كل خدمة جزء من نموذج تشغيلي متكامل.",
    solutionsEyebrow: "BUSINESS SOLUTIONS", solutionsTitle: "حلول مبنية على احتياجات الأعمال الحقيقية",
    solutionsIntro: "نقيّم المشكلة والمخاطر أولاً، ثم نصمم المزيج المناسب من الخدمات والتقنيات.",
    pricingEyebrow: "MSP PACKAGES · 2026", pricingTitle: "اختر السعة ومستوى الخدمة المناسبين",
    pricingIntro: "حساب واضح بناءً على الباقة الأساسية والمستخدمين والأجهزة ومدة العقد.",
    service: "الخدمة", solution: "الحل", readMore: "عرض التفاصيل", back: "العودة إلى القائمة",
    assessment: "طلب تقييم تقنية المعلومات", included: "السعة الأساسية", users: "مستخدمين", endpoints: "أجهزة",
    servers: "خوادم", sites: "مواقع", monthly: "تومان / شهرياً", configure: "إعداد الباقة",
  },
} satisfies Record<Locale, Record<string, string>>;
