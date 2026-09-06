import type { Locale } from "./types";

export type LocalizedText = Record<Locale, string>;
export type IndependentServiceBlock = {
  title: LocalizedText;
  body: LocalizedText;
  tags?: string[];
};
export type IndependentServiceFaq = {
  question: LocalizedText;
  answer: LocalizedText;
};
export type IndependentServiceExtension = {
  deliverablesTitle: LocalizedText;
  deliverablesBody: LocalizedText;
  deliverables: IndependentServiceBlock[];
  managedScopeTitle: LocalizedText;
  managedScopeBody: LocalizedText;
  managedScope: IndependentServiceBlock[];
  faqTitle: LocalizedText;
  faqs: IndependentServiceFaq[];
};

export type IndependentService = {
  slug: "backup" | "cloud-storage" | "workspace" | "voice";
  code: string;
  title: LocalizedText;
  category: LocalizedText;
  heroTitle: LocalizedText;
  heroBody: LocalizedText;
  pulse: LocalizedText[];
  overviewTitle: LocalizedText;
  overviewBody: LocalizedText;
  contextTitle: LocalizedText;
  context: IndependentServiceBlock[];
  capabilitiesTitle: LocalizedText;
  capabilities: IndependentServiceBlock[];
  architectureTitle: LocalizedText;
  architectureBody: LocalizedText;
  architecture: IndependentServiceBlock[];
  showcaseTitle: LocalizedText;
  showcaseBody: LocalizedText;
  showcase: IndependentServiceBlock[];
  processTitle: LocalizedText;
  process: IndependentServiceBlock[];
  technologies: string[];
  ctaTitle: LocalizedText;
  ctaBody: LocalizedText;
  relatedManagedSlug: string;
  comparison?: {
    intro: LocalizedText;
    columns: LocalizedText[];
    rows: Array<{ label: LocalizedText; values: LocalizedText[] }>;
  };
};

const l = (fa: string, en: string, ar: string): LocalizedText => ({
  fa,
  en,
  "ar-ae": ar,
});
const b = (
  title: LocalizedText,
  body: LocalizedText,
  tags?: string[],
): IndependentServiceBlock => ({ title, body, tags });

export const independentPageCopy = {
  title: l(
    "خدمات مستقل ابریت",
    "AbrIT independent services",
    "خدمات AbrIT المستقلة",
  ),
  intro: l(
    "چهار سرویس سازمانی که می‌توانند مستقل از پکیج‌های مدیریت‌شده، متناسب با زیرساخت و نیاز کسب‌وکار شما طراحی و راه‌اندازی شوند.",
    "Four organizational services that can be designed and deployed independently from managed-service packages, around your infrastructure and business needs.",
    "أربع خدمات مؤسسية يمكن تصميمها وتنفيذها بشكل مستقل عن باقات الخدمات المُدارة وفق بنية مؤسستك واحتياجاتها.",
  ),
  eyebrow: l("محصولات مستقل", "Independent services", "الخدمات المستقلة"),
  explore: l("مشاهده جزئیات", "Explore service", "استعراض الخدمة"),
  consult: l(
    "دریافت مشاوره تخصصی",
    "Request a consultation",
    "طلب استشارة متخصصة",
  ),
  back: l("همه خدمات مستقل", "All independent services", "كل الخدمات المستقلة"),
  overview: l("معرفی سرویس", "Service overview", "نظرة على الخدمة"),
  capabilities: l("قابلیت‌ها", "Capabilities", "القدرات"),
  architecture: l("معماری سرویس", "Service architecture", "بنية الخدمة"),
  process: l("مسیر اجرا", "Delivery path", "مسار التنفيذ"),
  technologies: l(
    "فناوری‌های مرتبط",
    "Related technologies",
    "التقنيات المرتبطة",
  ),
  comparison: l("مقایسه راهکارها", "Solution comparison", "مقارنة الحلول"),
  related: l(
    "خدمت مدیریت‌شده مرتبط",
    "Related managed service",
    "الخدمة المُدارة المرتبطة",
  ),
  familyTitle: l(
    "چهار سرویس، یک زیرساخت اطلاعاتی منسجم",
    "Four services, one coherent information foundation",
    "أربع خدمات، وأساس معلوماتي متكامل",
  ),
  familyBody: l(
    "هر سرویس می‌تواند مستقل راه‌اندازی شود؛ اما کنار هم مسیر حفاظت، نگهداری، همکاری و ارتباطات سازمان را کامل می‌کنند.",
    "Each service can run independently, while together they cover protection, storage, collaboration and organizational communications.",
    "يمكن تشغيل كل خدمة بصورة مستقلة، وتتكامل معاً لتغطية الحماية والتخزين والتعاون والاتصالات المؤسسية.",
  ),
  familyStages: [
    b(
      l("حفاظت", "Protect", "الحماية"),
      l(
        "Backup از اطلاعات و سرویس‌های حیاتی محافظت می‌کند و مسیر بازگشت را قابل‌آزمون نگه می‌دارد.",
        "Backup protects critical information and services and keeps the recovery path testable.",
        "تحمي خدمة Backup المعلومات والخدمات الحيوية وتُبقي مسار الاستعادة قابلاً للاختبار.",
      ),
    ),
    b(
      l("نگهداری", "Store", "التخزين"),
      l(
        "Cloud Storage فایل‌ها را در مخزن مرکزی، ساختاریافته و تحت کنترل سازمان قرار می‌دهد.",
        "Cloud Storage places files in a central, structured repository controlled by the organization.",
        "تضع Cloud Storage الملفات في مستودع مركزي منظم وتحت تحكم المؤسسة.",
      ),
    ),
    b(
      l("همکاری", "Collaborate", "التعاون"),
      l(
        "Workspace فایل، سند و کار تیمی را با هویت و دسترسی سازمانی یکپارچه می‌کند.",
        "Workspace unifies files, documents and teamwork with organizational identity and access.",
        "توحّد Workspace الملفات والمستندات والعمل الجماعي مع هوية المؤسسة وصلاحياتها.",
      ),
    ),
    b(
      l("ارتباط", "Connect", "الاتصال"),
      l(
        "Voice تماس‌ها، داخلی‌ها و شعب را در یک بستر ارتباطی مدیریت‌شده به هم متصل می‌کند.",
        "Voice connects calls, extensions and branches through a managed communications platform.",
        "تربط Voice المكالمات والامتدادات والفروع عبر منصة اتصالات مُدارة.",
      ),
    ),
  ],
  decisionTitle: l(
    "چه زمانی یک خدمت مستقل انتخاب مناسبی است؟",
    "When is an independent service the right choice?",
    "متى تكون الخدمة المستقلة هي الخيار المناسب؟",
  ),
  decisionBody: l(
    "وقتی سازمان به یک مسئله مشخص نیاز فوری دارد، می‌خواهد زیرساخت فعلی را حفظ کند یا ترجیح می‌دهد توسعه خدمات را مرحله‌ای انجام دهد.",
    "When the organization has one urgent need, wants to preserve its current infrastructure, or prefers a phased service rollout.",
    "عندما تكون لدى المؤسسة حاجة عاجلة محددة، أو ترغب في الحفاظ على بنيتها الحالية، أو تفضّل تطوير الخدمات على مراحل.",
  ),
  decisions: [
    b(
      l(
        "شروع از یک نیاز مشخص",
        "Start with one clear need",
        "ابدأ بحاجة واضحة",
      ),
      l(
        "بدون خرید یک بسته بزرگ، همان مسئله‌ای را حل کنید که امروز بیشترین اثر عملیاتی را دارد.",
        "Solve the issue with the greatest operational impact today without adopting a large package.",
        "عالج المشكلة ذات الأثر التشغيلي الأكبر اليوم دون اعتماد باقة كبيرة.",
      ),
    ),
    b(
      l(
        "هماهنگ با زیرساخت موجود",
        "Fit the current environment",
        "متوافق مع البيئة الحالية",
      ),
      l(
        "طراحی سرویس با کاربران، داده‌ها، تجهیزات و ساختار فعلی سازمان تطبیق داده می‌شود.",
        "The service is designed around the organization’s current users, data, equipment and structure.",
        "تُصمم الخدمة وفق مستخدمي المؤسسة وبياناتها وتجهيزاتها وهيكلها الحالي.",
      ),
    ),
    b(
      l(
        "آماده توسعه مرحله‌ای",
        "Ready for phased growth",
        "جاهز للنمو المرحلي",
      ),
      l(
        "از یک سرویس شروع کنید و در ادامه، سرویس‌های مکمل را بدون گسست به معماری اضافه کنید.",
        "Begin with one service and add complementary services later without breaking the architecture.",
        "ابدأ بخدمة واحدة ثم أضف الخدمات المكملة لاحقاً دون تفكيك البنية.",
      ),
    ),
  ],
  deliverables: l(
    "خروجی‌های قابل‌تحویل",
    "Tangible deliverables",
    "مخرجات قابلة للتسليم",
  ),
  managedScope: l(
    "دامنه مدیریت سرویس",
    "Managed service scope",
    "نطاق إدارة الخدمة",
  ),
  faq: l("پرسش‌های رایج", "Frequently asked questions", "الأسئلة الشائعة"),
} as const;

