"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type FocusEvent, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent } from "react";
import { Brand } from "./brand";
import { localeMeta, locales, ui } from "@/lib/locales";
import { localizedSolutions } from "@/lib/public-content";
import type { Locale, NavigationItem } from "@/lib/types";

type ProductMenuEntry = {
  id: string;
  title: string;
  description: string;
  path: string;
};

type MegaMenuId = "products" | "solutions" | "editorial";

const productMenu: Record<
  Locale,
  {
    packagesLabel: string;
    packages: ProductMenuEntry[];
    managedLabel: string;
    managed: ProductMenuEntry[];
    independentLabel: string;
    independent: ProductMenuEntry[];
  }
> = {
  fa: {
    packagesLabel: "پکیج‌های خدمات مدیریت‌شده",
    packages: [
      {
        id: "basic",
        title: "پکیج پایه",
        description: "شروع مطمئن برای کسب‌وکارهای کوچک",
        path: "products?package=basic",
      },
      {
        id: "standard",
        title: "پکیج استاندارد",
        description: "مدیریت متمرکز کاربران و دسترسی‌ها",
        path: "products?package=standard",
      },
      {
        id: "advanced",
        title: "پکیج پیشرفته",
        description: "ارتباط امن برای شعب و کاربران دورکار",
        path: "products?package=advanced",
      },
      {
        id: "professional",
        title: "پکیج حرفه‌ای",
        description: "کنترل تخصصی شبکه و زیرساخت",
        path: "products?package=professional",
      },
      {
        id: "premium",
        title: "پکیج ممتاز",
        description: "مدیریت جامع و پایش مستمر فناوری اطلاعات",
        path: "products?package=premium",
      },
    ],
    managedLabel: "سرویس‌های مدیریت‌شده",
    managed: [
      {
        id: "workspace",
        title: "فضای کار ابریت",
        description: "همکاری تیمی متمرکز",
        path: "services/digital-workspace",
      },
      {
        id: "cloud-storage",
        title: "ذخیره‌سازی ابری",
        description: "ذخیره‌سازی ابری امن",
        path: "services/digital-workspace",
      },
      {
        id: "voice",
        title: "تلفن اینترنتی ابریت",
        description: "تماس اینترنتی باکیفیت",
        path: "services/business-telephony",
      },
      {
        id: "erp",
        title: "برنامه‌ریزی منابع سازمانی",
        description: "مدیریت جامع منابع",
        path: "services/erp-automation",
      },
      {
        id: "automation",
        title: "خودکارسازی",
        description: "خودکارسازی جریان کاری",
        path: "services/it-automation",
      },
      {
        id: "assessment",
        title: "ارزیابی فناوری اطلاعات و امنیت",
        description: "ارزیابی امنیتی زیرساخت",
        path: "contact",
      },
      {
        id: "backup",
        title: "پشتیبان‌گیری",
        description: "حفظ داده‌های حیاتی",
        path: "services/backup-recovery",
      },
      {
        id: "antivirus",
        title: "آنتی‌ویروس",
        description: "دفاع ضدبدافزار",
        path: "services/network-security",
      },
      {
        id: "integration",
        title: "یکپارچه‌سازی سازمانی",
        description: "همگام‌سازی ابزارهای سازمانی",
        path: "services/it-automation",
      },
    ],
    independentLabel: "محصولات مستقل",
    independent: [
      {
        id: "independent-backup",
        title: "ابریت Backup",
        description: "پشتیبان‌گیری و بازیابی مدیریت‌شده",
        path: "independent-services/backup",
      },
      {
        id: "independent-cloud-storage",
        title: "ابریت Cloud Storage",
        description: "فضای فایل سازمانی امن و متمرکز",
        path: "independent-services/cloud-storage",
      },
      {
        id: "independent-workspace",
        title: "ابریت Workspace",
        description: "فایل، اسناد و همکاری تیمی",
        path: "independent-services/workspace",
      },
      {
        id: "independent-voice",
        title: "ابریت Voice",
        description: "تلفن سازمانی و ارتباط شعب",
        path: "independent-services/voice",
      },
    ],
  },
  en: {
    packagesLabel: "Managed service packages",
    packages: [
      {
        id: "basic",
        title: "Basic",
        description: "A confident start for small businesses",
        path: "products?package=basic",
      },
      {
        id: "standard",
        title: "Standard",
        description: "Centralized user and access management",
        path: "products?package=standard",
      },
      {
        id: "advanced",
        title: "Advanced",
        description: "Secure connectivity for branches and remote users",
        path: "products?package=advanced",
      },
      {
        id: "professional",
        title: "Professional",
        description: "Specialist network and infrastructure control",
        path: "products?package=professional",
      },
      {
        id: "premium",
        title: "Premium",
        description: "Complete IT management and monitoring",
        path: "products?package=premium",
      },
    ],
    managedLabel: "Managed services",
    managed: [
      {
        id: "workspace",
        title: "AbrIT Workspace",
        description: "Centralized team collaboration",
        path: "services/digital-workspace",
      },
      {
        id: "cloud-storage",
        title: "Cloud Storage",
        description: "Secure cloud storage",
        path: "services/digital-workspace",
      },
      {
        id: "voice",
        title: "AbrIT Voice / VoIP",
        description: "High-quality internet calling",
        path: "services/business-telephony",
      },
      {
        id: "erp",
        title: "ERP",
        description: "Integrated resource management",
        path: "services/erp-automation",
      },
      {
        id: "automation",
        title: "Automation",
        description: "Workflow automation",
        path: "services/it-automation",
      },
      {
        id: "assessment",
        title: "IT & Security Assessment",
        description: "Infrastructure security assessment",
        path: "contact",
      },
      {
        id: "backup",
        title: "Backup",
        description: "Protecting critical data",
        path: "services/backup-recovery",
      },
      {
        id: "antivirus",
        title: "Antivirus",
        description: "Anti-malware protection",
        path: "services/network-security",
      },
      {
        id: "integration",
        title: "Organizational integration",
        description: "Synchronizing organizational tools",
        path: "services/it-automation",
      },
    ],
    independentLabel: "Independent products",
    independent: [
      {
        id: "independent-backup",
        title: "AbrIT Backup",
        description: "Managed backup and recovery",
        path: "independent-services/backup",
      },
      {
        id: "independent-cloud-storage",
        title: "AbrIT Cloud Storage",
        description: "Secure organizational file space",
        path: "independent-services/cloud-storage",
      },
      {
        id: "independent-workspace",
        title: "AbrIT Workspace",
        description: "Files, documents and collaboration",
        path: "independent-services/workspace",
      },
      {
        id: "independent-voice",
        title: "AbrIT Voice",
        description: "Business telephony and branch calling",
        path: "independent-services/voice",
      },
    ],
  },
  "ar-ae": {
    packagesLabel: "باقات الخدمات المُدارة",
    packages: [
      {
        id: "basic",
        title: "الباقة الأساسية",
        description: "بداية موثوقة للشركات الصغيرة",
        path: "products?package=basic",
      },
      {
        id: "standard",
        title: "الباقة القياسية",
        description: "إدارة مركزية للمستخدمين والصلاحيات",
        path: "products?package=standard",
      },
      {
        id: "advanced",
        title: "الباقة المتقدمة",
        description: "اتصال آمن للفروع والمستخدمين عن بُعد",
        path: "products?package=advanced",
      },
      {
        id: "professional",
        title: "الباقة الاحترافية",
        description: "تحكم متخصص بالشبكة والبنية التحتية",
        path: "products?package=professional",
      },
      {
        id: "premium",
        title: "الباقة الممتازة",
        description: "إدارة شاملة ومراقبة مستمرة",
        path: "products?package=premium",
      },
    ],
    managedLabel: "الخدمات المُدارة",
    managed: [
      {
        id: "workspace",
        title: "AbrIT Workspace",
        description: "تعاون مركزي للفرق",
        path: "services/digital-workspace",
      },
      {
        id: "cloud-storage",
        title: "Cloud Storage",
        description: "تخزين سحابي آمن",
        path: "services/digital-workspace",
      },
      {
        id: "voice",
        title: "AbrIT Voice / VoIP",
        description: "اتصالات إنترنت عالية الجودة",
        path: "services/business-telephony",
      },
      {
        id: "erp",
        title: "ERP",
        description: "إدارة شاملة للموارد",
        path: "services/erp-automation",
      },
      {
        id: "automation",
        title: "Automation",
        description: "أتمتة سير العمل",
        path: "services/it-automation",
      },
      {
        id: "assessment",
        title: "IT & Security Assessment",
        description: "تقييم أمن البنية التحتية",
        path: "contact",
      },
      {
        id: "backup",
        title: "Backup",
        description: "حماية البيانات الحيوية",
        path: "services/backup-recovery",
      },
      {
        id: "antivirus",
        title: "Antivirus",
        description: "حماية من البرمجيات الخبيثة",
        path: "services/network-security",
      },
      {
        id: "integration",
        title: "التكامل المؤسسي",
        description: "مزامنة أدوات المؤسسة",
        path: "services/it-automation",
      },
    ],
    independentLabel: "منتجات مستقلة",
    independent: [
      {
        id: "independent-backup",
        title: "AbrIT Backup",
        description: "نسخ واستعادة مُداران",
        path: "independent-services/backup",
      },
      {
        id: "independent-cloud-storage",
        title: "AbrIT Cloud Storage",
        description: "مساحة ملفات مؤسسية آمنة",
        path: "independent-services/cloud-storage",
      },
      {
        id: "independent-workspace",
        title: "AbrIT Workspace",
        description: "ملفات ومستندات وتعاون",
        path: "independent-services/workspace",
      },
      {
        id: "independent-voice",
        title: "AbrIT Voice",
        description: "اتصالات مؤسسية وربط الفروع",
        path: "independent-services/voice",
      },
    ],
  },
};

