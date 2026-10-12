import { createRequire } from "node:module";
import { getPayload, type Payload } from "payload";
import { defaultLocale, locales, type Locale } from "@/lib/site-config";
import { normalizeSearchText } from "@/lib/search-normalization";
import type { Content, Form, Navigation } from "@/payload-types";

const { loadEnvConfig } = createRequire(import.meta.url)("@next/env") as typeof import("@next/env");
loadEnvConfig(process.cwd());
Reflect.set(process.env, "NODE_ENV", "production");

const siteName = process.env.STARTER_SITE_NAME?.trim() || "Abrit";

type Pair = [string, string];

type LocaleCopy = {
  brand: string;
  homeTitle: string; homeExcerpt: string; heroBody: string; ctaLabel: string;
  diffEyebrow: string; diffTitle: string; diffBody: string; diffs: string[];
  staticTitle: string; staticBody: string;
  benTitle: string; bens: Pair[];
  svcTitle: string; svcIntro: string; svcs: Pair[];
  solTitle: string; solIntro: string; sols: Pair[];
  procTitle: string; steps: Pair[];
  techTitle: string; techIntro: string; techs: Pair[];
  ctaTitle: string; ctaBody: string;
  backupTitle: string; backupExcerpt: string; backupEyebrow: string; backupPrimary: string; backupSecondary: string;
  bStripTitle: string; bStrip: Pair[];
  bWhatTitle: string; bWhatBody: string;
  bWhy1Title: string; bWhy1: Pair[]; bProtTitle: string; bProtIntro: string; bProt: Pair[];
  bAdvTitle: string; bAdvIntro: string; bAdv: Pair[];
  bFlowTitle: string; bFlow: Pair[];
  bTechTitle: string; bTechIntro: string; bTech: Pair[];
  bShowTitle: string; bShowIntro: string; bShow: Pair[];
  bPathTitle: string; bPath: Pair[];
  bCtaTitle: string; bCtaBody: string;
  contactTitle: string; contactExcerpt: string; formTitle: string; formDescription: string; success: string; consent: string;
  navHome: string; navServices: string; navBackup: string; navContact: string;
  navSolutions: string; navAbout: string; navBlog: string; navKnowledge: string;
  seoHomeTitle: string; seoHomeDesc: string; seoBackupTitle: string; seoBackupDesc: string;
  svcMenu: Pair[]; footSvc: string[]; footSol: string[]; footAbrit: string[];
};