export const independentServices: IndependentService[] = [
  {
    slug: "backup",
    code: "ABRIT BACKUP",
    title: l("ابریت Backup", "AbrIT Backup", "AbrIT Backup"),
    category: l(
      "پشتیبان‌گیری و بازیابی مدیریت‌شده",
      "Managed backup & recovery",
      "النسخ والاستعادة المُداران",
    ),
    heroTitle: l(
      "اطلاعات سازمان شما، همیشه یک مسیر مطمئن برای بازگشت دارد",
      "Give critical information a dependable path back",
      "امنح معلومات مؤسستك مساراً موثوقاً للعودة",
    ),
    heroBody: l(
      "ابریت Backup پشتیبان‌گیری، پایش و بازیابی اطلاعات و سرویس‌های حیاتی سازمان را به یک فرایند مدیریت‌شده و قابل بررسی تبدیل می‌کند.",
      "AbrIT Backup turns the protection, monitoring and recovery of critical data and services into a managed, verifiable process.",
      "تحوّل AbrIT Backup حماية البيانات والخدمات الحيوية ومراقبتها واستعادتها إلى عملية مُدارة وقابلة للتحقق.",
    ),
    pulse: [
      l(
        "پشتیبان‌گیری سرویس‌های سازمانی",
        "Organizational service backup",
        "نسخ الخدمات المؤسسية",
      ),
      l("پایش سلامت نسخه‌ها", "Backup health monitoring", "مراقبة سلامة النسخ"),
      l("بازیابی برنامه‌ریزی‌شده", "Planned recovery", "استعادة مخططة"),
      l("تداوم کسب‌وکار", "Business continuity", "استمرارية الأعمال"),
    ],
    overviewTitle: l(
      "یک سرویس مدیریت‌شده برای تمام چرخه Backup",
      "A managed service for the complete backup lifecycle",
      "خدمة مُدارة لكامل دورة النسخ الاحتياطي",
    ),
    overviewBody: l(
      "از طراحی سیاست Backup و زمان‌بندی نسخه‌ها تا پایش سلامت، آزمون بازیابی و اجرای Restore؛ هر مرحله با توجه به حساسیت داده و اولویت سرویس طراحی می‌شود.",
      "From policy design and scheduling to health monitoring, restore testing and recovery, each step is shaped by data sensitivity and service priority.",
      "من تصميم سياسة النسخ والجدولة إلى المراقبة واختبار الاستعادة والتنفيذ، تُبنى كل مرحلة وفق حساسية البيانات وأولوية الخدمة.",
    ),
    contextTitle: l(
      "چرا Backup فقط ذخیره یک کپی نیست؟",
      "Why backup is more than storing a copy",
      "لماذا النسخ الاحتياطي أكثر من حفظ نسخة؟",
    ),
    context: [
      b(
        l(
          "اطلاعات، سرمایه کسب‌وکار است",
          "Information is a business asset",
          "المعلومات أصل للأعمال",
        ),
        l(
          "داده‌های سازمان برای حفاظت واقعی به سیاست نگهداری، زمان‌بندی و مسئولیت مشخص نیاز دارند.",
          "Real protection needs defined retention, scheduling and ownership.",
          "تحتاج الحماية الفعلية إلى سياسة احتفاظ وجدولة ومسؤولية واضحة.",
        ),
      ),
      b(
        l(
          "نسخه سالم باید قابل بازیابی باشد",
          "A healthy copy must be recoverable",
          "يجب أن تكون النسخة السليمة قابلة للاستعادة",
        ),
        l(
          "موفق بودن Job پایان کار نیست؛ وضعیت نسخه و امکان Restore باید بررسی شود.",
          "A successful job is not the finish line; copy health and restore readiness must be checked.",
          "نجاح المهمة ليس النهاية؛ يجب التحقق من سلامة النسخة وجاهزية الاستعادة.",
        ),
      ),
      b(
        l(
          "سرویس‌های حیاتی اولویت یکسان ندارند",
          "Critical services have different priorities",
          "للخدمات الحيوية أولويات مختلفة",
        ),
        l(
          "سرور، پایگاه داده و فایل‌های کاری بر اساس اثر توقف و نیاز عملیاتی سطح‌بندی می‌شوند.",
          "Servers, databases and working files are tiered by outage impact and operational need.",
          "تُصنّف الخوادم وقواعد البيانات والملفات حسب أثر التوقف والحاجة التشغيلية.",
        ),
      ),
    ],
    capabilitiesTitle: l(
      "پشتیبان‌گیری برای بخش‌های حیاتی سازمان",
      "Protection for critical organizational workloads",
      "حماية لأحمال العمل الحيوية",
    ),
    capabilities: [
      b(
        l("VM Backup", "VM backup", "نسخ الآلات الافتراضية"),
        l(
          "محافظت از ماشین‌های مجازی، Application Server، Database Server، File Server و ERP Server.",
          "Protection for virtual machines, application, database, file and ERP servers.",
          "حماية الآلات الافتراضية وخوادم التطبيقات وقواعد البيانات والملفات وERP.",
        ),
      ),
      b(
        l("File Backup", "File backup", "نسخ الملفات"),
        l(
          "حفاظت از اسناد سازمانی، فایل کاربران، پوشه‌های اشتراکی و داده‌های Workspace.",
          "Protection for documents, user files, shared folders and workspace data.",
          "حماية المستندات وملفات المستخدمين والمجلدات المشتركة وبيانات مساحة العمل.",
        ),
      ),
      b(
        l("Application Backup", "Application backup", "نسخ التطبيقات"),
        l(
          "حفظ داده‌ها و تنظیمات سرویس‌های مهم مانند ERP، پایگاه داده و پیکربندی سامانه‌ها.",
          "Protect data and configuration for ERP, databases and other important services.",
          "حماية بيانات وإعدادات ERP وقواعد البيانات والخدمات المهمة.",
        ),
      ),
      b(
        l(
          "Monitoring و Verification",
          "Monitoring & verification",
          "المراقبة والتحقق",
        ),
        l(
          "پایش Jobها، بررسی خطاها، گزارش وضعیت و برنامه‌ریزی آزمون Restore.",
          "Monitor jobs, review failures, report status and plan restore checks.",
          "مراقبة المهام والأخطاء والتقارير وتخطيط اختبارات الاستعادة.",
        ),
      ),
    ],
    architectureTitle: l(
      "فناوری و معماری بازیابی",
      "Recovery technology and architecture",
      "تقنية وبنية الاستعادة",
    ),
    architectureBody: l(
      "زیرساخت ابریت Backup سه لایه عملیاتی را کنار هم قرار می‌دهد: اجرای نسخه، کنترل سلامت و برنامه بازیابی.",
      "AbrIT Backup combines three operational layers: copy execution, health control and recovery planning.",
      "تجمع AbrIT Backup ثلاث طبقات تشغيلية: تنفيذ النسخ، التحقق من السلامة، وتخطيط الاستعادة.",
    ),
    architecture: [
      b(
        l("زیرساخت Backup", "Backup infrastructure", "بنية النسخ"),
        l(
          "مدیریت نسخه‌های ماشین مجازی و سرویس‌های سازمانی.",
          "Manage virtual-machine and organizational-service copies.",
          "إدارة نسخ الآلات الافتراضية والخدمات المؤسسية.",
        ),
        ["Proxmox Backup Server", "Scheduled Backup"],
      ),
      b(
        l("کنترل و اطمینان", "Control & assurance", "التحكم والضمان"),
        l(
          "Monitoring، Verification، Restore Test و گزارش وضعیت.",
          "Monitoring, verification, restore testing and status reporting.",
          "المراقبة والتحقق واختبارات الاستعادة والتقارير.",
        ),
        ["Monitoring", "Restore Test"],
      ),
      b(
        l("تداوم کسب‌وکار", "Business continuity", "استمرارية الأعمال"),
        l(
          "طراحی RPO، RTO، Recovery Planning و مسیر Disaster Recovery.",
          "Design RPO, RTO, recovery planning and disaster-recovery paths.",
          "تصميم RPO وRTO وخطة الاستعادة ومسار التعافي من الكوارث.",
        ),
        ["RPO", "RTO"],
      ),
    ],
    showcaseTitle: l(
      "Backup هوشمند بر اساس اولویت واقعی سازمان",
      "Intelligent backup based on real organizational priorities",
      "نسخ ذكي وفق الأولويات الفعلية للمؤسسة",
    ),
    showcaseBody: l(
      "سطح حفاظت و زمان بازگشت هر سرویس باید شفاف و متناسب با اثر آن بر کسب‌وکار تعیین شود.",
      "Protection level and recovery time should be explicit and aligned with each service's business impact.",
      "يجب تحديد مستوى الحماية وزمن الاستعادة بوضوح وفق أثر كل خدمة على الأعمال.",
    ),
    showcase: [
      b(
        l(
          "RPO — سطح حفاظت از داده",
          "RPO — data protection point",
          "RPO — نقطة حماية البيانات",
        ),
        l(
          "فاصله زمانی موردنیاز بین نسخه‌ها را مشخص می‌کند و مبنای زمان‌بندی Backup است.",
          "Defines the required interval between copies and informs the backup schedule.",
          "يحدد الفترة المطلوبة بين النسخ ويقود جدول النسخ الاحتياطي.",
        ),
      ),
      b(
        l(
          "RTO — زمان هدف بازگشت",
          "RTO — recovery time target",
          "RTO — زمن الاستعادة المستهدف",
        ),
        l(
          "مشخص می‌کند هر سرویس در چه بازه‌ای باید دوباره در دسترس قرار گیرد.",
          "Defines how quickly each service should return to availability.",
          "يحدد المدة اللازمة لإعادة كل خدمة إلى العمل.",
        ),
      ),
    ],
    processTitle: l(
      "از ارزیابی تا Backup مدیریت‌شده",
      "From assessment to managed backup",
      "من التقييم إلى النسخ المُدار",
    ),
    process: [
      b(
        l("ارزیابی", "Assessment", "التقييم"),
        l(
          "بررسی سرویس‌ها، داده‌ها و نیاز سازمان.",
          "Review services, data and organizational needs.",
          "مراجعة الخدمات والبيانات والاحتياجات.",
        ),
      ),
      b(
        l("طراحی", "Design", "التصميم"),
        l(
          "تعریف سیاست Backup، Retention و Recovery.",
          "Define backup, retention and recovery policy.",
          "تحديد سياسة النسخ والاحتفاظ والاستعادة.",
        ),
      ),
      b(
        l("راه‌اندازی", "Deployment", "التنفيذ"),
        l(
          "اجرای Backup و تنظیم فرایندها.",
          "Deploy backup and configure workflows.",
          "تشغيل النسخ وضبط العمليات.",
        ),
      ),
      b(
        l("مدیریت مستمر", "Managed operation", "الإدارة المستمرة"),
        l(
          "Monitoring، آزمون Restore و نگهداری مستمر.",
          "Monitoring, restore testing and ongoing care.",
          "المراقبة واختبار الاستعادة والصيانة المستمرة.",
        ),
      ),
    ],
    technologies: [
      "Proxmox Backup Server",
      "VM Backup",
      "Monitoring",
      "Restore Test",
      "RPO",
      "RTO",
    ],
    ctaTitle: l(
      "Backup را به یک فرایند قابل اتکا تبدیل کنید",
      "Turn backup into a dependable operating process",
      "حوّل النسخ الاحتياطي إلى عملية تشغيل موثوقة",
    ),
    ctaBody: l(
      "برای طراحی سیاست Backup و Recovery متناسب با سرویس‌های حیاتی سازمان، ارزیابی را شروع کنید.",
      "Start an assessment to design backup and recovery around your critical services.",
      "ابدأ التقييم لتصميم النسخ والاستعادة حول خدمات مؤسستك الحيوية.",
    ),
    relatedManagedSlug: "backup-recovery",
  },
  {
    slug: "cloud-storage",
    code: "ABRIT CLOUD STORAGE",
    title: l(
      "ابریت Cloud Storage",
      "AbrIT Cloud Storage",
      "AbrIT Cloud Storage",
    ),
    category: l(
      "فضای فایل سازمانی",
      "Organizational file platform",
      "منصة ملفات مؤسسية",
    ),
    heroTitle: l(
      "مدیریت فایل‌های سازمانی؛ ساده، امن و یکپارچه",
      "Organizational files, simple, secure and unified",
      "ملفات المؤسسة؛ بسيطة وآمنة وموحّدة",
    ),
    heroBody: l(
      "ابریت Cloud Storage فایل‌های پراکنده کسب‌وکار را در یک بستر متمرکز برای نگهداری، اشتراک‌گذاری، همگام‌سازی و دسترسی کنترل‌شده قرار می‌دهد.",
      "AbrIT Cloud Storage brings scattered business files into one platform for storage, sharing, synchronization and controlled access.",
      "تجمع AbrIT Cloud Storage ملفات الأعمال المتفرقة في منصة واحدة للتخزين والمشاركة والمزامنة والوصول المنضبط.",
    ),
    pulse: [
      l(
        "ذخیره امن اطلاعات",
        "Secure information storage",
        "تخزين آمن للمعلومات",
      ),
      l(
        "ساختار فایل سازمانی",
        "Organizational file structure",
        "هيكل ملفات المؤسسة",
      ),
      l(
        "کنترل دسترسی کاربران",
        "Controlled user access",
        "ضبط وصول المستخدمين",
      ),
      l(
        "همگام‌سازی اطلاعات",
        "Information synchronization",
        "مزامنة المعلومات",
      ),
    ],
    overviewTitle: l(
      "یک مخزن مرکزی با کنترل سازمانی",
      "A central repository with organizational control",
      "مستودع مركزي بتحكم مؤسسي",
    ),
    overviewBody: l(
      "فایل‌ها به‌جای وابستگی به سیستم یا حساب شخصی کاربران، در یک ساختار مشخص قرار می‌گیرند و دسترسی آن‌ها بر اساس واحد، گروه و نقش مدیریت می‌شود.",
      "Files move away from personal devices and accounts into a defined structure, with access managed by team, group and role.",
      "تنتقل الملفات من الأجهزة والحسابات الشخصية إلى هيكل واضح مع إدارة الوصول حسب الوحدة والمجموعة والدور.",
    ),
    contextTitle: l(
      "کنترل واقعی روی اطلاعات سازمان",
      "Real control over organizational information",
      "تحكم فعلي في معلومات المؤسسة",
    ),
    context: [
      b(
        l("یک منبع مرکزی", "One central source", "مصدر مركزي واحد"),
        l(
          "فایل‌ها و اسناد در مخزن سازمانی مشخص نگهداری می‌شوند.",
          "Files and documents live in a defined organizational repository.",
          "تُحفظ الملفات والمستندات في مستودع مؤسسي واضح.",
        ),
      ),
      b(
        l(
          "استقلال از افراد",
          "Independent from individuals",
          "مستقل عن الأفراد",
        ),
        l(
          "Team Folderها به واحد سازمانی تعلق دارند، نه حساب شخصی یک کاربر.",
          "Team folders belong to the organization, not an individual's account.",
          "تنتمي مجلدات الفرق للمؤسسة لا لحساب فردي.",
        ),
      ),
      b(
        l("رشدپذیری ظرفیت", "Capacity that can grow", "سعة قابلة للنمو"),
        l(
          "زیرساخت Storage بر اساس حجم داده و مسیر رشد قابل توسعه طراحی می‌شود.",
          "Storage is designed around current volume and a practical growth path.",
          "تُصمم سعة التخزين وفق الحجم الحالي ومسار نمو عملي.",
        ),
      ),
    ],
    capabilitiesTitle: l(
      "قابلیت‌های Cloud Storage",
      "Cloud Storage capabilities",
      "قدرات Cloud Storage",
    ),
    capabilities: [
      b(
        l(
          "فضای فایل سازمانی",
          "Organizational file space",
          "مساحة ملفات مؤسسية",
        ),
        l(
          "مخزن مرکزی برای فایل‌ها و اسناد سازمان.",
          "A central repository for organizational files and documents.",
          "مستودع مركزي لملفات ومستندات المؤسسة.",
        ),
      ),
      b(
        l("Team Folder", "Team folders", "مجلدات الفرق"),
        l(
          "فضای مستقل برای واحدهایی مانند مالی، منابع انسانی، فروش و پروژه‌ها.",
          "Dedicated spaces for finance, HR, sales and projects.",
          "مساحات مستقلة للمالية والموارد البشرية والمبيعات والمشاريع.",
        ),
      ),
      b(
        l("File Synchronization", "File synchronization", "مزامنة الملفات"),
        l(
          "همگام‌سازی فایل‌ها بین Web، Desktop و Mobile.",
          "Synchronize files across web, desktop and mobile.",
          "مزامنة الملفات عبر الويب وسطح المكتب والجوال.",
        ),
      ),
      b(
        l("اشتراک‌گذاری کنترل‌شده", "Controlled sharing", "مشاركة منضبطة"),
        l(
          "اشتراک داخلی یا خارجی با سطح دسترسی مشخص.",
          "Internal or external sharing with defined access.",
          "مشاركة داخلية أو خارجية بصلاحيات محددة.",
        ),
      ),
      b(
        l("Version Management", "Version management", "إدارة الإصدارات"),
        l(
          "ثبت تغییرات و امکان بازگشت به نسخه‌های قبلی.",
          "Track changes and return to earlier versions.",
          "تتبع التغييرات والعودة إلى الإصدارات السابقة.",
        ),
      ),
      b(
        l("Permission Management", "Permission management", "إدارة الصلاحيات"),
        l(
          "مدیریت دسترسی بر اساس User، Group و Role.",
          "Manage access by user, group and role.",
          "إدارة الوصول حسب المستخدم والمجموعة والدور.",
        ),
      ),
    ],
    architectureTitle: l(
      "معماری چندلایه Cloud Storage",
      "A layered Cloud Storage architecture",
      "بنية Cloud Storage متعددة الطبقات",
    ),
    architectureBody: l(
      "پلتفرم فایل، زیرساخت ذخیره‌سازی و هویت سازمانی در کنار هم یک فضای فایل قابل مدیریت می‌سازند.",
      "The file platform, storage backend and organizational identity layer form one manageable file environment.",
      "تجمع منصة الملفات وبنية التخزين وهوية المؤسسة لتكوين بيئة ملفات قابلة للإدارة.",
    ),
    architecture: [
      b(
        l(
          "Nextcloud File Platform",
          "Nextcloud file platform",
          "منصة ملفات Nextcloud",
        ),
        l(
          "هسته مدیریت فایل، Sharing، Sync و Versioning.",
          "The core for storage, sharing, sync and versioning.",
          "النواة للتخزين والمشاركة والمزامنة والإصدارات.",
        ),
        ["Storage", "Sharing", "Sync"],
      ),
      b(
        l("Storage Backend", "Storage backend", "بنية التخزين"),
        l(
          "زیرساخت متناسب با مقیاس سازمان و توسعه ظرفیت.",
          "Storage sized for the organization and future capacity.",
          "تخزين مناسب لحجم المؤسسة ونمو السعة.",
        ),
        ["External Storage", "Enterprise Storage"],
      ),
      b(
        l("Identity Integration", "Identity integration", "تكامل الهوية"),
        l(
          "اتصال کاربران، گروه‌ها و Permissionها به ساختار سازمان.",
          "Connect users, groups and permissions to the organization.",
          "ربط المستخدمين والمجموعات والصلاحيات بالمؤسسة.",
        ),
        ["Active Directory", "LDAP"],
      ),
    ],
    showcaseTitle: l(
      "چرا ابریت Cloud Storage؟",
      "Why AbrIT Cloud Storage",
      "لماذا AbrIT Cloud Storage؟",
    ),
    showcaseBody: l(
      "Storage فقط ظرفیت نیست؛ ساختار، دسترسی و مدیریت روزمره بخش اصلی سرویس هستند.",
      "Storage is not only capacity; structure, access and daily management define the service.",
      "التخزين ليس سعة فقط؛ بل بنية ووصول وإدارة يومية.",
    ),
    showcase: [
      b(
        l("طراحی متناسب", "Purpose-fit design", "تصميم ملائم"),
        l(
          "بر اساس حجم داده، تعداد کاربران و ساختار فایل‌ها.",
          "Based on data volume, users and file structure.",
          "حسب حجم البيانات والمستخدمين وهيكل الملفات.",
        ),
      ),
      b(
        l(
          "مدیریت کامل سرویس",
          "Complete service management",
          "إدارة كاملة للخدمة",
        ),
        l(
          "از طراحی معماری تا Monitoring و نگهداری.",
          "From architecture design to monitoring and care.",
          "من تصميم البنية إلى المراقبة والصيانة.",
        ),
      ),
      b(
        l("کنترل روی داده", "Control over data", "التحكم بالبيانات"),
        l(
          "اطلاعات در ساختاری مشخص و قابل مدیریت قرار می‌گیرد.",
          "Information stays in a defined, manageable structure.",
          "تبقى المعلومات ضمن هيكل واضح وقابل للإدارة.",
        ),
      ),
    ],
    processTitle: l(
      "راه‌اندازی فضای فایل سازمانی",
      "Deploying the organizational file platform",
      "إطلاق منصة الملفات المؤسسية",
    ),
    process: [
      b(
        l("شناخت", "Discover", "الاكتشاف"),
        l(
          "بررسی حجم داده، کاربران و ساختار فعلی.",
          "Review data volume, users and current structure.",
          "مراجعة حجم البيانات والمستخدمين والهيكل الحالي.",
        ),
      ),
      b(
        l("طراحی", "Design", "التصميم"),
        l(
          "تعریف Storage، Team Folder و Permission.",
          "Define storage, team folders and permissions.",
          "تحديد التخزين ومجلدات الفرق والصلاحيات.",
        ),
      ),
      b(
        l("انتقال", "Migrate", "النقل"),
        l(
          "انتقال مرحله‌ای اطلاعات و آزمون دسترسی.",
          "Stage the migration and validate access.",
          "نقل البيانات تدريجياً واختبار الوصول.",
        ),
      ),
      b(
        l("مدیریت", "Manage", "الإدارة"),
        l(
          "پایش ظرفیت، کاربران و سلامت سرویس.",
          "Monitor capacity, users and service health.",
          "مراقبة السعة والمستخدمين وصحة الخدمة.",
        ),
      ),
    ],
    technologies: [
      "Nextcloud",
      "Enterprise Storage",
      "Active Directory",
      "LDAP",
      "File Sync",
      "Versioning",
    ],
    ctaTitle: l(
      "فایل‌های سازمان را از پراکندگی خارج کنید",
      "Move organizational files out of fragmentation",
      "أخرج ملفات المؤسسة من التشتت",
    ),
    ctaBody: l(
      "برای طراحی ساختار فایل، ظرفیت و دسترسی‌های مناسب سازمان، ارزیابی را شروع کنید.",
      "Start an assessment for the right file structure, capacity and access model.",
      "ابدأ التقييم لتصميم هيكل الملفات والسعة ونموذج الوصول المناسب.",
    ),
    relatedManagedSlug: "digital-workspace",
  },
  {
    slug: "workspace",
    code: "ABRIT WORKSPACE",
    title: l("ابریت Workspace", "AbrIT Workspace", "AbrIT Workspace"),
    category: l(
      "فضای کاری دیجیتال سازمان",
      "Organizational digital workspace",
      "مساحة العمل الرقمية للمؤسسة",
    ),
    heroTitle: l(
      "فایل‌ها، اسناد و همکاری تیم را به یک فضای کاری هوشمند تبدیل کنید",
      "Turn files, documents and teamwork into one intelligent workspace",
      "حوّل الملفات والمستندات والتعاون إلى مساحة عمل ذكية",
    ),
    heroBody: l(
      "ابریت Workspace یک فضای کاری امن و قابل توسعه برای ذخیره، اشتراک‌گذاری، ویرایش آنلاین اسناد و همکاری تیمی در بستری متمرکز است.",
      "AbrIT Workspace is a secure, extensible environment for storing, sharing, editing and collaborating on documents in one place.",
      "AbrIT Workspace بيئة آمنة وقابلة للتوسع لتخزين المستندات ومشاركتها وتحريرها والتعاون عليها في مكان واحد.",
    ),
    pulse: [
      l(
        "مدیریت فایل سازمانی",
        "Organizational file management",
        "إدارة ملفات المؤسسة",
      ),
      l(
        "همکاری تیمی روی اسناد",
        "Team document collaboration",
        "التعاون على المستندات",
      ),
      l(
        "کنترل دسترسی کاربران",
        "User access control",
        "التحكم بوصول المستخدمين",
      ),
      l(
        "دسترسی امن از هر مکان",
        "Secure access from anywhere",
        "وصول آمن من أي مكان",
      ),
    ],
    overviewTitle: l(
      "راهکار مدیریت هوشمند اطلاعات سازمان",
      "An intelligent organizational information environment",
      "بيئة ذكية لمعلومات المؤسسة",
    ),
    overviewBody: l(
      "Workspace ساختار پراکنده مبتنی بر فایل‌های شخصی را به فضای کاری مرکزی با مدیریت کاربران، کنترل دسترسی، Office Online و همکاری تیمی تبدیل می‌کند.",
      "Workspace replaces fragmented personal-file workflows with a central environment for users, access, online office and team collaboration.",
      "تستبدل Workspace تدفقات الملفات الشخصية المتفرقة ببيئة مركزية للمستخدمين والوصول والمكتب عبر الإنترنت والتعاون.",
    ),
    contextTitle: l(
      "چرا مدیریت سنتی فایل کافی نیست؟",
      "Why traditional file management is no longer enough",
      "لماذا لم تعد إدارة الملفات التقليدية كافية؟",
    ),
    context: [
      b(
        l("پراکندگی فایل‌ها", "Scattered files", "تشتت الملفات"),
        l(
          "اطلاعات میان سیستم کاربران، ایمیل و حافظه‌های شخصی پخش می‌شود.",
          "Information spreads across devices, email and personal storage.",
          "تنتشر المعلومات بين الأجهزة والبريد والتخزين الشخصي.",
        ),
      ),
      b(
        l("نسخه‌های متعدد", "Multiple versions", "إصدارات متعددة"),
        l(
          "پیدا کردن نسخه درست و همکاری روی سند دشوار می‌شود.",
          "Finding the right version and collaborating becomes difficult.",
          "يصعب العثور على الإصدار الصحيح والتعاون عليه.",
        ),
      ),
      b(
        l("کنترل محدود", "Limited control", "تحكم محدود"),
        l(
          "دید روشنی از دسترسی‌ها و تغییرات وجود ندارد.",
          "Access and change visibility becomes unclear.",
          "تصبح رؤية الصلاحيات والتغييرات غير واضحة.",
        ),
      ),
      b(
        l(
          "وابستگی به افراد",
          "Dependency on individuals",
          "الاعتماد على الأفراد",
        ),
        l(
          "با جابه‌جایی افراد، بخشی از دانش سازمان در معرض خطر قرار می‌گیرد.",
          "When people move on, organizational knowledge is put at risk.",
          "عند انتقال الأفراد تصبح معرفة المؤسسة عرضة للخطر.",
        ),
      ),
    ],
    capabilitiesTitle: l(
      "یک فضای کاری برای فایل، سند و همکاری",
      "One workspace for files, documents and collaboration",
      "مساحة واحدة للملفات والمستندات والتعاون",
    ),
    capabilities: [
      b(
        l("فایل سازمانی", "Organizational files", "ملفات المؤسسة"),
        l(
          "متمرکزسازی فایل‌ها و Team Folderهای واحدها.",
          "Centralize files and departmental team folders.",
          "مركزة الملفات ومجلدات فرق الإدارات.",
        ),
      ),
      b(
        l("اشتراک امن", "Secure sharing", "مشاركة آمنة"),
        l(
          "اشتراک داخلی و خارجی با کنترل دسترسی.",
          "Controlled internal and external sharing.",
          "مشاركة داخلية وخارجية منضبطة.",
        ),
      ),
      b(
        l("ویرایش آنلاین", "Online editing", "تحرير عبر الإنترنت"),
        l(
          "کار تیمی روی Word، Excel و PowerPoint با OnlyOffice.",
          "Collaborate on Word, Excel and PowerPoint with OnlyOffice.",
          "التعاون على Word وExcel وPowerPoint عبر OnlyOffice.",
        ),
      ),
      b(
        l(
          "Calendar و Contacts",
          "Calendar & contacts",
          "التقويم وجهات الاتصال",
        ),
        l(
          "مدیریت اطلاعات کاری و هماهنگی تیم‌ها.",
          "Coordinate work information and teams.",
          "تنسيق معلومات العمل والفرق.",
        ),
      ),
      b(
        l("Chat و Meeting", "Chat & meeting", "المحادثة والاجتماعات"),
        l(
          "ارتباط تیمی بر بستر Nextcloud Talk.",
          "Team communication through Nextcloud Talk.",
          "تواصل الفرق عبر Nextcloud Talk.",
        ),
      ),
      b(
        l(
          "Identity & Permission",
          "Identity & permission",
          "الهوية والصلاحيات",
        ),
        l(
          "اتصال به Active Directory و مدیریت گروه و نقش.",
          "Connect Active Directory and manage groups and roles.",
          "ربط Active Directory وإدارة المجموعات والأدوار.",
        ),
      ),
    ],
    architectureTitle: l(
      "فناوری، امنیت و مدیریت یکپارچه",
      "Technology, security and unified management",
      "التقنية والأمان والإدارة الموحدة",
    ),
    architectureBody: l(
      "سه لایه مکمل، تجربه همکاری را از زیرساخت ذخیره‌سازی تا ویرایش سند و هویت سازمانی پوشش می‌دهند.",
      "Three complementary layers cover collaboration from storage and document editing to organizational identity.",
      "تغطي ثلاث طبقات متكاملة التعاون من التخزين وتحرير المستندات إلى هوية المؤسسة.",
    ),
    architecture: [
      b(
        l("هسته همکاری", "Collaboration core", "نواة التعاون"),
        l(
          "Nextcloud برای File Storage، Sharing، Sync و Collaboration.",
          "Nextcloud for storage, sharing, sync and collaboration.",
          "Nextcloud للتخزين والمشاركة والمزامنة والتعاون.",
        ),
        ["Nextcloud"],
      ),
      b(
        l("کار روی اسناد", "Document work", "العمل على المستندات"),
        l(
          "OnlyOffice برای ویرایش آنلاین فایل‌های Office.",
          "OnlyOffice for online Office document editing.",
          "OnlyOffice لتحرير مستندات Office عبر الإنترنت.",
        ),
        ["OnlyOffice"],
      ),
      b(
        l("هویت و امنیت", "Identity & security", "الهوية والأمان"),
        l(
          "Active Directory، گروه‌ها، Role Based Access و Least Privilege.",
          "Active Directory, groups, role-based access and least privilege.",
          "Active Directory والمجموعات والوصول حسب الدور وأقل صلاحية.",
        ),
        ["Active Directory", "LDAP"],
      ),
    ],
    showcaseTitle: l(
      "چرا ابریت Workspace؟",
      "Why AbrIT Workspace",
      "لماذا AbrIT Workspace؟",
    ),
    showcaseBody: l(
      "یک Workspace فقط ابزار نیست؛ شیوه مدیریت اطلاعات، همکاری و رشد سازمان است.",
      "A workspace is not just a tool; it defines how information, collaboration and growth are managed.",
      "مساحة العمل ليست أداة فقط؛ بل طريقة إدارة المعلومات والتعاون والنمو.",
    ),
    showcase: [
      b(
        l("افزایش بهره‌وری", "Higher productivity", "إنتاجية أعلى"),
        l(
          "کارکنان بدون جابه‌جایی فایل میان ابزارها روی اطلاعات مشترک کار می‌کنند.",
          "Teams work on shared information without moving files between tools.",
          "تعمل الفرق على معلومات مشتركة دون نقل الملفات بين الأدوات.",
        ),
      ),
      b(
        l("کاهش ریسک اطلاعات", "Lower information risk", "خفض مخاطر المعلومات"),
        l(
          "مدیریت مرکزی فایل و دسترسی احتمال انتشار ناخواسته را کاهش می‌دهد.",
          "Central file and access management reduces unintended exposure.",
          "تقلل الإدارة المركزية للملفات والوصول من التسرب غير المقصود.",
        ),
      ),
      b(
        l("آماده رشد", "Ready to grow", "جاهز للنمو"),
        l(
          "با افزایش کاربران و حجم اطلاعات، ساختار قابل توسعه باقی می‌ماند.",
          "The structure remains extensible as users and information grow.",
          "يبقى الهيكل قابلاً للتوسع مع نمو المستخدمين والمعلومات.",
        ),
      ),
    ],
    processTitle: l(
      "از فایل‌های پراکنده تا Workspace سازمانی",
      "From scattered files to an organizational workspace",
      "من الملفات المتفرقة إلى مساحة عمل مؤسسية",
    ),
    process: [
      b(
        l("ارزیابی", "Assessment", "التقييم"),
        l(
          "بررسی فایل‌ها، کاربران و شیوه همکاری فعلی.",
          "Review files, users and current collaboration.",
          "مراجعة الملفات والمستخدمين والتعاون الحالي.",
        ),
      ),
      b(
        l("طراحی", "Design", "التصميم"),
        l(
          "تعریف ساختار Team Folder، هویت و Permission.",
          "Define team folders, identity and permissions.",
          "تحديد مجلدات الفرق والهوية والصلاحيات.",
        ),
      ),
      b(
        l("مهاجرت", "Migration", "الترحيل"),
        l(
          "انتقال مرحله‌ای و آزمون همکاری روی اسناد.",
          "Migrate in stages and validate document collaboration.",
          "الترحيل تدريجياً واختبار التعاون على المستندات.",
        ),
      ),
      b(
        l("مدیریت", "Management", "الإدارة"),
        l(
          "Monitoring، Backup، پشتیبانی و توسعه ظرفیت.",
          "Monitoring, backup, support and capacity growth.",
          "المراقبة والنسخ والدعم وتوسعة السعة.",
        ),
      ),
    ],
    technologies: [
      "Nextcloud",
      "OnlyOffice",
      "Nextcloud Talk",
      "Active Directory",
      "LDAP",
      "Role Based Access",
    ],
    ctaTitle: l(
      "همکاری تیم را در یک فضای قابل مدیریت متمرکز کنید",
      "Centralize teamwork in one manageable environment",
      "اجمع تعاون الفريق في بيئة واحدة قابلة للإدارة",
    ),
    ctaBody: l(
      "برای طراحی Workspace متناسب با کاربران، فایل‌ها و ساختار دسترسی سازمان، ارزیابی را شروع کنید.",
      "Start an assessment for a workspace designed around your users, files and access model.",
      "ابدأ التقييم لمساحة عمل مصممة حول المستخدمين والملفات ونموذج الوصول.",
    ),
    relatedManagedSlug: "digital-workspace",
    comparison: {
      intro: l(
        "مدل ابریت روی کنترل معماری و مدیریت سرویس تمرکز دارد؛ راهکار مناسب باید بر اساس نیاز واقعی سازمان انتخاب شود.",
        "AbrIT emphasizes architectural control and managed operation; the right platform should follow the organization's actual needs.",
        "يركز AbrIT على التحكم بالبنية والإدارة التشغيلية؛ ويجب اختيار المنصة وفق احتياجات المؤسسة الفعلية.",
      ),
      columns: [
        l("قابلیت", "Capability", "القدرة"),
        l("ابریت Workspace", "AbrIT Workspace", "AbrIT Workspace"),
        l("Microsoft 365", "Microsoft 365", "Microsoft 365"),
        l("Google Workspace", "Google Workspace", "Google Workspace"),
        l("Dropbox Business", "Dropbox Business", "Dropbox Business"),
      ],
      rows: [
        {
          label: l(
            "فضای فایل سازمانی",
            "Organizational file space",
            "مساحة ملفات مؤسسية",
          ),
          values: [
            l("Nextcloud مدیریت‌شده", "Managed Nextcloud", "Nextcloud مُدار"),
            l(
              "OneDrive / SharePoint",
              "OneDrive / SharePoint",
              "OneDrive / SharePoint",
            ),
            l("Google Drive", "Google Drive", "Google Drive"),
            l("Dropbox Storage", "Dropbox Storage", "Dropbox Storage"),
          ],
        },
        {
          label: l(
            "ویرایش آنلاین اسناد",
            "Online document editing",
            "تحرير المستندات",
          ),
          values: [
            l("OnlyOffice", "OnlyOffice", "OnlyOffice"),
            l("Office Online", "Office Online", "Office Online"),
            l("Google Docs", "Google Docs", "Google Docs"),
            l("محدود", "Limited", "محدود"),
          ],
        },
        {
          label: l("هویت سازمانی", "Organizational identity", "هوية المؤسسة"),
          values: [
            l(
              "Active Directory / LDAP",
              "Active Directory / LDAP",
              "Active Directory / LDAP",
            ),
            l("Entra ID", "Entra ID", "Entra ID"),
            l("Identity Services", "Identity Services", "Identity Services"),
            l("محدود", "Limited", "محدود"),
          ],
        },
        {
          label: l("مدل مدیریت", "Operating model", "نموذج الإدارة"),
          values: [
            l(
              "سرویس مدیریت‌شده ابریت",
              "AbrIT managed service",
              "خدمة AbrIT مُدارة",
            ),
            l("Self-Service", "Self-service", "خدمة ذاتية"),
            l("Self-Service", "Self-service", "خدمة ذاتية"),
            l("Self-Service", "Self-service", "خدمة ذاتية"),
          ],
        },
        {
          label: l(
            "سفارشی‌سازی معماری",
            "Architecture customization",
            "تخصيص البنية",
          ),
          values: [
            l("بر اساس نیاز سازمان", "Purpose-fit", "حسب حاجة المؤسسة"),
            l("متوسط", "Moderate", "متوسط"),
            l("متوسط", "Moderate", "متوسط"),
            l("محدود", "Limited", "محدود"),
          ],
        },
      ],
    },
  },
  {
    slug: "voice",
    code: "ABRIT VOICE",
    title: l("ابریت Voice", "AbrIT Voice", "AbrIT Voice"),
    category: l(
      "تلفن سازمانی VoIP",
      "Organizational VoIP",
      "اتصالات VoIP مؤسسية",
    ),
    heroTitle: l(
      "ارتباطات سازمان را از یک تلفن ساده به زیرساخت هوشمند تبدیل کنید",
      "Turn business telephony into intelligent communications infrastructure",
      "حوّل هاتف المؤسسة إلى بنية اتصالات ذكية",
    ),
    heroBody: l(
      "ابریت Voice راهکار VoIP سازمانی برای مدیریت تماس‌ها، اتصال شعب، داخلی‌های کاربران و ایجاد بستر ارتباطی امن و قابل توسعه است.",
      "AbrIT Voice is an organizational VoIP service for call management, branch connectivity, user extensions and secure, extensible communications.",
      "AbrIT Voice خدمة VoIP مؤسسية لإدارة المكالمات وربط الفروع وامتدادات المستخدمين واتصالات آمنة قابلة للتوسع.",
    ),
    pulse: [
      l("ارتباط سریع‌تر", "Faster communication", "تواصل أسرع"),
      l(
        "مدیریت هوشمند تماس",
        "Intelligent call management",
        "إدارة ذكية للمكالمات",
      ),
      l("اتصال شعب", "Branch connectivity", "ربط الفروع"),
      l("توسعه آسان", "Easy growth", "توسع سهل"),
    ],
    overviewTitle: l(
      "یک مرکز تلفن سازمانی، تحت مدیریت ابریت",
      "An organizational phone system managed by AbrIT",
      "نظام هاتفي مؤسسي تديره AbrIT",
    ),
    overviewBody: l(
      "از PBX و داخلی‌ها تا IVR، صف تماس، گزارش‌گیری و دورکاری؛ سرویس توسط تیم ابریت طراحی، راه‌اندازی، مستند و پشتیبانی می‌شود.",
      "From PBX and extensions to IVR, queues, reporting and remote work, the service is designed, deployed, documented and supported by AbrIT.",
      "من PBX والامتدادات إلى IVR والصفوف والتقارير والعمل عن بُعد، تصمم AbrIT الخدمة وتنفذها وتوثقها وتدعمها.",
    ),
    contextTitle: l(
      "چرا سازمان‌ها به Voice مدیریت‌شده نیاز دارند؟",
      "Why organizations need managed voice",
      "لماذا تحتاج المؤسسات إلى Voice مُدار؟",
    ),
    context: [
      b(
        l(
          "کاهش هزینه ارتباطات",
          "Lower communication cost",
          "خفض تكلفة الاتصالات",
        ),
        l(
          "تماس داخلی، بین شعب و کاربران راه دور در یک بستر هماهنگ مدیریت می‌شود.",
          "Internal, branch and remote-user calling is managed in one environment.",
          "تُدار مكالمات الداخل والفروع والمستخدمين عن بُعد في بيئة واحدة.",
        ),
      ),
      b(
        l("مدیریت متمرکز", "Central management", "إدارة مركزية"),
        l(
          "داخلی‌ها، کاربران و سناریوهای تلفنی از یک پنل کنترل می‌شوند.",
          "Extensions, users and call flows are controlled centrally.",
          "تُدار الامتدادات والمستخدمون ومسارات الاتصال مركزياً.",
        ),
      ),
      b(
        l("آماده رشد", "Ready to scale", "جاهز للتوسع"),
        l(
          "افزودن کاربر یا شعبه بدون بازطراحی کامل سیستم انجام می‌شود.",
          "Users and branches can be added without redesigning the whole system.",
          "يمكن إضافة المستخدمين والفروع دون إعادة تصميم النظام بالكامل.",
        ),
      ),
      b(
        l(
          "ارتباط از هر مکان",
          "Communication from anywhere",
          "تواصل من أي مكان",
        ),
        l(
          "کاربران دفتر، شعب و دورکار به بستر ارتباطی سازمان متصل می‌شوند.",
          "Office, branch and remote users connect to the same communication platform.",
          "يتصل مستخدمو المكتب والفروع والعمل عن بُعد بالمنصة نفسها.",
        ),
      ),
    ],
    capabilitiesTitle: l(
      "امکانات ارتباطی ابریت Voice",
      "AbrIT Voice communication capabilities",
      "قدرات AbrIT Voice للاتصالات",
    ),
    capabilities: [
      b(
        l("PBX سازمانی", "Organizational PBX", "PBX مؤسسي"),
        l(
          "مدیریت داخلی‌ها، تماس‌ها، صف‌ها و سناریوهای ارتباطی.",
          "Manage extensions, calls, queues and business call flows.",
          "إدارة الامتدادات والمكالمات والصفوف ومسارات العمل.",
        ),
      ),
      b(
        l("مدیریت کاربران", "User management", "إدارة المستخدمين"),
        l(
          "ایجاد داخلی و سطح دسترسی متناسب با ساختار سازمان.",
          "Create extensions and access aligned with the organization.",
          "إنشاء الامتدادات والصلاحيات حسب هيكل المؤسسة.",
        ),
      ),
      b(
        l("IVR هوشمند", "Intelligent IVR", "IVR ذكي"),
        l(
          "هدایت سریع تماس به بخش و کارشناس مناسب.",
          "Route calls quickly to the right team or specialist.",
          "توجيه المكالمات سريعاً إلى الفريق أو المختص المناسب.",
        ),
      ),
      b(
        l("ارتباط بین شعب", "Branch connectivity", "ربط الفروع"),
        l(
          "داخلی یکپارچه میان دفتر مرکزی و شعب.",
          "Unified internal calling between headquarters and branches.",
          "اتصال داخلي موحد بين المقر والفروع.",
        ),
      ),
      b(
        l("SIP و تجهیزات", "SIP & devices", "SIP والأجهزة"),
        l(
          "پشتیبانی از تلفن IP، Softphone و سرویس‌های استاندارد SIP.",
          "Support IP phones, softphones and standard SIP services.",
          "دعم هواتف IP والتطبيقات وخدمات SIP القياسية.",
        ),
      ),
      b(
        l("گزارش تماس", "Call reporting", "تقارير المكالمات"),
        l(
          "اطلاعات تماس و گزارش مدیریتی برای تحلیل عملکرد.",
          "Call information and management reporting for analysis.",
          "معلومات المكالمات وتقارير الإدارة للتحليل.",
        ),
      ),
      b(
        l("Fax سازمانی", "Organizational fax", "فاكس مؤسسي"),
        l(
          "در صورت نیاز، پیاده‌سازی Fax بر بستر VoIP.",
          "Optional fax delivery over VoIP.",
          "إتاحة الفاكس عبر VoIP عند الحاجة.",
        ),
      ),
      b(
        l("Multi-Tenant", "Multi-tenant", "متعدد المستأجرين"),
        l(
          "جداسازی چند محیط تلفنی در معماری‌های موردنیاز.",
          "Separate multiple telephony environments where required.",
          "فصل بيئات هاتفية متعددة عند الحاجة.",
        ),
      ),
    ],
    architectureTitle: l(
      "همراهی کامل از راه‌اندازی تا مدیریت روزمره",
      "Complete support from launch to daily operation",
      "مرافقة كاملة من الإطلاق إلى التشغيل اليومي",
    ),
    architectureBody: l(
      "ابریت فقط PBX را نصب نمی‌کند؛ طراحی سناریو، تنظیم کاربران، تست، مستندسازی، Monitoring و پشتیبانی دوره‌ای بخشی از سرویس است.",
      "AbrIT does more than install a PBX; call-flow design, users, testing, documentation, monitoring and periodic support are part of the service.",
      "لا تكتفي AbrIT بتركيب PBX؛ بل تشمل الخدمة تصميم المسارات والمستخدمين والاختبار والتوثيق والمراقبة والدعم.",
    ),
    architecture: [
      b(
        l("طراحی سناریو", "Call-flow design", "تصميم مسارات الاتصال"),
        l(
          "معماری بر اساس کاربران، شعب و فرایندهای کاری.",
          "Architecture based on users, branches and workflows.",
          "بنية حسب المستخدمين والفروع وسير العمل.",
        ),
        ["Call Flow", "IVR"],
      ),
      b(
        l("راه‌اندازی و تست", "Deployment & testing", "التنفيذ والاختبار"),
        l(
          "پیکربندی PBX، داخلی‌ها، SIP و آزمون تماس.",
          "Configure PBX, extensions and SIP, then validate calls.",
          "إعداد PBX والامتدادات وSIP واختبار المكالمات.",
        ),
        ["PBX", "SIP"],
      ),
      b(
        l("مدیریت سرویس", "Service management", "إدارة الخدمة"),
        l(
          "مستندسازی، Monitoring و پشتیبانی دوره‌ای.",
          "Documentation, monitoring and periodic support.",
          "التوثيق والمراقبة والدعم الدوري.",
        ),
        ["Monitoring", "Support"],
      ),
    ],
    showcaseTitle: l(
      "ابریت Voice مناسب چه سازمان‌هایی است؟",
      "Who AbrIT Voice fits",
      "لمن تناسب AbrIT Voice؟",
    ),
    showcaseBody: l(
      "معماری بر اساس تعداد کاربران، شعب و الگوی پاسخ‌گویی طراحی می‌شود.",
      "The architecture follows user count, branch structure and call-handling model.",
      "تُصمم البنية حسب عدد المستخدمين والفروع ونموذج التعامل مع المكالمات.",
    ),
    showcase: [
      b(
        l(
          "شرکت‌های کوچک و متوسط",
          "Small and medium businesses",
          "الشركات الصغيرة والمتوسطة",
        ),
        l(
          "داخلی سازمانی، IVR و مدیریت تماس‌ها.",
          "Extensions, IVR and managed call handling.",
          "امتدادات وIVR وإدارة المكالمات.",
        ),
      ),
      b(
        l(
          "سازمان‌های چندشعبه‌ای",
          "Multi-branch organizations",
          "المؤسسات متعددة الفروع",
        ),
        l(
          "ارتباط بین شعب، مدیریت مرکزی و کاهش هزینه ارتباطات.",
          "Branch calling, central management and lower communication cost.",
          "ربط الفروع والإدارة المركزية وخفض التكلفة.",
        ),
      ),
      b(
        l(
          "شرکت‌های خدماتی و Call Center",
          "Service teams & call centers",
          "فرق الخدمات ومراكز الاتصال",
        ),
        l(
          "صف تماس، گزارش عملکرد و مدیریت کارشناسان.",
          "Call queues, performance reporting and agent management.",
          "صفوف المكالمات وتقارير الأداء وإدارة الوكلاء.",
        ),
      ),
    ],
    processTitle: l(
      "از نیازسنجی تا مدیریت ارتباطات",
      "From discovery to managed communications",
      "من تحليل الحاجة إلى اتصالات مُدارة",
    ),
    process: [
      b(
        l("نیازسنجی", "Discover", "التحليل"),
        l(
          "بررسی کاربران، خطوط، شعب و سناریوهای تماس.",
          "Review users, lines, branches and call flows.",
          "مراجعة المستخدمين والخطوط والفروع والمسارات.",
        ),
      ),
      b(
        l("طراحی", "Design", "التصميم"),
        l(
          "طراحی PBX، IVR، صف و سطح دسترسی.",
          "Design PBX, IVR, queues and permissions.",
          "تصميم PBX وIVR والصفوف والصلاحيات.",
        ),
      ),
      b(
        l("اجرا", "Deploy", "التنفيذ"),
        l(
          "نصب، پیکربندی، اتصال SIP و تست تماس.",
          "Install, configure, connect SIP and test calls.",
          "التركيب والإعداد وربط SIP واختبار المكالمات.",
        ),
      ),
      b(
        l("پشتیبانی", "Operate", "التشغيل"),
        l(
          "مستندسازی، Monitoring و بهبود دوره‌ای.",
          "Document, monitor and improve over time.",
          "التوثيق والمراقبة والتحسين المستمر.",
        ),
      ),
    ],
    technologies: [
      "PBX",
      "VoIP",
      "SIP",
      "IVR",
      "Call Queue",
      "Monitoring",
      "Multi-Tenant",
    ],
    ctaTitle: l(
      "آماده ارتقای سیستم ارتباطی سازمان هستید؟",
      "Ready to upgrade organizational communications?",
      "هل أنت مستعد لتطوير اتصالات المؤسسة؟",
    ),
    ctaBody: l(
      "با بررسی تعداد کاربران، شعب و فرایندهای تماس، معماری مناسب Voice برای سازمان شما طراحی می‌شود.",
      "We design the right Voice architecture after reviewing users, branches and call workflows.",
      "نصمم بنية Voice المناسبة بعد مراجعة المستخدمين والفروع ومسارات الاتصال.",
    ),
    relatedManagedSlug: "business-telephony",
  },
];

