import type { Locale } from "./types";

export const locales: Locale[] = ["fa", "en", "ar-ae"];

export const localeMeta: Record<Locale, { lang: string; dir: "rtl" | "ltr"; label: string; short: string }> = {
  fa: { lang: "fa", dir: "rtl", label: "فارسی", short: "فا" },
  en: { lang: "en", dir: "ltr", label: "English", short: "EN" },
  "ar-ae": { lang: "ar-AE", dir: "rtl", label: "العربية", short: "ع" },
};

export const ui = {
  fa: {
    skip: "رفتن به محتوای اصلی",
    menu: "باز کردن منو",
    close: "بستن منو",
    navigation: "منوی اصلی",
    explore: "جزئیات خدمت",
    configure: "مشاهده و تنظیم",
    monthly: "تومان / ماه",
    users: "کاربر",
    endpoints: "دستگاه",
    servers: "سرور",
    sites: "سایت",
    packages: "پکیج‌های خدمات مدیریت‌شده",
    contact: "درخواست ارزیابی فناوری اطلاعات",
    unavailable: "در حال حاضر امکان دریافت محتوای سایت وجود ندارد.",
    rights: "تمام حقوق محفوظ است.",
  },
  en: {
    skip: "Skip to main content",
    menu: "Open menu",
    close: "Close menu",
    navigation: "Main navigation",
    explore: "Explore service",
    configure: "View and configure",
    monthly: "Toman / month",
    users: "users",
    endpoints: "endpoints",
    servers: "servers",
    sites: "sites",
    packages: "Managed service packages",
    contact: "Request IT assessment",
    unavailable: "The site content is temporarily unavailable.",
    rights: "All rights reserved.",
  },
  "ar-ae": {
    skip: "انتقل إلى المحتوى الرئيسي",
    menu: "فتح القائمة",
    close: "إغلاق القائمة",
    navigation: "التنقل الرئيسي",
    explore: "تفاصيل الخدمة",
    configure: "عرض وإعداد",
    monthly: "تومان / شهرياً",
    users: "مستخدمين",
    endpoints: "أجهزة",
    servers: "خوادم",
    sites: "مواقع",
    packages: "باقات الخدمات المُدارة",
    contact: "طلب تقييم تقنية المعلومات",
    unavailable: "محتوى الموقع غير متاح مؤقتاً.",
    rights: "جميع الحقوق محفوظة.",
  },
} satisfies Record<Locale, Record<string, string>>;

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}