const copy: Record<Locale, LocaleCopy> = {
  fa: {
    brand: "Abrit",
    homeTitle: "یک شریک برای تمام مسیر فناوری اطلاعات شما",
    homeExcerpt: "ابریت فناوری اطلاعات سازمان شما را از مجموعه‌ای پراکنده از سیستم‌ها، کاربران و سرویس‌ها، به یک زیرساخت یکپارچه، امن، پایدار و پاسخ‌گو تبدیل می‌کند. از مدیریت کاربران و شبکه تا پشتیبانی، امنیت، بکاپ، مانیتورینگ و اتوماسیون؛ همه‌چیز در قالب یک سرویس مدیریت‌شده و متناسب با نیاز کسب‌وکار شما.",
    heroBody: "فناوری اطلاعات شرکت شما، یکپارچه و تحت مدیریت\n\nابریت فناوری اطلاعات سازمان شما را از مجموعه‌ای پراکنده از سیستم‌ها، کاربران و سرویس‌ها، به یک زیرساخت یکپارچه، امن، پایدار و پاسخ‌گو تبدیل می‌کند. از مدیریت کاربران و شبکه تا پشتیبانی، امنیت، بکاپ، مانیتورینگ و اتوماسیون؛ همه‌چیز در قالب یک سرویس مدیریت‌شده و متناسب با نیاز کسب‌وکار شما.",
    ctaLabel: "درخواست ارزیابی IT",
    diffEyebrow: "تفاوت Abrit",
    diffTitle: "بیشتر از پشتیبانی؛ مدیریت فناوری اطلاعات",
    diffBody: "مدل Abrit بر حل موردی مشکلات متکی نیست. هدف این است که IT سازمان قابل مشاهده، مستند، قابل کنترل و قابل توسعه باشد. به همین دلیل Monitoring، Ticketing، Documentation، Backup، Security و Automation در کنار پشتیبانی فنی قرار می‌گیرند تا فناوری اطلاعات به یک سرویس مدیریتی واقعی تبدیل شود.",
    diffs: ["یکپارچگی به‌جای پراکندگی", "پیشگیری به‌جای واکنش صرف", "فرایند به‌جای وابستگی به افراد", "مستندسازی به‌جای دانش شفاهی", "اتوماسیون به‌جای کار تکراری"],
    staticTitle: "IT نباید دغدغه هر روز کسب‌وکار شما باشد",
    staticBody: "فناوری اطلاعات امروز بخشی از دارایی و زیرساخت حیاتی هر کسب‌وکار است؛ دارایی‌ای که نقش مستقیمی در پایداری، امنیت و رشد سازمان دارد. ابریت با ارائه خدمات Managed IT و IT as a Service، مسئولیت مدیریت یکپارچه فناوری اطلاعات سازمان را بر عهده می‌گیرد؛ از زیرساخت و کاربران تا امنیت، بکاپ، مانیتورینگ و پشتیبانی. ما IT را به‌عنوان بخشی ارزشمند از کسب‌وکار شما مدیریت می‌کنیم؛ منظم، پیشگیرانه و با اطمینان.",
    benTitle: "از سیستم‌های پراکنده تا مدیریت یکپارچه IT",
    bens: [
      ["مدیریت یکپارچه فناوری اطلاعات", "شبکه، کاربران، امنیت، بکاپ، مانیتورینگ و پشتیبانی در یک ساختار هماهنگ."],
      ["پیشگیری از مشکلات IT", "مدیریت منظم و پیشگیرانه به‌جای واکنش به اختلال."],
      ["امنیت و پایداری زیرساخت", "حفاظت از دارایی فناوری اطلاعات و حفظ تداوم سرویس‌ها."],
      ["پشتیبانی و پاسخ‌گویی مستمر", "رسیدگی ساختاریافته به درخواست‌ها و همراهی مستمر."],
      ["توسعه ساختاریافته IT", "فناوری اطلاعات قابل مشاهده، مستند، قابل کنترل و قابل توسعه."],
    ],
    svcTitle: "هرآنچه برای مدیریت حرفه‌ای IT نیاز دارید",
    svcIntro: "ابریت مجموعه‌ای از خدمات فناوری اطلاعات سازمانی را در یک مدل یکپارچه ارائه می‌کند؛ از زیرساخت و امنیت تا مدیریت کاربران، پشتیبانی و اتوماسیون.",
    svcs: [
      ["مدیریت IT", "پشتیبانی کاربران، مدیریت سیستم‌ها، رسیدگی ساختاریافته به درخواست‌ها و مدیریت مستمر زیرساخت فناوری اطلاعات."],
      ["Workspace", "فضای کار سازمانی برای فایل‌ها، اشتراک‌گذاری، همکاری تیمی، Office Online و دسترسی کنترل‌شده به اطلاعات."],
      ["شبکه و امنیت", "طراحی و مدیریت شبکه، Firewall، VPN، Segmentation، ارتباط شعب و دسترسی امن به سرویس‌های سازمان."],
      ["هویت و دسترسی", "مدیریت متمرکز کاربران، Active Directory، LDAP، SSO و دسترسی مبتنی بر نقش و گروه."],
      ["بکاپ و بازیابی", "پشتیبان‌گیری از داده‌ها و سرویس‌های حیاتی، سیاست نگهداری اطلاعات و برنامه‌ریزی برای بازیابی و تداوم کسب‌وکار."],
      ["مانیتورینگ", "پایش شبکه، سرورها و سرویس‌ها با هدف شناسایی اختلال، بررسی ظرفیت و ایجاد فرایند منظم Alert تا Resolution."],
      ["ERP و اتوماسیون", "راهکارهای ERP، CRM، فروش، منابع سازمانی و اتوماسیون فرایندها بر بستر Odoo Enterprise."],
      ["تلفن سازمانی", "راهکارهای VoIP، مرکز تلفن، داخلی‌ها، IVR، ارتباط شعب و مدیریت ارتباطات صوتی سازمان."],
      ["مدیریت از راه دور", "مدیریت متمرکز Endpointها، Remote Support، Inventory، Monitoring و اجرای عملیات مدیریتی روی سیستم‌ها."],
      ["اتوماسیون IT", "خودکارسازی Workflowها، اعلان‌ها، Integrationها و فرایندهای تکراری برای افزایش سرعت و کاهش عملیات دستی."],
    ],
    solTitle: "راهکارهایی برای چالش‌های واقعی کسب‌وکار",
    solIntro: "هر سازمان شرایط و اولویت‌های متفاوتی دارد. در ابریت، راهکار از انتخاب ابزار شروع نمی‌شود؛ ابتدا وضعیت فعلی، نیازها و ریسک‌های کسب‌وکار بررسی می‌شوند و سپس ترکیب مناسبی از خدمات و فناوری برای آن طراحی می‌شود.",
    sols: [
      ["مدیریت یکپارچه IT", "برای سازمان‌هایی که می‌خواهند شبکه، کاربران، امنیت، بکاپ، مانیتورینگ و پشتیبانی را از حالت پراکنده خارج کرده و در یک ساختار هماهنگ مدیریت کنند."],
      ["برون‌سپاری IT", "دسترسی به مجموعه‌ای از تخصص‌های فناوری اطلاعات، بدون نیاز به ایجاد و مدیریت یک تیم کامل IT در داخل سازمان."],
      ["امنیت و تداوم", "ترکیب کنترل دسترسی، امنیت زیرساخت، بکاپ، مانیتورینگ و برنامه بازیابی برای کاهش ریسک و حفظ تداوم فعالیت کسب‌وکار."],
      ["مدیریت شعب و دفاتر", "ایجاد ارتباط امن و قابل مدیریت میان دفتر مرکزی، شعب، کاربران و سرویس‌های سازمانی در یک ساختار منسجم."],
      ["محیط کار سازمانی", "دسترسی کنترل‌شده به فایل‌ها، ابزارهای همکاری، Office Online و منابع کاری برای ایجاد محیطی منظم‌تر و یکپارچه‌تر برای تیم‌ها."],
      ["اتوماسیون فرایندها", "اتصال سیستم‌ها و خودکارسازی کارهای تکراری برای کاهش عملیات دستی، افزایش سرعت و ایجاد فرایندهای قابل تکرار و مقیاس‌پذیر."],
    ],
    procTitle: "از شناخت وضعیت امروز تا مدیریت و بهبود مستمر",
    steps: [
      ["ارزیابی", "وضعیت شبکه، کاربران، سرورها، Storage، Backup، امنیت، Endpointها، Monitoring و فرایند پشتیبانی بررسی می‌شود."],
      ["طراحی", "معماری هدف، مدل دسترسی، برنامه امنیت، Backup، Monitoring و مسیر مهاجرت متناسب با شرایط سازمان طراحی می‌شود."],
      ["اجرا", "تغییرات به‌صورت مرحله‌ای، قابل تست و با درنظرگرفتن Backup، Rollback و حداقل اختلال اجرا می‌شوند."],
      ["مدیریت و بهبود", "سرویس‌ها به‌صورت مستمر پایش و مدیریت می‌شوند و بر اساس رخدادها، ظرفیت، ریسک‌ها و نیازهای جدید سازمان بهبود پیدا می‌کنند."],
    ],
    techTitle: "فناوری و پلتفرم‌ها",
    techIntro: "انتخاب فناوری بر اساس نیاز، نه نام ابزار. در معماری‌های Abrit، فناوری بر اساس پایداری، امنیت، قابلیت پشتیبانی، Integration، Automation، مقیاس‌پذیری و هزینه عملیاتی انتخاب می‌شود.",
    techs: [
      ["مجازی‌سازی و ذخیره‌سازی", "Proxmox · TrueNAS"],
      ["شبکه و امنیت", "pfSense · WireGuard · Cloudflare"],
      ["هویت و دسترسی", "Microsoft Active Directory"],
      ["فضای کار سازمانی", "Nextcloud · OnlyOffice"],
      ["پایش و مدیریت", "NetXMS · TacticalRMM · GLPI"],
      ["کسب‌وکار و اتوماسیون", "Odoo Enterprise · n8n"],
    ],
    ctaTitle: "نیاز به یک نگاه دقیق‌تر به وضعیت IT سازمانتان دارید؟",
    ctaBody: "از زیرساخت و امنیت تا کاربران، بکاپ و مانیتورینگ؛ نقطه شروع، شناخت درست وضعیت فعلی است.",    backupTitle: "اطلاعات سازمان شما، همیشه یک مسیر مطمئن برای بازگشت دارد",
    backupExcerpt: "Abrit Backup پشتیبان‌گیری، پایش و بازیابی اطلاعات و سرویس‌های حیاتی سازمان را در قالب یک فرآیند مدیریت‌شده اجرا می‌کند؛ تا سازمان شما با اطمینان بیشتری به فعالیت خود ادامه دهد.",
    backupEyebrow: "Abrit Backup",
    backupPrimary: "طراحی راهکار Backup سازمانی",
    backupSecondary: "دریافت مشاوره تخصصی",
    bStripTitle: "یک راهکار کامل برای مدیریت چرخه Backup",
    bStrip: [
      ["پشتیبان‌گیری از سرویس‌های سازمانی", "ماشین‌های مجازی، دیتابیس، فایل‌سرور و ERP."],
      ["مدیریت فایل‌ها و داده‌های حیاتی", "اسناد سازمانی، فایل‌های کاربران و پوشه‌های اشتراکی."],
      ["بررسی سلامت نسخه‌های پشتیبان", "پایش مستمر و اطمینان از قابلیت بازیابی."],
      ["بازیابی اطلاعات در زمان نیاز", "بازگشت سریع سرویس‌ها بر اساس برنامه بازیابی."],
    ],
    bWhatTitle: "Abrit Backup چیست؟",
    bWhatBody: "یک سرویس مدیریت‌شده برای پشتیبان‌گیری و بازیابی اطلاعات سازمان. Abrit Backup مجموعه‌ای از فرآیندها و فناوری‌های پشتیبان‌گیری است که از طراحی سیاست Backup و مدیریت نسخه‌ها تا پایش سلامت و بازیابی اطلاعات و سرویس‌های سازمان را پوشش می‌دهد.",
    bWhy1Title: "چرا Backup فقط ذخیره یک کپی از اطلاعات نیست؟",
    bWhy1: [
      ["اطلاعات ارزشمند، نیازمند برنامه مشخص هستند", "داده‌های سازمان بخشی از سرمایه کسب‌وکار هستند و برای حفاظت از آن‌ها به یک فرآیند مشخص نیاز دارند."],
      ["Backup زمانی ارزش واقعی ایجاد می‌کند که مدیریت شود", "پایش سلامت نسخه‌ها، زمان‌بندی مناسب و اطمینان از قابلیت بازیابی، Backup را به یک فرآیند قابل اتکا برای سازمان تبدیل می‌کند."],
      ["سرویس‌های حیاتی به آمادگی بیشتری نیاز دارند", "سرورها، فایل‌ها و نرم‌افزارهای سازمانی باید در شرایط مختلف امکان بازگشت سریع داشته باشند."],
    ],
    bProtTitle: "Abrit Backup چه چیزهایی را محافظت می‌کند؟",
    bProtIntro: "پشتیبان‌گیری برای بخش‌های حیاتی سازمان",
    bProt: [
      ["VM Backup", "محافظت از ماشین‌های مجازی و سرویس‌های سازمانی: Application Server · Database Server · File Server · ERP Server"],
      ["File Backup", "حفاظت از فایل‌ها و اطلاعات کاری: اسناد سازمانی · فایل‌های کاربران · پوشه‌های اشتراکی · داده‌های Workspace"],
      ["Application Backup", "حفظ سرویس‌های مهم سازمان: ERP · Database · Configuration سرویس‌ها"],
    ],
    bAdvTitle: "چرا Abrit Backup؟",
    bAdvIntro: "Backup یک نرم‌افزار نیست؛ یک مسئولیت عملیاتی است",
    bAdv: [
      ["طراحی متناسب با سازمان", "سیاست Backup بر اساس سرویس‌ها، داده‌ها و نیازهای کسب‌وکار طراحی می‌شود."],
      ["مدیریت و پایش مستمر", "وضعیت نسخه‌های پشتیبان به‌صورت مستمر بررسی و کنترل می‌شود."],
      ["اطمینان از قابلیت بازیابی", "در Abrit Backup، موفق بودن فرآیند پشتیبان‌گیری پایان کار نیست؛ هر Backup باید بررسی شود و قابلیت بازیابی آن مشخص باشد."],
    ],
    bFlowTitle: "از طراحی تا بازیابی؛ Backup تحت مدیریت Abrit",
    bFlow: [
      ["طراحی سیاست Backup", "تعیین روش، زمان‌بندی و سطح پشتیبان‌گیری بر اساس نیاز سازمان."],
      ["اجرای Backup", "پیاده‌سازی فرآیندهای منظم برای سرویس‌ها و داده‌های موردنظر."],
      ["بررسی و پایش", "کنترل وضعیت نسخه‌های پشتیبان و عملکرد فرآیندها."],
      ["بازیابی", "Restore اطلاعات و سرویس‌ها بر اساس برنامه بازیابی سازمان."],
    ],
    bTechTitle: "فناوری و معماری Abrit",
    bTechIntro: "زیرساخت Abrit Backup از فناوری‌های تخصصی پشتیبان‌گیری، Monitoring و ابزارهای بازیابی تشکیل شده است تا وضعیت Backupها قابل پایش، ارزیابی و مدیریت باشد.",
    bTech: [
      ["زیرساخت Backup", "مدیریت Backup ماشین‌های مجازی و سرویس‌های سازمانی: Proxmox Backup Server · VM Backup · Scheduled Backup"],
      ["مدیریت و کنترل Backup", "اطمینان از سلامت فرآیند: Monitoring · Verification · Restore Test · Report"],
      ["Business Continuity", "طراحی بازیابی سازمان: RPO · RTO · Recovery Planning · Disaster Recovery"],
    ],
    bShowTitle: "Backup هوشمند، بر اساس اولویت‌های واقعی سازمان",
    bShowIntro: "در Abrit Backup، سیاست پشتیبان‌گیری و بازیابی بر اساس اولویت‌ها، حساسیت داده‌ها و الزامات عملیاتی هر سازمان طراحی می‌شود. معیارهای RPO و RTO کمک می‌کنند سطح حفاظت و زمان بازیابی هر سرویس به‌صورت شفاف و متناسب با نیاز کسب‌وکار و الزامات مورد انتظار سازمان مشخص شود.",
    bShow: [
      ["RPO؛ سطح حفاظت از داده‌ها", "RPO مشخص می‌کند سازمان به چه فاصله زمانی از نسخه‌های اطلاعات نیاز دارد؛ بر همین اساس، زمان‌بندی Backup برای هر سرویس مطابق سطح حفاظت مورد انتظار مشتری طراحی می‌شود."],
      ["RTO؛ زمان هدف برای بازگشت سرویس", "RTO مشخص می‌کند هر سرویس در چه بازه زمانی باید دوباره در دسترس قرار گیرد؛ بنابراین فرآیند Recovery متناسب با اولویت عملیاتی سازمان برنامه‌ریزی می‌شود."],
    ],
    bPathTitle: "مسیر شروع همکاری با Abrit Backup",
    bPath: [
      ["Assessment", "بررسی سرویس‌ها، داده‌ها و نیاز سازمان"],
      ["Design", "طراحی سیاست Backup، Retention و Recovery"],
      ["Deployment", "راه‌اندازی Backup و تنظیم فرآیندها"],
      ["Managed Backup", "Monitoring، تست Restore و نگهداری مستمر"],
    ],
    bCtaTitle: "برای اطلاعات حیاتی سازمان، Backup را به یک فرآیند قابل اتکا تبدیل کنید",
    bCtaBody: "Abrit Backup پشتیبان‌گیری، پایش و بازیابی داده‌ها و سرویس‌های سازمان را بر اساس نیاز واقعی کسب‌وکار شما مدیریت می‌کند.",
    contactTitle: "تماس",
    contactExcerpt: "برای ارزیابی وضعیت IT سازمان، طراحی راهکار یا دریافت مشاوره تخصصی با ما در ارتباط باشید.",
    formTitle: "ارسال پیام",
    formDescription: "نام، ایمیل و پیام خود را بنویسید؛ کارشناسان ابریت پاسخ‌گو خواهند بود.",
    success: "پیام شما دریافت شد.",
    consent: "موافقم این اطلاعات برای پاسخ‌گویی به درخواست من نگهداری شود.",
    navHome: "خانه",
    navServices: "خدمات",
    navBackup: "بکاپ و بازیابی",
    navContact: "تماس با ما",
    navSolutions: "راهکارها",
    navAbout: "درباره ابریت",
    navBlog: "وبلاگ",
    navKnowledge: "دانش و منابع",
    seoHomeTitle: "ابریت | مدیریت یکپارچه فناوری اطلاعات",
    seoHomeDesc: "ابریت فناوری اطلاعات سازمان را به زیرساختی یکپارچه، امن و پایدار تبدیل می‌کند؛ مدیریت کاربران، شبکه، امنیت، بکاپ و مانیتورینگ.",
    seoBackupTitle: "Abrit Backup | بکاپ و بازیابی سازمانی",
    seoBackupDesc: "پشتیبان‌گیری، پایش و بازیابی اطلاعات و سرویس‌های حیاتی سازمان در قالب یک فرآیند مدیریت‌شده.",
    svcMenu: [
      ["Abrit Workspace", "همکاری تیمی متمرکز"],
      ["Cloud storage", "ذخیره‌سازی ابری امن"],
      ["Abrit Voice / VoIP", "تماس اینترنتی باکیفیت"],
      ["ERP", "مدیریت جامع منابع"],
      ["Automation", "خودکارسازی جریان کاری"],
      ["IT & Security Assessment", "ارزیابی امنیتی زیرساخت"],
      ["Backup", "حفظ داده‌های حیاتی"],
      ["Antivirus", "دفاع ضد بدافزار"],
      ["یکپارچه‌سازی سازمانی", "همگام‌سازی ابزارهای سازمانی"],
    ],
    footSvc: ["مدیریت IT", "فضای کار سازمانی", "شبکه و امنیت", "هویت و دسترسی", "بکاپ و بازیابی", "مانیتورینگ", "ERP و مدیریت کسب‌وکار", "تلفن سازمانی", "مدیریت از راه دور", "اتوماسیون IT"],
    footSol: ["مدیریت یکپارچه IT", "برون‌سپاری IT", "امنیت و تداوم کسب‌وکار", "مدیریت شعب و دفاتر", "مدیریت کاربران", "همکاری و فضای کار سازمانی", "اتوماسیون فرایندها"],
    footAbrit: ["درباره ابریت", "وبلاگ", "دانش و منابع", "تماس با ما"],
  },  en: {
    brand: "Abrit",
    homeTitle: "A partner for your entire IT journey",
    homeExcerpt: "Abrit turns scattered systems, users, and services into unified, secure, stable, and responsive IT infrastructure — from user and network management to support, security, backup, monitoring, and automation, as one managed service.",
    heroBody: "Your company IT, unified and managed\n\nAbrit turns scattered systems, users, and services into unified, secure, stable, and responsive IT infrastructure — from user and network management to support, security, backup, monitoring, and automation, as one managed service.",
    ctaLabel: "Request an IT assessment",
    diffEyebrow: "The Abrit difference",
    diffTitle: "More than support: managed IT",
    diffBody: "The Abrit model is not built on one-off fixes. IT should be visible, documented, controllable, and scalable — so Monitoring, Ticketing, Documentation, Backup, Security, and Automation stand beside technical support to make IT a truly managed service.",
    diffs: ["Integration over fragmentation", "Prevention over reaction", "Process over dependence on individuals", "Documentation over tribal knowledge", "Automation over repetitive work"],
    staticTitle: "IT should not be your daily concern",
    staticBody: "IT is a critical asset of every business, directly shaping stability, security, and growth. With Managed IT and IT as a Service, Abrit owns your technology end to end — infrastructure, users, security, backup, monitoring, and support — managed as a valuable part of your business: orderly, proactive, and reliable.",
    benTitle: "From scattered systems to unified IT management",
    bens: [
      ["Unified IT management", "Network, users, security, backup, monitoring, and support in one coordinated structure."],
      ["Preventing IT problems", "Orderly, proactive management instead of reacting to outages."],
      ["Infrastructure security and stability", "Protecting technology assets and keeping services running."],
      ["Continuous support and response", "Structured request handling with ongoing partnership."],
      ["Structured IT growth", "IT that is visible, documented, controllable, and scalable."],
    ],
    svcTitle: "Everything you need for professional IT management",
    svcIntro: "Abrit delivers enterprise IT services in one unified model — from infrastructure and security to user management, support, and automation.",
    svcs: [
      ["IT Management", "User support, systems administration, structured request handling, and continuous infrastructure management."],
      ["Workspace", "Organizational workspace for files, sharing, team collaboration, Office Online, and controlled access to information."],
      ["Network & Security", "Network design and management, Firewall, VPN, Segmentation, branch connectivity, and secure access to services."],
      ["Identity & Access", "Centralized user management, Active Directory, LDAP, SSO, and role-based access."],
      ["Backup & Recovery", "Backup of critical data and services, retention policies, and recovery and continuity planning."],
      ["Monitoring", "Monitoring networks, servers, and services to detect incidents, review capacity, and run an orderly Alert-to-Resolution process."],
      ["ERP & Automation", "ERP, CRM, sales, and process automation solutions on Odoo Enterprise."],
      ["Business Telephony", "VoIP solutions, PBX, extensions, IVR, branch connectivity, and voice communications management."],
      ["Remote Management", "Centralized endpoint management, remote support, inventory, monitoring, and managed operations."],
      ["IT Automation", "Automated workflows, notifications, integrations, and repetitive processes for speed and fewer manual steps."],
    ],
    solTitle: "Solutions for real business challenges",
    solIntro: "Every organization has different conditions and priorities. At Abrit, a solution never starts with a tool — first the current state, needs, and risks are reviewed, then the right mix of services and technology is designed.",
    sols: [
      ["Unified IT management", "For organizations that want network, users, security, backup, monitoring, and support run as one coordinated structure."],
      ["IT outsourcing", "Access to a full bench of IT expertise without building and managing a complete in-house team."],
      ["Security & continuity", "Access control, infrastructure security, backup, monitoring, and recovery planning to cut risk and protect continuity."],
      ["Branch & office management", "Secure, manageable connectivity between headquarters, branches, users, and services in one coherent structure."],
      ["Organizational workspace", "Controlled access to files, collaboration tools, Office Online, and work resources for a tidier, unified team environment."],
      ["Process automation", "Connected systems and automated repetitive work for speed and repeatable, scalable processes."],
    ],
    procTitle: "From assessing today to continuous management",
    steps: [
      ["Assess", "Network, users, servers, storage, backup, security, endpoints, monitoring, and support processes are reviewed."],
      ["Design", "Target architecture, access model, security, backup, monitoring, and migration path are designed for your context."],
      ["Deliver", "Changes roll out in testable stages with backup, rollback, and minimal disruption."],
      ["Manage & improve", "Services are continuously monitored and improved based on incidents, capacity, risks, and new needs."],
    ],
    techTitle: "Technologies & platforms",
    techIntro: "Technology chosen by need, not by brand. Abrit architectures select technology for stability, security, supportability, integration, automation, scalability, and operating cost.",
    techs: [
      ["Virtualization & storage", "Proxmox · TrueNAS"],
      ["Network & security", "pfSense · WireGuard · Cloudflare"],
      ["Identity & access", "Microsoft Active Directory"],
      ["Organizational workspace", "Nextcloud · OnlyOffice"],
      ["Monitoring & management", "NetXMS · TacticalRMM · GLPI"],
      ["Business & automation", "Odoo Enterprise · n8n"],
    ],
    ctaTitle: "Need a closer look at your IT?",
    ctaBody: "From infrastructure and security to users, backup, and monitoring — the starting point is an accurate picture of today.",    backupTitle: "Your data always has a safe way back",
    backupExcerpt: "Abrit Backup runs backup, health-checking, and recovery of critical data and services as a managed process — so your organization keeps operating with confidence.",
    backupEyebrow: "Abrit Backup",
    backupPrimary: "Design an enterprise backup solution",
    backupSecondary: "Get expert advice",
    bStripTitle: "A complete backup lifecycle, managed",
    bStrip: [
      ["Backup of business services", "Virtual machines, databases, file servers, and ERP."],
      ["Managing vital files and data", "Organizational documents, user files, and shared folders."],
      ["Verifying backup health", "Continuous checks and proven recoverability."],
      ["Recovering data when needed", "Fast service restore against the recovery plan."],
    ],
    bWhatTitle: "What is Abrit Backup?",
    bWhatBody: "A managed service for organizational backup and recovery. Abrit Backup covers backup policies, version management, health monitoring, and recovery of data and services.",
    bWhy1Title: "Why backup is more than keeping a copy",
    bWhy1: [
      ["Valuable data needs a clear plan", "Organizational data is business capital and needs a defined protection process."],
      ["Backup creates value when managed", "Health monitoring, proper scheduling, and proven recoverability make backup dependable."],
      ["Critical services need more readiness", "Servers, files, and business software must be able to return quickly in any situation."],
    ],
    bProtTitle: "What does Abrit Backup protect?",
    bProtIntro: "Backup for the vital parts of your organization",
    bProt: [
      ["VM Backup", "Protecting virtual machines and services: Application Server · Database Server · File Server · ERP Server"],
      ["File Backup", "Protecting files and working data: documents · user files · shared folders · workspace data"],
      ["Application Backup", "Preserving key services: ERP · Database · service configuration"],
    ],
    bAdvTitle: "Why Abrit Backup?",
    bAdvIntro: "Backup is not software; it is an operational responsibility",
    bAdv: [
      ["Designed around your organization", "Backup policy shaped by your services, data, and business needs."],
      ["Continuous management and monitoring", "Backup versions are checked and controlled on an ongoing basis."],
      ["Proven recoverability", "A successful backup job is not the end — every backup must be verified recoverable."],
    ],
    bFlowTitle: "From design to recovery: backup under Abrit management",
    bFlow: [
      ["Backup policy design", "Methods, schedules, and backup levels set by organizational need."],
      ["Backup execution", "Orderly processes for the chosen services and data."],
      ["Review and monitoring", "Backup versions and process performance under control."],
      ["Recovery", "Restore of data and services against the recovery plan."],
    ],
    bTechTitle: "Abrit technology and architecture",
    bTechIntro: "Abrit Backup infrastructure combines backup technology, monitoring, and recovery tooling so backups stay observable, assessable, and manageable.",
    bTech: [
      ["Backup infrastructure", "VM and service backup management: Proxmox Backup Server · VM Backup · Scheduled Backup"],
      ["Backup control", "Process health assurance: Monitoring · Verification · Restore Test · Report"],
      ["Business continuity", "Organizational recovery design: RPO · RTO · Recovery Planning · Disaster Recovery"],
    ],
    bShowTitle: "Smart backup, driven by real organizational priorities",
    bShowIntro: "Backup and recovery policy is designed around each organization's priorities, data sensitivity, and operational requirements. RPO and RTO make the protection level and recovery time of every service transparent and matched to the business.",
    bShow: [
      ["RPO: data protection level", "RPO defines how recent data copies must be; backup schedules are designed to that expected protection level."],
      ["RTO: target time to restore service", "RTO defines how fast each service must return; recovery is planned around operational priority."],
    ],
    bPathTitle: "Starting with Abrit Backup",
    bPath: [
      ["Assessment", "Reviewing services, data, and organizational needs"],
      ["Design", "Designing backup, retention, and recovery policy"],
      ["Deployment", "Setting up backup and tuning processes"],
      ["Managed Backup", "Monitoring, restore testing, and continuous care"],
    ],
    bCtaTitle: "Turn backup into a process you can rely on",
    bCtaBody: "Abrit Backup manages backup, monitoring, and recovery of your data and services around your real business needs.",
    contactTitle: "Contact",
    contactExcerpt: "Reach out for an IT assessment, solution design, or expert advice.",
    formTitle: "Send a message",
    formDescription: "Write your name, email, and message; Abrit specialists will respond.",
    success: "Your message has been received.",
    consent: "I agree that this information may be stored to respond to my request.",
    navHome: "Home",
    navServices: "Services",
    navBackup: "Backup & Recovery",
    navContact: "Contact us",
    navSolutions: "Solutions",
    navAbout: "About Abrit",
    navBlog: "Blog",
    navKnowledge: "Knowledge & resources",
    seoHomeTitle: "Abrit | Unified IT management",
    seoHomeDesc: "Abrit turns enterprise IT into unified, secure, stable infrastructure — users, network, security, backup, and monitoring.",
    seoBackupTitle: "Abrit Backup | Enterprise backup & recovery",
    seoBackupDesc: "Backup, monitoring, and recovery of critical data and services as a managed process.",
    svcMenu: [
      ["Abrit Workspace", "Focused team collaboration"],
      ["Cloud storage", "Secure cloud storage"],
      ["Abrit Voice / VoIP", "Quality internet calling"],
      ["ERP", "Comprehensive resource management"],
      ["Automation", "Workflow automation"],
      ["IT & Security Assessment", "Infrastructure security assessment"],
      ["Backup", "Protecting vital data"],
      ["Antivirus", "Anti-malware defense"],
      ["Enterprise integration", "Syncing organizational tools"],
    ],
    footSvc: ["IT management", "Organizational workspace", "Network & security", "Identity & access", "Backup & recovery", "Monitoring", "ERP & business management", "Business telephony", "Remote management", "IT automation"],
    footSol: ["Unified IT management", "IT outsourcing", "Security & business continuity", "Branch & office management", "User management", "Collaboration & workspace", "Process automation"],
    footAbrit: ["About Abrit", "Blog", "Knowledge & resources", "Contact us"],
  },  "ar-ae": {
    brand: "Abrit",
    homeTitle: "شريكك في كامل مسار تقنية المعلومات",
    homeExcerpt: "تحوّل Abrit تقنية المعلومات من أنظمة ومستخدمين وخدمات متناثرة إلى بنية موحدة وآمنة ومستقرة وسريعة الاستجابة — من إدارة المستخدمين والشبكة إلى الدعم والأمن والنسخ الاحتياطي والمراقبة والأتمتة، ضمن خدمة مُدارة واحدة.",
    heroBody: "تقنية معلومات شركتك، موحدة ومُدارة\n\nتحوّل Abrit تقنية المعلومات من أنظمة ومستخدمين وخدمات متناثرة إلى بنية موحدة وآمنة ومستقرة وسريعة الاستجابة — من إدارة المستخدمين والشبكة إلى الدعم والأمن والنسخ الاحتياطي والمراقبة والأتمتة، ضمن خدمة مُدارة واحدة.",
    ctaLabel: "اطلب تقييم تقنية المعلومات",
    diffEyebrow: "فرق Abrit",
    diffTitle: "أكثر من الدعم؛ إدارة تقنية المعلومات",
    diffBody: "لا يقوم نموذج Abrit على حل المشكلات بشكل فردي. الهدف أن تكون تقنية المعلومات مرئية وموثقة وقابلة للضبط وقابلة للتوسع — لذلك تقف المراقبة والتذاكر والتوثيق والنسخ الاحتياطي والأمن والأتمتة إلى جانب الدعم الفني لتتحول التقنية إلى خدمة مُدارة حقيقية.",
    diffs: ["التكامل بدل التشتت", "الوقاية بدل رد الفعل", "العملية بدل الاعتماد على الأفراد", "التوثيق بدل المعرفة الشفهية", "الأتمتة بدل العمل المتكرر"],
    staticTitle: "لا ينبغي أن تكون التقنية همّك اليومي",
    staticBody: "تقنية المعلومات اليوم جزء من أصول كل عمل وبنيته الحيوية، ودورها مباشر في الاستقرار والأمن والنمو. تتولى Abrit بخدمات Managed IT وIT as a Service مسؤولية الإدارة الموحدة — من البنية والمستخدمين إلى الأمن والنسخ الاحتياطي والمراقبة والدعم. ندير التقنية كجزء قيّم من عملك؛ بانتظام واستباقية وثقة.",
    benTitle: "من الأنظمة المتناثرة إلى الإدارة الموحدة",
    bens: [
      ["الإدارة الموحدة لتقنية المعلومات", "الشبكة والمستخدمون والأمن والنسخ الاحتياطي والمراقبة والدعم في هيكل منسق واحد."],
      ["منع مشكلات التقنية", "إدارة منتظمة واستباقية بدل رد الفعل عند الأعطال."],
      ["أمن البنية واستقرارها", "حماية الأصول التقنية واستمرارية الخدمات."],
      ["دعم واستجابة مستمران", "معالجة منظمة للطلبات ومرافقة مستمرة."],
      ["تطوير منظم للتقنية", "تقنية مرئية وموثقة وقابلة للضبط والتوسع."],
    ],
    svcTitle: "كل ما تحتاجه للإدارة الاحترافية للتقنية",
    svcIntro: "تقدم Abrit خدمات تقنية معلومات مؤسسية ضمن نموذج موحد — من البنية والأمن إلى إدارة المستخدمين والدعم والأتمتة.",
    svcs: [
      ["إدارة التقنية", "دعم المستخدمين وإدارة الأنظمة ومعالجة منظمة للطلبات وإدارة مستمرة للبنية."],
      ["Workspace", "مساحة عمل مؤسسية للملفات والمشاركة والتعاون الجماعي وOffice Online والوصول المضبوط للمعلومات."],
      ["الشبكة والأمن", "تصميم الشبكة وإدارتها وFirewall وVPN والتقسيم وربط الفروع والوصول الآمن للخدمات."],
      ["الهوية والوصول", "إدارة مركزية للمستخدمين وActive Directory وLDAP وSSO والوصول حسب الدور."],
      ["النسخ الاحتياطي والاسترداد", "نسخ البيانات والخدمات الحيوية وسياسات الاحتفاظ والتخطيط للاسترداد واستمرارية الأعمال."],
      ["المراقبة", "مراقبة الشبكة والخوادم والخدمات لرصد الأعطال ومراجعة السعة وعملية منظمة من التنبيه إلى الحل."],
      ["ERP والأتمتة", "حلول ERP وCRM والمبيعات وأتمتة العمليات على Odoo Enterprise."],
      ["هاتف الأعمال", "حلول VoIP والسنترال والتحويلات والرد الآلي وربط الفروع وإدارة الاتصالات الصوتية."],
      ["الإدارة عن بعد", "إدارة مركزية للأجهزة والدعم عن بعد والجرد والمراقبة وتنفيذ العمليات الإدارية."],
      ["أتمتة التقنية", "أتمتة سير العمل والتنبيهات والتكاملات والعمليات المتكررة لسرعة أكبر وخطوات يدوية أقل."],
    ],
    solTitle: "حلول لتحديات الأعمال الحقيقية",
    solIntro: "لكل منظمة ظروفها وأولوياتها. في Abrit لا يبدأ الحل من الأداة — أولاً تُدرس الحالة الراهنة والاحتياجات والمخاطر، ثم تُصمم المزيج المناسب من الخدمات والتقنية.",
    sols: [
      ["الإدارة الموحدة للتقنية", "للمنظمات التي تريد إخراج الشبكة والمستخدمين والأمن والنسخ الاحتياطي والمراقبة والدعم من التشتت إلى هيكل منسق."],
      ["إسناد التقنية", "الوصول إلى خبرات تقنية متكاملة دون بناء فريق داخلي كامل وإدارته."],
      ["الأمن والاستمرارية", "ضبط الوصول وأمن البنية والنسخ الاحتياطي والمراقبة وخطة الاسترداد لخفض المخاطر وحماية الاستمرارية."],
      ["إدارة الفروع والمكاتب", "ربط آمن وقابل للإدارة بين المركز والفروع والمستخدمين والخدمات في هيكل متماسك."],
      ["بيئة العمل المؤسسية", "وصول مضبوط للملفات وأدوات التعاون وOffice Online وموارد العمل لبيئة فريق أكثر تنظيماً وتكاملاً."],
      ["أتمتة العمليات", "ربط الأنظمة وأتمتة الأعمال المتكررة لتقليل اليدوي وزيادة السرعة وعمليات قابلة للتكرار والتوسع."],
    ],
    procTitle: "من فهم اليوم إلى الإدارة والتحسين المستمر",
    steps: [
      ["التقييم", "تُدرس الشبكة والمستخدمون والخوادم والتخزين والنسخ الاحتياطي والأمن والأجهزة والمراقبة وعملية الدعم."],
      ["التصميم", "تُصمم البنية المستهدفة ونموذج الوصول وخطة الأمن والنسخ الاحتياطي والمراقبة ومسار الترحيل حسب ظروف المنظمة."],
      ["التنفيذ", "تُنفذ التغييرات على مراحل قابلة للاختبار مع النسخ الاحتياطي والتراجع وأقل تعطيل."],
      ["الإدارة والتحسين", "تُراقب الخدمات وتُدار باستمرار وتُحسّن حسب الحوادث والسعة والمخاطر والاحتياجات الجديدة."],
    ],
    techTitle: "التقنيات والمنصات",
    techIntro: "اختيار التقنية حسب الحاجة لا حسب الاسم. تختار معماريات Abrit التقنية للاستقرار والأمن وقابلية الدعم والتكامل والأتمتة وقابلية التوسع والتكلفة التشغيلية.",
    techs: [
      ["الافتراضية والتخزين", "Proxmox · TrueNAS"],
      ["الشبكة والأمن", "pfSense · WireGuard · Cloudflare"],
      ["الهوية والوصول", "Microsoft Active Directory"],
      ["مساحة العمل المؤسسية", "Nextcloud · OnlyOffice"],
      ["المراقبة والإدارة", "NetXMS · TacticalRMM · GLPI"],
      ["الأعمال والأتمتة", "Odoo Enterprise · n8n"],
    ],
    ctaTitle: "تحتاج إلى نظرة أدق على تقنيتك؟",
    ctaBody: "من البنية والأمن إلى المستخدمين والنسخ الاحتياطي والمراقبة — البداية فهم دقيق للوضع الراهن.",    backupTitle: "معلومات منظمتك لها دائماً طريق آمن للعودة",
    backupExcerpt: "تنفذ Abrit Backup النسخ الاحتياطي وفحص السلامة واسترداد المعلومات والخدمات الحيوية ضمن عملية مُدارة — لتواصل منظمتك عملها بثقة أكبر.",
    backupEyebrow: "Abrit Backup",
    backupPrimary: "صمم حل النسخ الاحتياطي",
    backupSecondary: "احصل على استشارة متخصصة",
    bStripTitle: "حل متكامل لإدارة دورة النسخ الاحتياطي",
    bStrip: [
      ["النسخ الاحتياطي لخدمات المنظمة", "الأجهزة الافتراضية وقواعد البيانات وخوادم الملفات وERP."],
      ["إدارة الملفات والبيانات الحيوية", "مستندات المنظمة وملفات المستخدمين والمجلدات المشتركة."],
      ["فحص سلامة النسخ", "مراقبة مستمرة وضمان قابلية الاسترداد."],
      ["استرداد المعلومات عند الحاجة", "عودة سريعة للخدمات وفق خطة الاسترداد."],
    ],
    bWhatTitle: "ما هي Abrit Backup؟",
    bWhatBody: "خدمة مُدارة للنسخ الاحتياطي واسترداد معلومات المنظمة. تغطي Abrit Backup عمليات وتقنيات النسخ من تصميم السياسة وإدارة النسخ إلى مراقبة السلامة واسترداد المعلومات والخدمات.",
    bWhy1Title: "لماذا النسخ الاحتياطي ليس مجرد حفظ نسخة؟",
    bWhy1: [
      ["المعلومات القيمة تحتاج خطة واضحة", "بيانات المنظمة جزء من رأس مال العمل وتحتاج عملية حماية محددة."],
      ["النسخ يصنع القيمة عندما يُدار", "مراقبة السلامة والجدولة المناسبة وضمان الاسترداد تجعل النسخ عملية موثوقة."],
      ["الخدمات الحيوية تحتاج جاهزية أكبر", "يجب أن تعود الخوادم والملفات وبرمجيات الأعمال بسرعة في مختلف الظروف."],
    ],
    bProtTitle: "ما الذي تحميه Abrit Backup؟",
    bProtIntro: "نسخ احتياطي للأجزاء الحيوية من المنظمة",
    bProt: [
      ["VM Backup", "حماية الأجهزة الافتراضية والخدمات: Application Server · Database Server · File Server · ERP Server"],
      ["File Backup", "حماية الملفات ومعلومات العمل: المستندات · ملفات المستخدمين · المجلدات المشتركة · بيانات Workspace"],
      ["Application Backup", "الحفاظ على الخدمات المهمة: ERP · Database · إعدادات الخدمات"],
    ],
    bAdvTitle: "لماذا Abrit Backup؟",
    bAdvIntro: "النسخ الاحتياطي ليس برنامجاً؛ بل مسؤولية تشغيلية",
    bAdv: [
      ["تصميم حسب المنظمة", "سياسة النسخ وفق الخدمات والبيانات واحتياجات العمل."],
      ["إدارة ومراقبة مستمرة", "حالة النسخ تُفحص وتُضبط باستمرار."],
      ["ضمان قابلية الاسترداد", "نجاح عملية النسخ ليس النهاية — كل نسخة يجب فحصها وإثبات استردادها."],
    ],
    bFlowTitle: "من التصميم إلى الاسترداد؛ النسخ بإدارة Abrit",
    bFlow: [
      ["تصميم سياسة النسخ", "تحديد الطريقة والجدولة ومستوى النسخ حسب حاجة المنظمة."],
      ["تنفيذ النسخ", "عمليات منتظمة للخدمات والبيانات المختارة."],
      ["المراجعة والمراقبة", "ضبط حالة النسخ وأداء العمليات."],
      ["الاسترداد", "استعادة المعلومات والخدمات وفق خطة استرداد المنظمة."],
    ],
    bTechTitle: "تقنية ومعمارية Abrit",
    bTechIntro: "تتكون بنية Abrit Backup من تقنيات النسخ المتخصصة والمراقبة وأدوات الاسترداد لتبقى النسخ قابلة للمراقبة والتقييم والإدارة.",
    bTech: [
      ["بنية النسخ", "إدارة نسخ الأجهزة الافتراضية والخدمات: Proxmox Backup Server · VM Backup · Scheduled Backup"],
      ["ضبط النسخ", "ضمان سلامة العملية: Monitoring · Verification · Restore Test · Report"],
      ["استمرارية الأعمال", "تصميم استرداد المنظمة: RPO · RTO · Recovery Planning · Disaster Recovery"],
    ],
    bShowTitle: "نسخ ذكي وفق أولويات المنظمة الحقيقية",
    bShowIntro: "تُصمم سياسة النسخ والاسترداد وفق الأولويات وحساسية البيانات والمتطلبات التشغيلية لكل منظمة. يساعد معيارا RPO وRTO على تحديد مستوى الحماية وزمن الاسترداد لكل خدمة بشفافية وبما يناسب العمل.",
    bShow: [
      ["RPO: مستوى حماية البيانات", "يحدد RPO حداثة نسخ المعلومات المطلوبة؛ وعليه تُصمم جدولة النسخ لكل خدمة."],
      ["RTO: الزمن المستهدف لعودة الخدمة", "يحدد RTO سرعة عودة كل خدمة؛ فيُخطط الاسترداد وفق الأولوية التشغيلية."],
    ],
    bPathTitle: "مسار بدء التعاون مع Abrit Backup",
    bPath: [
      ["Assessment", "دراسة الخدمات والبيانات واحتياجات المنظمة"],
      ["Design", "تصميم سياسة النسخ والاحتفاظ والاسترداد"],
      ["Deployment", "تشغيل النسخ وضبط العمليات"],
      ["Managed Backup", "المراقبة واختبار الاسترداد والرعاية المستمرة"],
    ],
    bCtaTitle: "اجعل النسخ عملية موثوقة لمعلوماتك الحيوية",
    bCtaBody: "تدير Abrit Backup النسخ والمراقبة والاسترداد لبياناتك وخدماتك وفق حاجة عملك الحقيقية.",
    contactTitle: "اتصل بنا",
    contactExcerpt: "تواصل معنا لتقييم تقنيتك أو تصميم حل أو استشارة متخصصة.",
    formTitle: "أرسل رسالة",
    formDescription: "اكتب اسمك وبريدك ورسالتك؛ سيرد عليك مختصو Abrit.",
    success: "تم استلام رسالتك.",
    consent: "أوافق على حفظ هذه المعلومات للرد على طلبي.",
    navHome: "الرئيسية",
    navServices: "الخدمات",
    navBackup: "النسخ الاحتياطي والاسترداد",
    navContact: "اتصل بنا",
    navSolutions: "الحلول",
    navAbout: "حول Abrit",
    navBlog: "المدونة",
    navKnowledge: "المعرفة والموارد",
    seoHomeTitle: "Abrit | إدارة موحدة لتقنية المعلومات",
    seoHomeDesc: "تحوّل Abrit تقنية الأعمال إلى بنية موحدة وآمنة ومستقرة — المستخدمون والشبكة والأمن والنسخ والمراقبة.",
    seoBackupTitle: "Abrit Backup | النسخ والاسترداد المؤسسي",
    seoBackupDesc: "نسخ ومراقبة واسترداد المعلومات والخدمات الحيوية ضمن عملية مُدارة.",
    svcMenu: [
      ["Abrit Workspace", "تعاون جماعي مركز"],
      ["Cloud storage", "تخزين سحابي آمن"],
      ["Abrit Voice / VoIP", "اتصال إنترنت عالي الجودة"],
      ["ERP", "إدارة شاملة للموارد"],
      ["Automation", "أتمتة سير العمل"],
      ["IT & Security Assessment", "تقييم أمن البنية"],
      ["Backup", "حماية البيانات الحيوية"],
      ["Antivirus", "دفاع ضد البرمجيات الخبيثة"],
      ["التكامل المؤسسي", "مزامنة أدوات المنظمة"],
    ],
    footSvc: ["إدارة التقنية", "مساحة العمل المؤسسية", "الشبكة والأمن", "الهوية والوصول", "النسخ والاسترداد", "المراقبة", "ERP وإدارة الأعمال", "هاتف الأعمال", "الإدارة عن بعد", "أتمتة التقنية"],
    footSol: ["الإدارة الموحدة للتقنية", "إسناد التقنية", "الأمن واستمرارية الأعمال", "إدارة الفروع والمكاتب", "إدارة المستخدمين", "التعاون ومساحة العمل", "أتمتة العمليات"],
    footAbrit: ["حول Abrit", "المدونة", "المعرفة والموارد", "اتصل بنا"],
  },
};const solTabs: Record<Locale, string[]> = {
  fa: ["تحول دیجیتال (Digital Transformation)", "دورکاری و همکاری (Remote Work)", "تداوم کسب‌وکار (Business Continuity)", "امنیت شبکه (Network Security)"],
  en: ["Digital Transformation", "Remote Work", "Business Continuity", "Network Security"],
  "ar-ae": ["التحول الرقمي", "العمل عن بعد والتعاون", "استمرارية الأعمال", "أمن الشبكة"],
};

