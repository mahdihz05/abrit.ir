from __future__ import annotations

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from apps.content.models import ContentBlock, ContentItem, ContentTranslation, ServiceProfile
from apps.core.models import DesignSettings, SiteSettings, SiteSettingsTranslation
from apps.navigation.models import Menu, MenuItem, MenuItemTranslation
from apps.pricing.models import AddonRate, ContractTerm, Package, PackageTranslation


LOCALES = ("fa", "en", "ar-ae")

SERVICES = [
    ("managed-it", ("مدیریت IT", "Managed IT", "إدارة تقنية المعلومات"), (
        "پشتیبانی کاربران، مدیریت سیستم‌ها، رسیدگی ساختاریافته به درخواست‌ها و مدیریت مستمر زیرساخت فناوری اطلاعات.",
        "User support, systems management, structured request handling and continuous management of your IT infrastructure.",
        "دعم المستخدمين وإدارة الأنظمة ومعالجة الطلبات بصورة منظمة والإدارة المستمرة للبنية التحتية.",
    )),
    ("digital-workspace", ("Workspace", "Digital Workspace", "بيئة العمل الرقمية"), (
        "فضای کار سازمانی برای فایل‌ها، اشتراک‌گذاری، همکاری تیمی، Office Online و دسترسی کنترل‌شده به اطلاعات.",
        "Organizational files, sharing, team collaboration, Online Office and controlled access to information.",
        "ملفات المؤسسة والمشاركة والتعاون بين الفرق وOffice Online والوصول المنضبط إلى المعلومات.",
    )),
    ("network-security", ("شبکه و امنیت", "Network & Security", "الشبكات والأمن"), (
        "طراحی و مدیریت شبکه، Firewall، VPN، Segmentation، ارتباط شعب و دسترسی امن به سرویس‌های سازمان.",
        "Network design and management, Firewall, VPN, segmentation, branch connectivity and secure service access.",
        "تصميم الشبكات وإدارتها، Firewall وVPN وSegmentation وربط الفروع والوصول الآمن للخدمات.",
    )),
    ("identity-access", ("هویت و دسترسی", "Identity & Access", "الهوية والوصول"), (
        "مدیریت متمرکز کاربران، Active Directory، LDAP، SSO و دسترسی مبتنی بر نقش و گروه.",
        "Centralized user management, Active Directory, LDAP, SSO and role- or group-based access.",
        "إدارة مركزية للمستخدمين عبر Active Directory وLDAP وSSO وصلاحيات حسب الدور والمجموعة.",
    )),
    ("backup-recovery", ("بکاپ و بازیابی", "Backup & Recovery", "النسخ الاحتياطي والاستعادة"), (
        "پشتیبان‌گیری از داده‌ها و سرویس‌های حیاتی، سیاست نگهداری اطلاعات و برنامه‌ریزی برای بازیابی و تداوم کسب‌وکار.",
        "Protection of critical data and services, retention policies, recovery planning and business continuity.",
        "نسخ البيانات والخدمات الحيوية، سياسات الاحتفاظ، والتخطيط للاستعادة واستمرارية الأعمال.",
    )),
    ("monitoring", ("مانیتورینگ", "Monitoring", "المراقبة"), (
        "پایش شبکه، سرورها و سرویس‌ها با هدف شناسایی اختلال، بررسی ظرفیت و ایجاد فرایند منظم Alert تا Resolution.",
        "Network, server and service monitoring to identify incidents, track capacity and manage alert-to-resolution.",
        "مراقبة الشبكات والخوادم والخدمات لاكتشاف الأعطال ومتابعة السعة وبناء مسار من التنبيه إلى المعالجة.",
    )),
    ("erp-automation", ("ERP و اتوماسیون", "ERP & Automation", "ERP والأتمتة"), (
        "راهکارهای ERP، CRM، فروش، منابع سازمانی و اتوماسیون فرایندها بر بستر Odoo Enterprise.",
        "ERP, CRM, sales, enterprise resources and process automation based on Odoo Enterprise.",
        "حلول ERP وCRM والمبيعات وموارد المؤسسة وأتمتة العمليات بالاعتماد على Odoo Enterprise.",
    )),
    ("business-telephony", ("تلفن سازمانی", "Business Telephony", "الاتصالات الهاتفية المؤسسية"), (
        "راهکارهای VoIP، مرکز تلفن، داخلی‌ها، IVR، ارتباط شعب و مدیریت ارتباطات صوتی سازمان.",
        "VoIP, PBX, extensions, IVR, branch connectivity and managed organizational voice communications.",
        "VoIP ومقسم الهاتف والامتدادات وIVR وربط الفروع وإدارة الاتصالات الصوتية.",
    )),
    ("remote-management", ("مدیریت از راه دور", "Remote Management", "الإدارة عن بُعد"), (
        "مدیریت متمرکز Endpointها، Remote Support، Inventory، Monitoring و اجرای عملیات مدیریتی روی سیستم‌ها.",
        "Centralized endpoint management, Remote Support, Inventory, Monitoring and remote administration.",
        "إدارة مركزية للأجهزة الطرفية وRemote Support وInventory وMonitoring وتنفيذ المهام الإدارية.",
    )),
    ("it-automation", ("اتوماسیون IT", "IT Automation", "أتمتة تقنية المعلومات"), (
        "خودکارسازی Workflowها، اعلان‌ها، Integrationها و فرایندهای تکراری برای افزایش سرعت و کاهش عملیات دستی.",
        "Automating workflows, notifications, integrations and repetitive processes to reduce manual work and increase speed.",
        "أتمتة سير العمل والإشعارات والتكاملات والعمليات المتكررة لزيادة السرعة وتقليل العمل اليدوي.",
    )),
]