const editorialMenu: Record<
  Locale,
  { summary: string; entries: ProductMenuEntry[] }
> = {
  fa: {
    summary: "مقاله‌ها، تازه‌های ابریت و راهنماهای کاربردی فناوری اطلاعات.",
    entries: [
      {
        id: "blog",
        title: "وبلاگ",
        description: "مقاله‌ها، خبرها و تازه‌های ابریت",
        path: "news",
      },
      {
        id: "knowledge",
        title: "دانش و منابع",
        description: "راهنماها و منابع کاربردی مدیریت فناوری اطلاعات",
        path: "knowledge",
      },
    ],
  },
  en: {
    summary: "Articles, AbrIT updates and practical IT guidance.",
    entries: [
      {
        id: "blog",
        title: "Blog",
        description: "Articles, news and updates from AbrIT",
        path: "news",
      },
      {
        id: "knowledge",
        title: "Knowledge & Resources",
        description: "Practical guides and resources for IT management",
        path: "knowledge",
      },
    ],
  },
  "ar-ae": {
    summary: "مقالات ومستجدات AbrIT وأدلة عملية لتقنية المعلومات.",
    entries: [
      {
        id: "blog",
        title: "المدونة",
        description: "مقالات وأخبار ومستجدات AbrIT",
        path: "news",
      },
      {
        id: "knowledge",
        title: "المعرفة والموارد",
        description: "أدلة وموارد عملية لإدارة تقنية المعلومات",
        path: "knowledge",
      },
    ],
  },
};