const stepIcons: Record<Locale, string[]> = { fa: ["۱", "۲", "۳", "۴"], en: ["1", "2", "3", "4"], "ar-ae": ["1", "2", "3", "4"] };

function grid(items: Pair[], icons?: string[], urls?: (string | undefined)[]): { icon?: string; title: string; description: string; url?: string }[] {
  return items.map(([title, description], index) => ({
    ...(icons?.[index] ? { icon: icons[index] } : {}),
    title,
    description,
    ...(urls?.[index] ? { url: urls[index] as string } : {}),
  }));
}

async function upsertContactForm(payload: Payload) {
  const found = await payload.find({ collection: "forms", limit: 1, overrideAccess: true, where: { key: { equals: "contact" } } });
  let form: Form | undefined = found.docs[0];
  for (const locale of locales) {
    const value = copy[locale];
    const data = {
      key: "contact", isActive: true, requiresPrivacyConsent: true, retentionMonths: 12,
      title: value.formTitle, description: value.formDescription, successMessage: value.success, consentLabel: value.consent,
      fields: [
        { key: "name", fieldType: "text" as const, required: true, minLength: 2, maxLength: 120, label: locale === "en" ? "Name" : locale === "fa" ? "نام" : "الاسم", enabled: true },
        { key: "email", fieldType: "email" as const, required: true, maxLength: 180, label: locale === "en" ? "Email" : locale === "fa" ? "ایمیل" : "البريد الإلكتروني", enabled: true },
        { key: "message", fieldType: "textarea" as const, required: true, minLength: 10, maxLength: 2000, label: locale === "en" ? "Message" : locale === "fa" ? "پیام" : "الرسالة", enabled: true },
      ].map((field, index) => ({ ...field, ...(form?.fields?.[index]?.id ? { id: form.fields[index].id } : {}) })),
    };
    form = form
      ? await payload.update({ collection: "forms", id: form.id, locale, overrideAccess: true, data })
      : await payload.create({ collection: "forms", locale, overrideAccess: true, data });
  }
  if (!form) throw new Error("Contact form bootstrap failed.");
  return form;
}