SOLUTIONS = [
    ("integrated-it-management", ("مدیریت یکپارچه IT", "Integrated IT Management", "الإدارة المتكاملة لتقنية المعلومات")),
    ("it-outsourcing", ("برون‌سپاری IT", "IT Outsourcing", "الاستعانة بمصادر خارجية")),
    ("security-continuity", ("امنیت و تداوم", "Security & Continuity", "الأمن والاستمرارية")),
    ("branch-management", ("مدیریت شعب و دفاتر", "Branch & Office Management", "إدارة الفروع والمكاتب")),
    ("digital-workplace", ("محیط کار سازمانی", "Digital Workplace", "بيئة العمل الرقمية")),
    ("process-automation", ("اتوماسیون فرایندها", "Process Automation", "أتمتة العمليات")),
]

PACKAGES = [
    ("essential", 1, 12_950_000, 5, 6, 0, 1, 1_590_000, 790_000,
     ("پایه", "Essential", "الأساسية"), ("حداکثر ۸ ساعت کاری", "Up to 8 business hours", "حتى 8 ساعات عمل")),
    ("standard", 2, 19_500_000, 10, 12, 1, 1, 1_990_000, 990_000,
     ("استاندارد", "Standard", "القياسية"), ("حداکثر ۴ ساعت کاری", "Up to 4 business hours", "حتى 4 ساعات عمل")),
    ("professional", 3, 32_900_000, 15, 20, 2, 2, 2_690_000, 1_290_000,
     ("حرفه‌ای", "Professional", "الاحترافية"), ("حداکثر ۲ ساعت کاری", "Up to 2 business hours", "حتى ساعتَي عمل")),
    ("business", 4, 52_900_000, 25, 35, 4, 3, 3_790_000, 1_790_000,
     ("سازمانی", "Business", "الأعمال"), ("حداکثر ۱ ساعت کاری", "Up to 1 business hour", "حتى ساعة عمل واحدة")),
    ("enterprise", 5, 79_900_000, 40, 60, 8, 5, 4_990_000, 2_490_000,
     ("سازمانی پلاس", "Enterprise", "المؤسسات"), ("P1 حداکثر ۳۰ دقیقه", "P1 up to 30 minutes", "P1 حتى 30 دقيقة")),
]