export const independentServiceExtensions: Record<
  IndependentService["slug"],
  IndependentServiceExtension
> = {
  backup: {
    deliverablesTitle: l(
      "در پایان فقط یک Backup Job ندارید؛ یک برنامه بازیابی دارید",
      "You finish with more than a backup job—you have a recovery program",
      "لن تحصل فقط على مهمة نسخ؛ بل على برنامج استعادة",
    ),
    deliverablesBody: l(
      "خروجی سرویس باید برای تیم فناوری اطلاعات قابل بررسی، برای مدیریت قابل گزارش و هنگام حادثه قابل اجرا باشد.",
      "The service output must be reviewable by IT, reportable to management and executable during an incident.",
      "يجب أن تكون مخرجات الخدمة قابلة للمراجعة من فريق التقنية، وللتقرير أمام الإدارة، وللتنفيذ عند الحوادث.",
    ),
    deliverables: [
      b(
        l(
          "فهرست دارایی و اولویت سرویس‌ها",
          "Asset and service-priority inventory",
          "جرد الأصول وأولويات الخدمات",
        ),
        l(
          "ماشین‌های مجازی، فایل‌ها، پایگاه‌های داده و سرویس‌های حیاتی بر اساس اثر توقف دسته‌بندی می‌شوند.",
          "Virtual machines, files, databases and critical services are classified by outage impact.",
          "تُصنّف الآلات الافتراضية والملفات وقواعد البيانات والخدمات الحيوية حسب أثر التوقف.",
        ),
      ),
      b(
        l(
          "سیاست Backup و Retention",
          "Backup and retention policy",
          "سياسة النسخ والاحتفاظ",
        ),
        l(
          "نوع نسخه، زمان‌بندی، دوره نگهداری و مسئولیت بررسی برای هر گروه از داده‌ها مشخص می‌شود.",
          "Copy type, schedule, retention period and review responsibility are defined for each data group.",
          "يُحدد نوع النسخة والجدول وفترة الاحتفاظ ومسؤولية المراجعة لكل مجموعة بيانات.",
        ),
      ),
      b(
        l(
          "گزارش سلامت و Verification",
          "Health and verification report",
          "تقرير السلامة والتحقق",
        ),
        l(
          "موفقیت Jobها، خطاها، ظرفیت و وضعیت نسخه‌ها در یک چرخه مشخص کنترل و گزارش می‌شود.",
          "Job success, failures, capacity and copy health are checked and reported on a defined cycle.",
          "تُراقب نجاح المهام والأخطاء والسعة وسلامة النسخ ويُرفع تقرير دوري عنها.",
        ),
      ),
      b(
        l(
          "برنامه Restore و مسیر بازیابی",
          "Restore plan and recovery path",
          "خطة الاستعادة ومسار التعافي",
        ),
        l(
          "روش بازگردانی، ترتیب سرویس‌ها، آزمون Restore و تصمیم‌های RPO/RTO به‌صورت روشن مستند می‌شوند.",
          "Restore method, service order, restore tests and RPO/RTO decisions are clearly documented.",
          "تُوثق طريقة الاستعادة وترتيب الخدمات واختباراتها وقرارات RPO/RTO بوضوح.",
        ),
      ),
    ],
    managedScopeTitle: l(
      "چرخه‌ای که هر روز باید سالم بماند",
      "A lifecycle that must remain healthy every day",
      "دورة يجب أن تبقى سليمة كل يوم",
    ),
    managedScopeBody: l(
      "Backup یک اقدام یک‌باره نیست. سرویس مدیریت‌شده، اجرا، کنترل، گزارش و آمادگی بازیابی را در یک چرخه پیوسته نگه می‌دارد.",
      "Backup is not a one-time action. Managed operation keeps execution, control, reporting and recovery readiness in one continuous cycle.",
      "النسخ ليس إجراءً لمرة واحدة؛ فالتشغيل المُدار يحافظ على التنفيذ والتحكم والتقارير وجاهزية الاستعادة ضمن دورة مستمرة.",
    ),
    managedScope: [
      b(
        l("اجرا", "Run", "التنفيذ"),
        l(
          "اجرای زمان‌بندی‌شده Backup برای VM، فایل و سرویس‌های منتخب.",
          "Scheduled backup execution for selected VMs, files and services.",
          "تنفيذ النسخ المجدول للآلات والملفات والخدمات المختارة.",
        ),
        ["Scheduled Backup"],
      ),
      b(
        l("کنترل", "Verify", "التحقق"),
        l(
          "پایش خطا، سلامت نسخه، ظرفیت مخزن و نتیجه Jobها.",
          "Monitor failures, copy health, repository capacity and job results.",
          "مراقبة الأخطاء وسلامة النسخ وسعة المستودع ونتائج المهام.",
        ),
        ["Monitoring", "Verification"],
      ),
      b(
        l("آزمون", "Test", "الاختبار"),
        l(
          "برنامه‌ریزی Restore Test برای اطمینان از قابل‌استفاده بودن نسخه‌ها.",
          "Plan restore tests to confirm that copies are usable.",
          "تخطيط اختبارات الاستعادة للتأكد من قابلية استخدام النسخ.",
        ),
        ["Restore Test"],
      ),
      b(
        l("بهبود", "Improve", "التحسين"),
        l(
          "بازبینی سیاست‌ها با تغییر سرویس‌ها، ظرفیت و اولویت‌های کسب‌وکار.",
          "Review policies as services, capacity and business priorities change.",
          "مراجعة السياسات مع تغير الخدمات والسعة وأولويات الأعمال.",
        ),
        ["RPO", "RTO"],
      ),
    ],
    faqTitle: l(
      "پیش از طراحی Backup چه چیزهایی باید روشن باشد؟",
      "What should be clear before backup design?",
      "ما الذي يجب توضيحه قبل تصميم النسخ؟",
    ),
    faqs: [
      {
        question: l(
          "آیا موفق بودن Backup به معنی قابل‌بازیابی بودن آن است؟",
          "Does a successful backup mean it is recoverable?",
          "هل نجاح النسخ يعني أنه قابل للاستعادة؟",
        ),
        answer: l(
          "خیر. موفقیت Job فقط اجرای فرایند را نشان می‌دهد؛ سلامت نسخه و امکان Restore باید با Verification و آزمون بازیابی بررسی شود.",
          "No. Job success only confirms execution; copy health and restore readiness require verification and recovery testing.",
          "لا. نجاح المهمة يؤكد التنفيذ فقط؛ أما سلامة النسخة وجاهزية الاستعادة فتحتاجان إلى التحقق والاختبار.",
        ),
      },
      {
        question: l(
          "چه داده‌ها و سرویس‌هایی می‌توانند پوشش داده شوند؟",
          "Which data and services can be covered?",
          "ما البيانات والخدمات التي يمكن تغطيتها؟",
        ),
        answer: l(
          "ماشین‌های مجازی، File Server، فایل کاربران، پوشه‌های اشتراکی، Workspace، پایگاه داده، ERP و پیکربندی سرویس‌ها پس از ارزیابی در دامنه قرار می‌گیرند.",
          "VMs, file servers, user files, shared folders, workspace data, databases, ERP and service configuration can enter scope after assessment.",
          "يمكن أن يشمل النطاق الآلات الافتراضية وخوادم الملفات وملفات المستخدمين والمجلدات المشتركة وبيانات Workspace وقواعد البيانات وERP والإعدادات بعد التقييم.",
        ),
      },
      {
        question: l(
          "RPO و RTO چگونه تعیین می‌شوند؟",
          "How are RPO and RTO defined?",
          "كيف يتم تحديد RPO وRTO؟",
        ),
        answer: l(
          "بر اساس حساسیت داده، اثر توقف سرویس، حجم اطلاعات و زمان قابل‌قبول برای بازگشت؛ بنابراین برای همه سرویس‌ها یک عدد یکسان در نظر گرفته نمی‌شود.",
          "They are based on data sensitivity, outage impact, data volume and acceptable return time, so one value is not applied to every service.",
          "يُحددان حسب حساسية البيانات وأثر التوقف وحجم المعلومات والزمن المقبول للعودة، لذلك لا تُطبق قيمة واحدة على جميع الخدمات.",
        ),
      },
      {
        question: l(
          "پس از راه‌اندازی چه چیزی مدیریت می‌شود؟",
          "What is managed after deployment?",
          "ما الذي تتم إدارته بعد الإطلاق؟",
        ),
        answer: l(
          "Jobها، خطاها، ظرفیت، سلامت نسخه‌ها، گزارش‌ها، Restore Test و تغییرات موردنیاز در سیاست Backup به‌صورت مستمر دنبال می‌شوند.",
          "Jobs, failures, capacity, copy health, reports, restore tests and required policy changes are followed continuously.",
          "تتم متابعة المهام والأخطاء والسعة وسلامة النسخ والتقارير واختبارات الاستعادة وتعديلات السياسة باستمرار.",
        ),
      },
    ],
  },
  "cloud-storage": {
    deliverablesTitle: l(
      "یک ساختار فایل که متعلق به سازمان است، نه دستگاه کاربران",
      "A file structure owned by the organization—not user devices",
      "هيكل ملفات تملكه المؤسسة لا أجهزة المستخدمين",
    ),
    deliverablesBody: l(
      "هدف فقط فراهم‌کردن فضا نیست؛ فایل‌ها باید جای مشخص، مالکیت سازمانی، دسترسی قابل‌کنترل و مسیر رشد داشته باشند.",
      "The goal is not storage alone; files need a defined home, organizational ownership, controlled access and a growth path.",
      "الهدف ليس توفير مساحة فقط؛ بل يجب أن يكون للملفات مكان واضح وملكية مؤسسية ووصول منضبط ومسار للنمو.",
    ),
    deliverables: [
      b(
        l(
          "ساختار مخزن و Team Folder",
          "Repository and team-folder structure",
          "هيكل المستودع ومجلدات الفرق",
        ),
        l(
          "فضای واحدهای Finance، HR، Sales و Projects بر اساس ساختار واقعی سازمان طراحی می‌شود.",
          "Spaces for Finance, HR, Sales and Projects are designed around the real organizational structure.",
          "تُصمم مساحات Finance وHR وSales وProjects وفق الهيكل الفعلي للمؤسسة.",
        ),
      ),
      b(
        l("ماتریس دسترسی", "Access matrix", "مصفوفة الوصول"),
        l(
          "دسترسی User، Group و Role برای مشاهده، ویرایش و اشتراک‌گذاری مشخص می‌شود.",
          "User, group and role access is defined for viewing, editing and sharing.",
          "تُحدد صلاحيات المستخدم والمجموعة والدور للعرض والتحرير والمشاركة.",
        ),
      ),
      b(
        l(
          "سیاست Sync و Sharing",
          "Sync and sharing policy",
          "سياسة المزامنة والمشاركة",
        ),
        l(
          "نحوه همگام‌سازی Web، Desktop و Mobile و قواعد اشتراک داخلی و خارجی تعیین می‌شود.",
          "Web, desktop and mobile synchronization and internal/external sharing rules are defined.",
          "تُحدد مزامنة الويب وسطح المكتب والهاتف وقواعد المشاركة الداخلية والخارجية.",
        ),
      ),
      b(
        l(
          "برنامه ظرفیت و نگهداری",
          "Capacity and operations plan",
          "خطة السعة والتشغيل",
        ),
        l(
          "حجم اولیه، رشد ظرفیت، Storage Backend، Monitoring و نگهداری سرویس مشخص می‌شود.",
          "Initial volume, capacity growth, storage backend, monitoring and service care are defined.",
          "يُحدد الحجم الأولي ونمو السعة وبنية التخزين والمراقبة وصيانة الخدمة.",
        ),
      ),
    ],
    managedScopeTitle: l(
      "فایل از ایجاد تا اشتراک، تحت یک سیاست مشخص",
      "Files follow one policy from creation to sharing",
      "الملف يخضع لسياسة واحدة من الإنشاء إلى المشاركة",
    ),
    managedScopeBody: l(
      "پلتفرم فایل، زیرساخت ذخیره‌سازی و هویت سازمانی به‌صورت جداگانه ارزش محدودی دارند؛ سرویس آن‌ها را به یک جریان مدیریت‌شده متصل می‌کند.",
      "The file platform, storage infrastructure and organizational identity have limited value in isolation; the service connects them into one managed flow.",
      "منصة الملفات وبنية التخزين وهوية المؤسسة محدودة القيمة منفردة؛ وتربطها الخدمة في تدفق مُدار واحد.",
    ),
    managedScope: [
      b(
        l("ورود فایل", "Ingest", "الإدخال"),
        l(
          "انتقال فایل‌های پراکنده به ساختار مرکزی و Team Folderهای مشخص.",
          "Move scattered files into a central structure and defined team folders.",
          "نقل الملفات المتفرقة إلى هيكل مركزي ومجلدات فرق واضحة.",
        ),
        ["Team Folder"],
      ),
      b(
        l("همگام‌سازی", "Synchronize", "المزامنة"),
        l(
          "دسترسی هماهنگ از Web، Desktop و Mobile با کنترل نسخه‌ها.",
          "Consistent web, desktop and mobile access with version control.",
          "وصول متسق من الويب وسطح المكتب والهاتف مع التحكم بالإصدارات.",
        ),
        ["Web", "Desktop", "Mobile"],
      ),
      b(
        l("اشتراک", "Share", "المشاركة"),
        l(
          "اشتراک داخلی یا خارجی مطابق Permission و قواعد سازمان.",
          "Internal or external sharing according to organizational permissions and rules.",
          "مشاركة داخلية أو خارجية وفق الصلاحيات وقواعد المؤسسة.",
        ),
        ["Permission"],
      ),
      b(
        l("نگهداری", "Operate", "التشغيل"),
        l(
          "پایش سلامت، ظرفیت، کاربران، دسترسی‌ها و توسعه Storage Backend.",
          "Monitor health, capacity, users, access and storage-backend growth.",
          "مراقبة السلامة والسعة والمستخدمين والوصول ونمو بنية التخزين.",
        ),
        ["Monitoring"],
      ),
    ],
    faqTitle: l(
      "پرسش‌هایی درباره کنترل، همگام‌سازی و رشد",
      "Questions about control, synchronization and growth",
      "أسئلة حول التحكم والمزامنة والنمو",
    ),
    faqs: [
      {
        question: l(
          "تفاوت Cloud Storage سازمانی با یک فضای ذخیره‌سازی ساده چیست؟",
          "How is organizational Cloud Storage different from basic storage?",
          "ما الفرق بين Cloud Storage المؤسسي ومساحة التخزين العادية؟",
        ),
        answer: l(
          "علاوه بر فضا، ساختار Team Folder، مدیریت نسخه، Sync، Sharing، هویت سازمانی و Permission در یک معماری قابل‌مدیریت ارائه می‌شود.",
          "Beyond capacity, it provides team folders, versioning, sync, sharing, organizational identity and permissions in a manageable architecture.",
          "إلى جانب السعة، توفر مجلدات الفرق والإصدارات والمزامنة والمشاركة والهوية المؤسسية والصلاحيات ضمن بنية قابلة للإدارة.",
        ),
      },
      {
        question: l(
          "اگر یک کارمند از سازمان خارج شود، فایل‌های واحد چه می‌شوند؟",
          "What happens to team files when an employee leaves?",
          "ماذا يحدث لملفات الفريق عند مغادرة موظف؟",
        ),
        answer: l(
          "Team Folder به واحد سازمانی وابسته است، نه حساب شخصی؛ بنابراین مالکیت و دسترسی فایل‌ها می‌تواند مستقل از جابه‌جایی کاربران مدیریت شود.",
          "Team folders belong to the organizational unit rather than a personal account, so ownership and access remain manageable through staff changes.",
          "ترتبط مجلدات الفرق بالوحدة التنظيمية لا بالحساب الشخصي، لذلك تبقى الملكية والصلاحيات قابلة للإدارة مع تغير الموظفين.",
        ),
      },
      {
        question: l(
          "آیا دسترسی از موبایل و دسکتاپ ممکن است؟",
          "Can users access files from mobile and desktop?",
          "هل يمكن الوصول من الهاتف وسطح المكتب؟",
        ),
        answer: l(
          "بله؛ File Synchronization برای Web، Desktop و Mobile طراحی می‌شود و محدوده دسترسی مطابق سیاست سازمان کنترل خواهد شد.",
          "Yes. File synchronization covers web, desktop and mobile, while access remains controlled by organizational policy.",
          "نعم؛ تشمل المزامنة الويب وسطح المكتب والهاتف مع ضبط الوصول وفق سياسة المؤسسة.",
        ),
      },
      {
        question: l(
          "افزایش حجم داده چگونه مدیریت می‌شود؟",
          "How is data growth handled?",
          "كيف تتم إدارة نمو البيانات؟",
        ),
        answer: l(
          "Storage Backend بر اساس حجم فعلی و رشد موردانتظار طراحی می‌شود و ظرفیت، سلامت و نیاز توسعه در دوره بهره‌برداری پایش می‌شوند.",
          "The storage backend is sized for current volume and expected growth, with capacity and health monitored during operation.",
          "تُصمم بنية التخزين للحجم الحالي والنمو المتوقع، وتُراقب السعة والسلامة أثناء التشغيل.",
        ),
      },
    ],
  },
  workspace: {
    deliverablesTitle: l(
      "از فایل پراکنده تا یک محیط کاری قابل‌اداره",
      "From scattered files to a manageable work environment",
      "من ملفات متفرقة إلى بيئة عمل قابلة للإدارة",
    ),
    deliverablesBody: l(
      "Workspace زمانی کامل است که ساختار فایل، همکاری روی سند، هویت کاربران و عملیات روزمره در یک طراحی واحد دیده شوند.",
      "A workspace is complete when file structure, document collaboration, user identity and daily operation are designed together.",
      "تكتمل مساحة العمل عندما تُصمم بنية الملفات والتعاون على المستندات وهوية المستخدمين والتشغيل اليومي معاً.",
    ),
    deliverables: [
      b(
        l(
          "نقشه فضای کاری و Team Folder",
          "Workspace and team-folder map",
          "خريطة مساحة العمل ومجلدات الفرق",
        ),
        l(
          "ساختار واحدها، پروژه‌ها، فایل‌های مشترک و مالکیت اطلاعات تعریف می‌شود.",
          "Teams, projects, shared files and information ownership are mapped.",
          "تُحدد الوحدات والمشاريع والملفات المشتركة وملكية المعلومات.",
        ),
      ),
      b(
        l(
          "مدل هویت و Permission",
          "Identity and permission model",
          "نموذج الهوية والصلاحيات",
        ),
        l(
          "کاربران، گروه‌ها، Role Based Access و Least Privilege با ساختار سازمان هماهنگ می‌شوند.",
          "Users, groups, role-based access and least privilege are aligned with the organization.",
          "تُوائم حسابات المستخدمين والمجموعات والوصول حسب الدور وأقل صلاحية مع المؤسسة.",
        ),
      ),
      b(
        l(
          "همکاری و ویرایش اسناد",
          "Document collaboration",
          "التعاون على المستندات",
        ),
        l(
          "Nextcloud و OnlyOffice برای Sharing، Sync و کار آنلاین روی Word، Excel و PowerPoint یکپارچه می‌شوند.",
          "Nextcloud and OnlyOffice are integrated for sharing, sync and online work on Word, Excel and PowerPoint files.",
          "يتكامل Nextcloud وOnlyOffice للمشاركة والمزامنة والعمل على ملفات Word وExcel وPowerPoint.",
        ),
      ),
      b(
        l("برنامه بهره‌برداری", "Operations plan", "خطة التشغيل"),
        l(
          "Monitoring، Backup، پشتیبانی، مدیریت کاربران و توسعه ظرفیت در چرخه سرویس قرار می‌گیرند.",
          "Monitoring, backup, support, user management and capacity growth enter the service lifecycle.",
          "تدخل المراقبة والنسخ والدعم وإدارة المستخدمين ونمو السعة ضمن دورة الخدمة.",
        ),
      ),
    ],
    managedScopeTitle: l(
      "جریان همکاری؛ از ورود کاربر تا حفظ دانش سازمان",
      "The collaboration flow—from user access to retained knowledge",
      "تدفق التعاون؛ من دخول المستخدم إلى حفظ معرفة المؤسسة",
    ),
    managedScopeBody: l(
      "هدف Workspace فقط دسترسی به فایل نیست؛ باید همکاری سریع‌تر شود، ریسک اطلاعات کاهش پیدا کند و دانش سازمان با تغییر افراد باقی بماند.",
      "Workspace is not only about file access; it should accelerate collaboration, reduce information risk and retain knowledge through staff changes.",
      "لا تقتصر Workspace على الوصول للملفات؛ بل يجب أن تسرّع التعاون وتخفض مخاطر المعلومات وتحافظ على المعرفة مع تغير الأفراد.",
    ),
    managedScope: [
      b(
        l("ورود امن", "Authenticate", "الدخول الآمن"),
        l(
          "اتصال هویت، گروه‌ها و دسترسی‌ها به ساختار واقعی سازمان.",
          "Connect identity, groups and access to the real organization structure.",
          "ربط الهوية والمجموعات والصلاحيات بالهيكل الفعلي للمؤسسة.",
        ),
        ["Active Directory", "LDAP"],
      ),
      b(
        l("سازمان‌دهی", "Organize", "التنظيم"),
        l(
          "قرار دادن فایل‌ها در Team Folder و فضای پروژه به‌جای حساب‌های شخصی.",
          "Place files in team and project spaces rather than personal accounts.",
          "وضع الملفات في مساحات الفرق والمشاريع بدلاً من الحسابات الشخصية.",
        ),
        ["Team Folder"],
      ),
      b(
        l("همکاری", "Collaborate", "التعاون"),
        l(
          "اشتراک، Sync، ویرایش هم‌زمان سند و هماهنگی تیم‌ها در یک محیط.",
          "Share, sync, co-edit documents and coordinate teams in one environment.",
          "المشاركة والمزامنة والتحرير المشترك وتنسيق الفرق في بيئة واحدة.",
        ),
        ["OnlyOffice", "Nextcloud Talk"],
      ),
      b(
        l("حفظ و توسعه", "Retain & grow", "الحفظ والنمو"),
        l(
          "Versioning، Backup، Monitoring و افزایش ظرفیت هم‌زمان با رشد سازمان.",
          "Versioning, backup, monitoring and capacity growth as the organization expands.",
          "الإصدارات والنسخ والمراقبة وتوسعة السعة مع نمو المؤسسة.",
        ),
        ["Versioning", "Backup"],
      ),
    ],
    faqTitle: l(
      "پرسش‌هایی پیش از ساخت فضای کاری سازمان",
      "Questions before building an organizational workspace",
      "أسئلة قبل بناء مساحة العمل المؤسسية",
    ),
    faqs: [
      {
        question: l(
          "تفاوت Workspace با Cloud Storage چیست؟",
          "How is Workspace different from Cloud Storage?",
          "ما الفرق بين Workspace وCloud Storage؟",
        ),
        answer: l(
          "Cloud Storage روی مدیریت و همگام‌سازی فایل تمرکز دارد؛ Workspace علاوه بر آن، ویرایش آنلاین اسناد، Calendar، Contacts، Chat/Meeting و همکاری تیمی را در بر می‌گیرد.",
          "Cloud Storage focuses on file management and sync; Workspace adds online document editing, calendar, contacts, chat/meeting and broader collaboration.",
          "تركز Cloud Storage على إدارة الملفات ومزامنتها؛ وتضيف Workspace تحرير المستندات والتقويم وجهات الاتصال والمحادثة والاجتماعات والتعاون.",
        ),
      },
      {
        question: l(
          "آیا فایل‌های Microsoft Office قابل ویرایش هستند؟",
          "Can Microsoft Office files be edited?",
          "هل يمكن تحرير ملفات Microsoft Office؟",
        ),
        answer: l(
          "OnlyOffice برای ویرایش آنلاین فایل‌های Word، Excel و PowerPoint در معماری Workspace در نظر گرفته می‌شود.",
          "OnlyOffice is included in the workspace architecture for online editing of Word, Excel and PowerPoint files.",
          "يُستخدم OnlyOffice في بنية Workspace لتحرير ملفات Word وExcel وPowerPoint عبر الإنترنت.",
        ),
      },
      {
        question: l(
          "آیا اتصال به Active Directory ممکن است؟",
          "Can it connect to Active Directory?",
          "هل يمكن ربطه بـ Active Directory؟",
        ),
        answer: l(
          "بله؛ اتصال هویت سازمانی، گروه‌ها و Permissionها از طریق Active Directory یا LDAP بخشی از طراحی لایه Identity & Security است.",
          "Yes. Organizational identity, groups and permissions can connect through Active Directory or LDAP as part of the identity and security layer.",
          "نعم؛ يمكن ربط الهوية والمجموعات والصلاحيات عبر Active Directory أو LDAP ضمن طبقة الهوية والأمان.",
        ),
      },
      {
        question: l(
          "مدیریت سرویس با خود سازمان است؟",
          "Does the organization operate the service itself?",
          "هل تدير المؤسسة الخدمة بنفسها؟",
        ),
        answer: l(
          "مدل ابریت یک Managed Service است؛ طراحی، راه‌اندازی، Monitoring، Backup، پشتیبانی و توسعه ظرفیت می‌توانند در دامنه مدیریت ابریت باشند.",
          "AbrIT provides a managed-service model covering design, deployment, monitoring, backup, support and capacity growth.",
          "تقدم AbrIT نموذج خدمة مُدارة يشمل التصميم والتنفيذ والمراقبة والنسخ والدعم ونمو السعة.",
        ),
      },
    ],
  },
  voice: {
    deliverablesTitle: l(
      "یک سناریوی ارتباطی روشن، نه فقط یک مرکز تلفن نصب‌شده",
      "A clear communications model—not merely an installed PBX",
      "نموذج اتصالات واضح، لا مجرد PBX مركّب",
    ),
    deliverablesBody: l(
      "معماری Voice باید مشخص کند تماس چگونه وارد می‌شود، به چه مسیری می‌رود، کاربران و شعب چگونه متصل‌اند و سرویس چگونه پایش می‌شود.",
      "Voice architecture should define how calls enter, where they route, how users and branches connect and how the service is monitored.",
      "يجب أن تحدد بنية Voice كيفية دخول المكالمات ومسارها وربط المستخدمين والفروع وكيفية مراقبة الخدمة.",
    ),
    deliverables: [
      b(
        l("نقشه سناریوی تماس", "Call-flow map", "خريطة مسار المكالمات"),
        l(
          "ورودی تماس، IVR، صف، ساعات پاسخ‌گویی، مقصدها و مسیرهای جایگزین مستند می‌شوند.",
          "Inbound calls, IVR, queues, service hours, destinations and fallback paths are documented.",
          "تُوثق المكالمات الواردة وIVR والصفوف وساعات الخدمة والوجهات والمسارات البديلة.",
        ),
      ),
      b(
        l(
          "طرح داخلی‌ها و کاربران",
          "Extension and user plan",
          "خطة الامتدادات والمستخدمين",
        ),
        l(
          "داخلی‌ها، گروه‌ها، سطح دسترسی و نیاز کاربران دفتر، شعب و دورکار مشخص می‌شود.",
          "Extensions, groups, permissions and the needs of office, branch and remote users are defined.",
          "تُحدد الامتدادات والمجموعات والصلاحيات واحتياجات مستخدمي المقر والفروع والعمل عن بعد.",
        ),
      ),
      b(
        l(
          "پیکربندی PBX، SIP و IVR",
          "PBX, SIP and IVR configuration",
          "إعداد PBX وSIP وIVR",
        ),
        l(
          "مرکز تلفن، تجهیزات یا نرم‌افزارهای SIP، منوی صوتی و صف‌ها پیاده‌سازی و تست می‌شوند.",
          "The PBX, SIP devices or softphones, voice menu and queues are configured and tested.",
          "يتم إعداد واختبار PBX وأجهزة أو تطبيقات SIP والقائمة الصوتية والصفوف.",
        ),
      ),
      b(
        l(
          "مستندات و برنامه پشتیبانی",
          "Documentation and support plan",
          "التوثيق وخطة الدعم",
        ),
        l(
          "تنظیمات، نتایج تست، گزارش‌گیری، Monitoring و چرخه پشتیبانی دوره‌ای تحویل و اجرا می‌شوند.",
          "Configuration, test results, reporting, monitoring and the periodic support cycle are delivered and operated.",
          "تُسلّم وتُشغل الإعدادات ونتائج الاختبار والتقارير والمراقبة ودورة الدعم.",
        ),
      ),
    ],
    managedScopeTitle: l(
      "مسیر تماس، از ورودی تا پاسخ و گزارش",
      "The call journey—from entry to answer and reporting",
      "رحلة المكالمة؛ من الدخول إلى الرد والتقرير",
    ),
    managedScopeBody: l(
      "یک تماس موفق فقط به برقراری ارتباط وابسته نیست؛ هدایت درست، دسترسی کاربر، کیفیت سناریو و امکان تحلیل عملکرد هم بخشی از تجربه ارتباطی سازمان است.",
      "A successful call is more than connectivity; correct routing, user access, call-flow quality and performance analysis all shape the organizational experience.",
      "نجاح المكالمة لا يعتمد على الاتصال فقط؛ فالتوجيه الصحيح ووصول المستخدم وجودة المسار وتحليل الأداء كلها جزء من التجربة المؤسسية.",
    ),
    managedScope: [
      b(
        l("ورود", "Receive", "الاستقبال"),
        l(
          "دریافت تماس از خطوط و سرویس‌های ارتباطی استاندارد SIP.",
          "Receive calls from lines and standard SIP communication services.",
          "استقبال المكالمات من الخطوط وخدمات SIP القياسية.",
        ),
        ["SIP"],
      ),
      b(
        l("هدایت", "Route", "التوجيه"),
        l(
          "هدایت با IVR، صف انتظار، ساعات کاری و سناریوهای سازمان.",
          "Route with IVR, queues, business hours and organizational call flows.",
          "التوجيه عبر IVR والصفوف وساعات العمل ومسارات المؤسسة.",
        ),
        ["IVR", "Call Queue"],
      ),
      b(
        l("اتصال", "Connect", "الربط"),
        l(
          "اتصال داخلی‌ها، کاربران دورکار و شعب در یک ساختار یکپارچه.",
          "Connect extensions, remote users and branches in one structure.",
          "ربط الامتدادات والمستخدمين عن بعد والفروع في هيكل واحد.",
        ),
        ["PBX", "Multi-Branch"],
      ),
      b(
        l("کنترل", "Measure", "القياس"),
        l(
          "گزارش تماس، Monitoring، بررسی عملکرد و بهبود دوره‌ای سناریوها.",
          "Use call reports, monitoring and periodic call-flow improvement.",
          "استخدام تقارير المكالمات والمراقبة والتحسين الدوري للمسارات.",
        ),
        ["Reporting", "Monitoring"],
      ),
    ],
    faqTitle: l(
      "پرسش‌هایی درباره تجهیزات، شعب و توسعه",
      "Questions about equipment, branches and growth",
      "أسئلة حول التجهيزات والفروع والنمو",
    ),
    faqs: [
      {
        question: l(
          "آیا برای استفاده حتماً تلفن IP لازم است؟",
          "Are IP phones always required?",
          "هل هواتف IP مطلوبة دائماً؟",
        ),
        answer: l(
          "خیر؛ بسته به طراحی می‌توان از تلفن IP، Softphone و تجهیزات یا سرویس‌های سازگار با SIP استفاده کرد.",
          "No. Depending on the design, users can use IP phones, softphones and compatible SIP devices or services.",
          "لا؛ يمكن حسب التصميم استخدام هواتف IP أو التطبيقات الهاتفية أو الأجهزة والخدمات المتوافقة مع SIP.",
        ),
      },
      {
        question: l(
          "آیا چند شعبه می‌توانند داخلی یکدیگر را بگیرند؟",
          "Can multiple branches call each other internally?",
          "هل يمكن للفروع الاتصال داخلياً ببعضها؟",
        ),
        answer: l(
          "بله؛ ارتباط بین شعب و مدیریت مرکزی کاربران و داخلی‌ها یکی از سناریوهای اصلی Abrit Voice است.",
          "Yes. Inter-branch calling and central management of users and extensions are core AbrIT Voice scenarios.",
          "نعم؛ الاتصال بين الفروع والإدارة المركزية للمستخدمين والامتدادات من السيناريوهات الأساسية.",
        ),
      },
      {
        question: l(
          "آیا برای Call Center هم مناسب است؟",
          "Is it suitable for call centers?",
          "هل يناسب مراكز الاتصال؟",
        ),
        answer: l(
          "برای تیم‌های خدماتی می‌توان صف تماس، IVR، گزارش عملکرد و مدیریت کارشناسان را متناسب با فرایند پاسخ‌گویی طراحی کرد.",
          "Service teams can use queues, IVR, performance reports and agent management designed around their response workflow.",
          "يمكن لفرق الخدمة استخدام الصفوف وIVR وتقارير الأداء وإدارة الوكلاء وفق عملية الاستجابة.",
        ),
      },
      {
        question: l(
          "بعد از نصب چه پشتیبانی‌ای ارائه می‌شود؟",
          "What support follows deployment?",
          "ما الدعم المتاح بعد التنفيذ؟",
        ),
        answer: l(
          "مستندسازی تنظیمات، Monitoring سرویس، پشتیبانی دوره‌ای و بازبینی سناریوها با رشد کاربران یا شعب در مدل مدیریت‌شده قرار می‌گیرد.",
          "Configuration documentation, service monitoring, periodic support and call-flow reviews as users or branches grow are part of managed operation.",
          "يشمل التشغيل المُدار توثيق الإعدادات ومراقبة الخدمة والدعم الدوري ومراجعة المسارات مع نمو المستخدمين أو الفروع.",
        ),
      },
    ],
  },
};