function homeLayout(locale: Locale): NonNullable<Content["layout"]> {
  const value = copy[locale];
  return [
    { blockType: "hero", enabled: true, variant: "split", eyebrow: "", title: value.homeTitle, body: value.heroBody, primaryCTA: { label: value.ctaLabel, url: `/${locale}/contact`, openInNewTab: false }, secondaryCTA: {}, points: [] },
    { blockType: "hero", enabled: true, variant: "simple", eyebrow: value.diffEyebrow, title: value.diffTitle, body: value.diffBody, primaryCTA: {}, secondaryCTA: {}, points: value.diffs.map((text) => ({ text })) },
    { blockType: "cta", enabled: true, variant: "default", title: value.staticTitle, body: value.staticBody, primaryCTA: {} },
    { blockType: "featureGrid", enabled: true, variant: "centered", heading: value.benTitle, items: grid(value.bens) },
    { blockType: "featureGrid", enabled: true, variant: "cards", heading: value.svcTitle, intro: value.svcIntro, items: grid(value.svcs, undefined, value.svcs.map((_, serviceIndex) => (serviceIndex === 4 ? "backup" : undefined))) },
    { blockType: "featureGrid", enabled: true, variant: "cards", heading: value.solTitle, intro: value.solIntro, items: grid(value.sols) },
    { blockType: "featureGrid", enabled: true, variant: "compact", heading: value.procTitle, items: grid(value.steps, stepIcons[locale]) },
    { blockType: "featureGrid", enabled: true, variant: "cards", heading: value.techTitle, intro: value.techIntro, items: grid(value.techs) },
    { blockType: "cta", enabled: true, variant: "split", title: value.ctaTitle, body: value.ctaBody, primaryCTA: { label: value.ctaLabel, url: `/${locale}/contact`, openInNewTab: false } },
  ];
}