HOME = {
    "fa": {
        "title": "مدیریت یکپارچه فناوری اطلاعات",
        "excerpt": "خدمات مدیریت‌شده فناوری اطلاعات، امنیت، شبکه، بکاپ، مانیتورینگ و اتوماسیون.",
        "hero": {"eyebrow": "یک شریک برای تمام مسیر فناوری اطلاعات شما", "title": "فناوری اطلاعات شرکت شما، یکپارچه و تحت مدیریت", "highlight": "یکپارچه", "body": "ابریت فناوری اطلاعات سازمان شما را از مجموعه‌ای پراکنده از سیستم‌ها، کاربران و سرویس‌ها، به یک زیرساخت یکپارچه، امن، پایدار و پاسخ‌گو تبدیل می‌کند.", "primary_cta": {"label": "درخواست ارزیابی IT", "url": "/fa/contact"}, "secondary_cta": {"label": "مشاهده خدمات", "url": "/fa/services"}, "points": ["مدیریت یکپارچه", "پایش و پاسخ‌گویی", "امنیت و بکاپ"]},
        "services_title": "هرآنچه برای مدیریت حرفه‌ای IT نیاز دارید",
        "pricing_title": "از پایه تا سازمانی؛ ظرفیت و SLA قابل پیش‌بینی",
        "cta": ("نیاز به یک نگاه دقیق‌تر به وضعیت IT سازمانتان دارید؟", "نقطه شروع، شناخت درست وضعیت فعلی است.", "درخواست ارزیابی IT"),
    },
    "en": {
        "title": "Unified IT Management",
        "excerpt": "Managed IT, security, network, backup, monitoring and automation services.",
        "hero": {"eyebrow": "One partner across your entire IT journey", "title": "Your company IT, unified and managed", "highlight": "unified", "body": "Abrit turns a fragmented mix of systems, users and services into an integrated, secure, stable and responsive IT environment.", "primary_cta": {"label": "Request IT Assessment", "url": "/en/contact"}, "secondary_cta": {"label": "Explore Services", "url": "/en/services"}, "points": ["Unified management", "Monitoring & response", "Security & backup"]},
        "services_title": "Everything you need to manage IT professionally",
        "pricing_title": "From essential to enterprise, with predictable capacity and SLA",
        "cta": ("Need a closer look at your organization's IT environment?", "The right starting point is a clear understanding of your current state.", "Request IT Assessment"),
    },
    "ar-ae": {
        "title": "الإدارة المتكاملة لتقنية المعلومات",
        "excerpt": "خدمات تقنية المعلومات المُدارة والأمن والشبكات والنسخ والمراقبة والأتمتة.",
        "hero": {"eyebrow": "شريك واحد في كامل رحلة تقنية المعلومات", "title": "تقنية المعلومات في شركتك، موحّدة وتحت الإدارة", "highlight": "موحّدة", "body": "تحوّل AbrIT بيئة تقنية المعلومات من مجموعة متفرقة من الأنظمة والمستخدمين والخدمات إلى بنية متكاملة وآمنة ومستقرة وسريعة الاستجابة.", "primary_cta": {"label": "طلب تقييم تقنية المعلومات", "url": "/ar-ae/contact"}, "secondary_cta": {"label": "استعراض الخدمات", "url": "/ar-ae/services"}, "points": ["إدارة متكاملة", "مراقبة واستجابة", "أمن ونسخ احتياطي"]},
        "services_title": "كل ما تحتاجه لإدارة تقنية المعلومات باحتراف",
        "pricing_title": "من الباقة الأساسية إلى المؤسسات، بسعة وSLA واضحين",
        "cta": ("هل تحتاج إلى نظرة أدق على وضع تقنية المعلومات في مؤسستك؟", "نقطة البداية الصحيحة هي فهم الوضع الحالي بوضوح.", "طلب تقييم تقنية المعلومات"),
    },
}