export function SiteHeader({
  locale,
  items,
}: {
  locale: Locale;
  items: NavigationItem[];
}) {
  const [open, setOpen] = useState(false);
  const [activeMega, setActiveMega] = useState<MegaMenuId | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const labels = ui[locale];
  const solutionItems = localizedSolutions(locale);
  const products = productMenu[locale];
  const editorial = editorialMenu[locale];
  const localeAbbreviations: Record<Locale, string> = {
    fa: "FA",
    en: "EN",
    "ar-ae": "AR",
  };

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 40);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  function localizedPath(nextLocale: Locale) {
    const segments = pathname.split("/");
    segments[1] = nextLocale;
    return segments.join("/") || `/${nextLocale}`;
  }

  function handleLocalizedAlternate(event: MouseEvent<HTMLAnchorElement>, nextLocale: Locale) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const alternate = document.querySelector<HTMLLinkElement>(`link[rel="alternate"][hreflang="${localeMeta[nextLocale].lang}"]`);
    if (!alternate?.href) return;
    event.preventDefault();
    window.location.assign(alternate.href);
  }

  function closeNavigation() {
    setOpen(false);
    setActiveMega(null);
  }

  function megaMenuProps(menu: MegaMenuId) {
    return {
      "data-mega-open": activeMega === menu ? "true" : undefined,
      onPointerEnter: () => setActiveMega(menu),
      onPointerLeave: () => setActiveMega((current) => current === menu ? null : current),
      onFocus: () => setActiveMega(menu),
      onBlur: (event: FocusEvent<HTMLDivElement>) => {
        if (!(event.relatedTarget instanceof Node) || !event.currentTarget.contains(event.relatedTarget)) {
          setActiveMega((current) => current === menu ? null : current);
        }
      },
    };
  }

  function closeMegaMenuFromKeyboard(event: ReactKeyboardEvent<HTMLElement>) {
    if (event.key !== "Escape") return;
    if (activeMega) {
      event.preventDefault();
      event.currentTarget.querySelector<HTMLElement>("[aria-expanded=true]")?.focus();
      setActiveMega(null);
    } else if (open) {
      setOpen(false);
      document.querySelector<HTMLElement>(".menu-toggle")?.focus();
    }
  }

  return (
    <header
      className="site-header"
      data-scrolled={scrolled ? "true" : undefined}
    >
      <div className="container header-inner">
        <Brand locale={locale} />
        <button
          className="menu-toggle"
          type="button"
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? labels.close : labels.menu}</span>
          <span aria-hidden="true">{open ? "×" : "☰"}</span>
        </button>
        <nav
          id="site-navigation"
          className={open ? "main-nav is-open" : "main-nav"}
          aria-label={labels.navigation}
          onKeyDown={closeMegaMenuFromKeyboard}
        >
          {items.map((item, index) => {
            const isProducts = item.url === `/${locale}/products`;
            const isSolutions = item.url === `/${locale}/solutions`;
            const isEditorial = item.url === `/${locale}/news`;
            const submenu = isSolutions ? solutionItems : null;
            if (isProducts) {
              return (
                <div className="shared-nav-item" key={item.id} {...megaMenuProps("products")}>
                  <Link
                    className="shared-nav-trigger"
                    href={item.url}
                    aria-haspopup="true"
                    aria-expanded={activeMega === "products"}
                    aria-controls="products-mega-menu"
                    onClick={closeNavigation}
                  >
                    {item.title}
                    <span aria-hidden="true">⌄</span>
                  </Link>
                  <div className="shared-mega shared-products-mega" id="products-mega-menu">
                    <div className="product-menu-content">
                      <section className="product-menu-section">
                        <div className="product-menu-heading">
                          <span>{products.packagesLabel}</span>
                          <Link
                            href={`/${locale}/products`}
                            onClick={() => setOpen(false)}
                          >
                            {ui[locale].explore} ←
                          </Link>
                        </div>
                        <div className="product-package-grid">
                          {products.packages.map((entry) => (
                            <Link
                              href={`/${locale}/${entry.path}`}
                              key={entry.id}
                              onClick={() => setOpen(false)}
                            >
                              <b>{entry.title}</b>
                              <small>{entry.description}</small>
                            </Link>
                          ))}
                        </div>
                      </section>
                      <section className="product-menu-section product-managed-section">
                        <div className="product-menu-heading">
                          <span>{products.managedLabel}</span>
                        </div>
                        <div className="product-managed-grid">
                          {products.managed.map((entry) => (
                            <Link
                              href={`/${locale}/${entry.path}`}
                              key={entry.id}
                              onClick={() => setOpen(false)}
                            >
                              <b>{entry.title}</b>
                              <small>{entry.description}</small>
                            </Link>
                          ))}
                        </div>
                      </section>
                    </div>
                    <aside className="shared-mega-summary product-menu-summary">
                      <span>ABRIT</span>
                      <b>{item.title}</b>
                      <p>{ui[locale].packages}</p>
                      <div className="product-independent">
                        <a
                          href={`/${locale}/independent-services`}
                          onClick={() => setOpen(false)}
                        >
                          {products.independentLabel}{" "}
                          <span aria-hidden="true">←</span>
                        </a>
                        <div>
                          {products.independent.map((entry) => (
                            <a
                              href={`/${locale}/${entry.path}`}
                              key={entry.id}
                              onClick={() => setOpen(false)}
                            >
                              <b>{entry.title}</b>
                              <small>{entry.description}</small>
                            </a>
                          ))}
                        </div>
                      </div>
                    </aside>
                  </div>
                </div>
              );
            }
            if (isEditorial) {
              return (
                <div className="shared-nav-item" key={item.id} {...megaMenuProps("editorial")}>
                  <Link
                    className="shared-nav-trigger"
                    href={item.url}
                    aria-haspopup="true"
                    aria-expanded={activeMega === "editorial"}
                    aria-controls="editorial-mega-menu"
                    onClick={closeNavigation}
                  >
                    {item.title}
                    <span aria-hidden="true">⌄</span>
                  </Link>
                  <div className="shared-mega shared-editorial-mega" id="editorial-mega-menu">
                    <div className="shared-mega-list">
                      {editorial.entries.map((entry) => (
                        <Link
                          href={`/${locale}/${entry.path}`}
                          key={entry.id}
                          onClick={() => setOpen(false)}
                        >
                          <b>{entry.title}</b>
                          <small>{entry.description}</small>
                        </Link>
                      ))}
                    </div>
                    <aside className="shared-mega-summary">
                      <span>ABRIT</span>
                      <b>{item.title}</b>
                      <p>{editorial.summary}</p>
                      <Link href={item.url} onClick={() => setOpen(false)}>
                        {ui[locale].explore} →
                      </Link>
                    </aside>
                  </div>
                </div>
              );
            }
            if (!submenu) {
              return (
                <Link
                  key={item.id}
                  href={item.url}
                  target={item.open_in_new_tab ? "_blank" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.title}
                </Link>
              );
            }

            const renderLinks = (entries: typeof submenu) =>
              entries.map((entry) => (
                <Link
                  key={entry.id}
                  href={entry.url}
                  onClick={() => setOpen(false)}
                >
                  <b>{entry.title}</b>
                  <small>{entry.excerpt}</small>
                </Link>
              ));

            return (
              <div className="shared-nav-item" key={item.id} {...megaMenuProps("solutions")}>
                <Link
                  className="shared-nav-trigger"
                  href={item.url}
                  aria-haspopup="true"
                  aria-expanded={activeMega === "solutions"}
                  aria-controls="solutions-mega-menu"
                  onClick={closeNavigation}
                >
                  {item.title}
                  <span aria-hidden="true">⌄</span>
                </Link>
                <div className="shared-mega" id="solutions-mega-menu">
                  <div className="shared-mega-list">{renderLinks(submenu)}</div>
                  <aside className="shared-mega-summary">
                    <span>ABRIT</span>
                    <b>{item.title}</b>
                    <p>
                      {index === 1 ? ui[locale].packages : ui[locale].explore}
                    </p>
                    <Link href={item.url} onClick={() => setOpen(false)}>
                      {ui[locale].explore} →
                    </Link>
                  </aside>
                </div>
              </div>
            );
          })}
        </nav>
        <div className="header-tools">
          <Link
            className="header-search"
            href={`/${locale}/search`}
            aria-label={
              locale === "fa" ? "جست‌وجو" : locale === "en" ? "Search" : "بحث"
            }
          >
            <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4 4" />
            </svg>
          </Link>
          <details className="language-switcher">
            <summary aria-label={locale === "fa" ? "تغییر زبان" : locale === "en" ? "Change language" : "تغيير اللغة"}>
              <span aria-hidden="true" className="language-flag">{localeAbbreviations[locale]}</span>
              <span>{localeMeta[locale].label}</span>
            </summary>
            <div className="language-menu">
              {locales.map((item) => (
                <Link
                  key={item}
                  href={localizedPath(item)}
                  className={item === locale ? "is-active" : ""}
                  lang={localeMeta[item].lang}
                  hrefLang={localeMeta[item].lang}
                  aria-current={item === locale ? "page" : undefined}
                  onClick={(event) => handleLocalizedAlternate(event, item)}
                >
                  <span aria-hidden="true" className="language-flag">{localeAbbreviations[item]}</span>
                  <span>{localeMeta[item].label}</span>
                </Link>
              ))}
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