function backupLayout(locale: Locale): NonNullable<Content["layout"]> {
  const value = copy[locale];
  return [
    { blockType: "hero", enabled: true, variant: "split", eyebrow: value.backupEyebrow, title: value.backupTitle, body: value.backupExcerpt, primaryCTA: { label: value.backupPrimary, url: `/${locale}/contact`, openInNewTab: false }, secondaryCTA: { label: value.backupSecondary, url: `/${locale}/contact`, openInNewTab: false }, points: [] },
    { blockType: "featureGrid", enabled: true, variant: "cards", heading: value.bStripTitle, items: grid(value.bStrip) },
    { blockType: "cta", enabled: true, variant: "default", title: value.bWhatTitle, body: value.bWhatBody, primaryCTA: {} },
    { blockType: "featureGrid", enabled: true, variant: "cards", heading: value.bWhy1Title, items: grid(value.bWhy1) },
    { blockType: "featureGrid", enabled: true, variant: "cards", heading: value.bProtTitle, intro: value.bProtIntro, items: grid(value.bProt) },
    { blockType: "featureGrid", enabled: true, variant: "cards", heading: value.bAdvTitle, intro: value.bAdvIntro, items: grid(value.bAdv) },
    { blockType: "featureGrid", enabled: true, variant: "compact", heading: value.bFlowTitle, items: grid(value.bFlow, stepIcons[locale]) },
    { blockType: "featureGrid", enabled: true, variant: "cards", heading: value.bTechTitle, intro: value.bTechIntro, items: grid(value.bTech) },
    { blockType: "featureGrid", enabled: true, variant: "cards", heading: value.bShowTitle, intro: value.bShowIntro, items: grid(value.bShow) },
    { blockType: "featureGrid", enabled: true, variant: "compact", heading: value.bPathTitle, items: grid(value.bPath) },
    { blockType: "hero", enabled: true, variant: "simple", eyebrow: "", title: value.bCtaTitle, body: value.bCtaBody, primaryCTA: { label: value.backupPrimary, url: `/${locale}/contact`, openInNewTab: false }, secondaryCTA: { label: value.backupSecondary, url: `/${locale}/contact`, openInNewTab: false }, points: [] },
  ];
}