class Command(BaseCommand):
    help = "Idempotently seed approved AbrIT settings, Home, services, solutions and package data."

    @transaction.atomic
    def handle(self, *args, **options):
        self._seed_site()
        self._seed_content()
        self._seed_navigation()
        self._seed_packages()
        self.stdout.write(self.style.SUCCESS("AbrIT approved seed data is ready."))

    def _seed_site(self):
        site, _ = SiteSettings.objects.update_or_create(
            singleton_key=1,
            defaults={"brand_name": "AbrIT", "phone": "05131881000", "default_locale": "fa"},
        )
        translated = {
            "fa": ("ایران، مشهد", "ایران، مشهد", "AbrIT | مدیریت یکپارچه فناوری اطلاعات", "خدمات مدیریت‌شده فناوری اطلاعات، امنیت، شبکه، بکاپ، مانیتورینگ و اتوماسیون."),
            "en": ("Iran, Mashhad", "Iran, Mashhad", "AbrIT | Managed IT & IT as a Service", "Managed IT, infrastructure, security, backup, monitoring and automation for organizations."),
            "ar-ae": ("إيران، مشهد", "إيران، مشهد", "AbrIT | خدمات تقنية المعلومات المُدارة", "خدمات تقنية المعلومات المُدارة والأمن والبنية التحتية والنسخ والمراقبة والأتمتة."),
        }
        for locale, values in translated.items():
            SiteSettingsTranslation.objects.update_or_create(
                settings=site,
                locale=locale,
                defaults={"location_label": values[0], "address": values[1], "default_seo_title": values[2], "default_seo_description": values[3]},
            )
        DesignSettings.objects.get_or_create(singleton_key=1)

    def _seed_content(self):
        now = timezone.now()
        home, _ = ContentItem.objects.update_or_create(key="home", defaults={"kind": ContentItem.Kind.PAGE, "template_key": "home", "is_active": True})
        for locale, data in HOME.items():
            translation, _ = ContentTranslation.objects.update_or_create(
                item=home,
                locale=locale,
                defaults={"title": data["title"], "slug": "home", "path": "", "excerpt": data["excerpt"], "workflow_status": ContentTranslation.WorkflowStatus.PUBLISHED, "translation_status": ContentTranslation.TranslationStatus.REVIEWED, "published_at": now, "seo_title": data["title"], "seo_description": data["excerpt"]},
            )
            blocks = [
                (0, "hero", "dashboard", data["hero"]),
                (10, "service_grid", "bento", {"title": data["services_title"], "limit": 10}),
                (20, "pricing", "cards", {"title": data["pricing_title"]}),
                (30, "cta", "split", {"title": data["cta"][0], "body": data["cta"][1], "primary_cta": {"label": data["cta"][2], "url": f"/{locale}/contact"}}),
            ]
            for order, block_type, variant, props in blocks:
                block, _ = ContentBlock.objects.update_or_create(translation=translation, order=order, defaults={"block_type": block_type, "variant": variant, "props": props, "is_active": True})
                block.full_clean()
                block.save()

        for key, names, descriptions in SERVICES:
            item, _ = ContentItem.objects.update_or_create(key=f"service-{key}", defaults={"kind": ContentItem.Kind.SERVICE, "template_key": "service", "is_active": True})
            ServiceProfile.objects.get_or_create(item=item)
            for index, locale in enumerate(LOCALES):
                ContentTranslation.objects.update_or_create(item=item, locale=locale, defaults={"title": names[index], "slug": key, "path": f"services/{key}", "excerpt": descriptions[index], "workflow_status": ContentTranslation.WorkflowStatus.PUBLISHED, "translation_status": ContentTranslation.TranslationStatus.REVIEWED, "published_at": now, "seo_title": names[index], "seo_description": descriptions[index][:170]})

        for key, names in SOLUTIONS:
            item, _ = ContentItem.objects.update_or_create(key=f"solution-{key}", defaults={"kind": ContentItem.Kind.SOLUTION, "template_key": "solution", "is_active": True})
            for index, locale in enumerate(LOCALES):
                ContentTranslation.objects.update_or_create(item=item, locale=locale, defaults={"title": names[index], "slug": key, "path": f"solutions/{key}", "workflow_status": ContentTranslation.WorkflowStatus.PUBLISHED, "translation_status": ContentTranslation.TranslationStatus.REVIEWED, "published_at": now, "seo_title": names[index]})

    def _seed_packages(self):
        for months, discount_bps, onboarding_bps in ((3, 300, 5000), (6, 500, 2500), (12, 800, 0)):
            ContractTerm.objects.update_or_create(months=months, defaults={"discount_bps": discount_bps, "onboarding_bps": onboarding_bps, "is_active": True})
        for row in PACKAGES:
            key, order, base, users, endpoints, servers, sites, user_rate, endpoint_rate, names, slas = row
            package, _ = Package.objects.update_or_create(key=key, defaults={"order": order, "base_monthly_toman": base, "included_users": users, "included_endpoints": endpoints, "included_servers": servers, "included_sites": sites, "is_featured": key == "professional", "is_active": True})
            for index, locale in enumerate(LOCALES):
                PackageTranslation.objects.update_or_create(package=package, locale=locale, defaults={"name": names[index], "sla_text": slas[index], "cta_label": {"fa": "مشاهده و تنظیم پکیج", "en": "View and configure", "ar-ae": "عرض الباقة وإعدادها"}[locale]})
            AddonRate.objects.update_or_create(package=package, addon_type=AddonRate.AddonType.USER, defaults={"monthly_toman": user_rate})
            AddonRate.objects.update_or_create(package=package, addon_type=AddonRate.AddonType.ENDPOINT, defaults={"monthly_toman": endpoint_rate})

    def _seed_navigation(self):
        labels = {
            "fa": ("خانه", "خدمات", "راهکارها", "تعرفه‌ها", "دانش و منابع", "اخبار و رسانه", "درباره AbrIT", "تماس با ما"),
            "en": ("Home", "Services", "Solutions", "Pricing", "Knowledge", "News & Media", "About AbrIT", "Contact"),
            "ar-ae": ("الرئيسية", "الخدمات", "الحلول", "الأسعار", "المعرفة", "الأخبار والإعلام", "عن AbrIT", "اتصل بنا"),
        }
        destinations = ("", "services", "solutions", "pricing", "knowledge", "news", "about", "contact")
        for location in (Menu.Location.HEADER, Menu.Location.MOBILE, Menu.Location.FOOTER):
            menu, _ = Menu.objects.update_or_create(key=f"{location}-primary", defaults={"location": location, "is_active": True})
            for order, destination in enumerate(destinations):
                item, _ = MenuItem.objects.update_or_create(
                    menu=menu,
                    parent=None,
                    order=order,
                    defaults={"external_url": f"/{{locale}}/{destination}".rstrip("/"), "column": 1, "is_active": True},
                )
                for index, locale in enumerate(LOCALES):
                    MenuItemTranslation.objects.update_or_create(item=item, locale=locale, defaults={"title": labels[locale][order]})