function contactLayout(locale: Locale, form: Form): NonNullable<Content["layout"]> {
  const value = copy[locale];
  return [{ blockType: "form", enabled: true, variant: "default", form: form.id, heading: value.formTitle, intro: value.formDescription, context: "contact-page" }];
}

type PageKey = "home" | "contact" | "backup";

async function upsertPage(payload: Payload, key: PageKey, form: Form) {
  const found = await payload.find({ collection: "content", limit: 1, overrideAccess: true, where: { key: { equals: key } } });
  let id = found.docs[0]?.id;
  for (const locale of locales) {
    const value = copy[locale];
    const title = key === "home" ? value.homeTitle : key === "backup" ? value.backupTitle : value.contactTitle;
    const excerpt = key === "home" ? value.homeExcerpt : key === "backup" ? value.backupExcerpt : value.contactExcerpt;
    const path = key === "home" ? "" : key;
    const data = {
      key, kind: (key === "backup" ? "service" : "page") as Content["kind"], templateKey: "default", isActive: true, title, excerpt,
      slug: key, path, layout: key === "home" ? homeLayout(locale) : key === "backup" ? backupLayout(locale) : contactLayout(locale, form),
      translationStatus: "reviewed" as const, workflowStatus: "published" as const,
      searchText: normalizeSearchText(`${title} ${excerpt}`),
      seo: key === "contact"
        ? { robotsIndex: true, robotsFollow: true }
        : { title: key === "home" ? value.seoHomeTitle : value.seoBackupTitle, description: key === "home" ? value.seoHomeDesc : value.seoBackupDesc, robotsIndex: true, robotsFollow: true },
      _status: "published" as const,
    };
    const saved = id
      ? await payload.update({ collection: "content", id, locale, overrideAccess: true, data })
      : await payload.create({ collection: "content", locale, overrideAccess: true, data });
    id = saved.id;
  }
}

function preserveRowIDs(items: NonNullable<Navigation["header"]>, existing: Navigation["header"]) {
  return items.map((item, index) => ({ ...item, ...(existing?.[index]?.id ? { id: existing[index].id } : {}) }));
}

function headerItems(locale: Locale): NonNullable<Navigation["header"]> {
  const value = copy[locale];
  const backupDesc = value.svcMenu[6]?.[1] ?? "";
  return [
    { title: value.navHome, path: "", enabled: true },
    {
      title: value.navServices, path: "", enabled: true,
      children: [
        { title: value.navBackup, description: backupDesc, path: "backup", enabled: true },
        ...value.svcMenu.filter((_, index) => index !== 6).map(([title, description]) => ({ title, description, path: "", enabled: false })),
      ],
    },
    { title: value.navSolutions, path: "", enabled: false, children: solTabs[locale].map((title) => ({ title, path: "", enabled: false })) },
    { title: value.navContact, path: "contact", enabled: true },
  ];
}

function footerItems(locale: Locale): NonNullable<Navigation["header"]> {
  const value = copy[locale];
  return [
    { title: value.navHome, path: "", enabled: true },
    { title: value.navBackup, path: "backup", enabled: true },
    { title: value.navContact, path: "contact", enabled: true },
    { title: value.navServices, path: "", enabled: false, children: value.footSvc.map((title) => ({ title, path: "", enabled: false })) },
    { title: value.navSolutions, path: "", enabled: false, children: value.footSol.map((title) => ({ title, path: "", enabled: false })) },
    { title: value.brand, path: "", enabled: false, children: value.footAbrit.map((title) => ({ title, path: "", enabled: false })) },
  ];
}

async function upsertGlobals(payload: Payload) {
  for (const locale of locales) {
    const value = copy[locale];
    const settings = await payload.findGlobal({ slug: "site-settings", locale, fallbackLocale: false, depth: 0, overrideAccess: true });
    if (!settings.defaultSEODescription || settings.brandName === "Payload CMS Starter" || !settings.brandName) {
      await payload.updateGlobal({ slug: "site-settings", locale, overrideAccess: true, data: { brandName: value.brand, defaultSEOTitle: value.seoHomeTitle, defaultSEODescription: value.seoHomeDesc } });
    }
    const navigation = await payload.findGlobal({ slug: "navigation", locale, fallbackLocale: false, depth: 0, overrideAccess: true });
    const header = preserveRowIDs(headerItems(locale), navigation.header);
    const footer = preserveRowIDs(footerItems(locale), navigation.footer);
    const mobile = preserveRowIDs(headerItems(locale), navigation.mobile);
    await payload.updateGlobal({ slug: "navigation", locale, overrideAccess: true, data: { header, footer, mobile } });
  }
  await payload.findGlobal({ slug: "design-settings", depth: 0, overrideAccess: true });
}

async function createAdmin(payload: Payload) {
  const email = process.env.PAYLOAD_ADMIN_EMAIL;
  const password = process.env.PAYLOAD_ADMIN_PASSWORD;
  if (Boolean(email) !== Boolean(password)) throw new Error("Set both PAYLOAD_ADMIN_EMAIL and PAYLOAD_ADMIN_PASSWORD, or neither.");
  if (!email || !password) return;
  if (password.length < 12) throw new Error("PAYLOAD_ADMIN_PASSWORD must contain at least 12 characters.");
  const existing = await payload.find({ collection: "users", limit: 1, overrideAccess: true, where: { email: { equals: email } } });
  if (!existing.docs.length) await payload.create({ collection: "users", overrideAccess: true, data: { email, password, name: "Abrit Administrator", role: "admin" } });
}

async function main() {
  const { default: config } = await import("@payload-config");
  const payload = await getPayload({ config });
  await createAdmin(payload);
  const form = await upsertContactForm(payload);
  await upsertPage(payload, "home", form);
  await upsertPage(payload, "contact", form);
  await upsertPage(payload, "backup", form);
  await upsertGlobals(payload);
  payload.logger.info(`Bootstrap complete for ${siteName}; default locale is ${defaultLocale}.`);
  process.exit(0);
}

await main();