import type { IndependentService } from "@/lib/independent-services-cms";
import type { Locale } from "@/lib/types";
import styles from "./independent-consultation-form.module.css";

const copy = {
  fa: {
    eyebrow: "ABRIT · شروع بررسی",
    title: "درباره نیاز سازمانتان با یک متخصص صحبت کنید",
    intro:
      "این اطلاعات برای شناخت اولیه کافی است. تیم ابریت درخواست را بررسی می‌کند و برای مشخص‌کردن دامنه، معماری و مرحله بعد با شما تماس می‌گیرد.",
    service: "خدمت موردنظر",
    name: "نام و نام خانوادگی",
    phone: "شماره تماس",
    email: "ایمیل کاری (اختیاری)",
    company: "نام سازمان (اختیاری)",
    size: "اندازه سازمان",
    details: "نیاز، وضعیت فعلی یا مسئله اصلی",
    contact: "روش تماس ترجیحی",
    choose: "انتخاب کنید",
    phoneContact: "تماس تلفنی",
    emailContact: "ایمیل",
    whatsapp: "واتس‌اپ",
    submit: "ثبت درخواست بررسی",
    consent:
      "موافقم اطلاعات واردشده فقط برای بررسی و پیگیری این درخواست نگهداری شود.",
    success:
      "درخواست شما با موفقیت ثبت شد. تیم ابریت برای ادامه بررسی با شما تماس می‌گیرد.",
    error:
      "ثبت درخواست انجام نشد. اطلاعات را بررسی کنید یا پس از چند دقیقه دوباره تلاش کنید.",
    trust: [
      "بررسی توسط کارشناس مرتبط",
      "بدون تعهد به خرید",
      "اطلاعات فقط برای پیگیری درخواست",
    ],
  },
  en: {
    eyebrow: "ABRIT · START THE REVIEW",
    title: "Discuss your organization’s requirement with a specialist",
    intro:
      "These initial details help the AbrIT team understand your request and contact you to define scope, architecture and the next step.",
    service: "Service of interest",
    name: "Full name",
    phone: "Phone number",
    email: "Work email (optional)",
    company: "Organization (optional)",
    size: "Organization size",
    details: "Current situation or main requirement",
    contact: "Preferred contact method",
    choose: "Choose",
    phoneContact: "Phone",
    emailContact: "Email",
    whatsapp: "WhatsApp",
    submit: "Submit review request",
    consent:
      "I agree that the submitted information may be retained only to review and follow up this request.",
    success:
      "Your request has been received. The AbrIT team will contact you to continue the review.",
    error:
      "The request could not be submitted. Check the information or try again in a few minutes.",
    trust: [
      "Reviewed by the relevant specialist",
      "No purchase commitment",
      "Used only to follow up your request",
    ],
  },
  "ar-ae": {
    eyebrow: "ABRIT · ابدأ المراجعة",
    title: "ناقش احتياج مؤسستك مع مختص",
    intro:
      "تكفي هذه المعلومات للفهم الأولي، وسيراجع فريق AbrIT الطلب ويتواصل معك لتحديد النطاق والبنية والخطوة التالية.",
    service: "الخدمة المطلوبة",
    name: "الاسم الكامل",
    phone: "رقم الهاتف",
    email: "بريد العمل (اختياري)",
    company: "اسم المؤسسة (اختياري)",
    size: "حجم المؤسسة",
    details: "الوضع الحالي أو المتطلب الرئيسي",
    contact: "طريقة التواصل المفضلة",
    choose: "اختر",
    phoneContact: "الهاتف",
    emailContact: "البريد الإلكتروني",
    whatsapp: "واتساب",
    submit: "إرسال طلب المراجعة",
    consent: "أوافق على حفظ المعلومات المدخلة فقط لمراجعة هذا الطلب ومتابعته.",
    success: "تم استلام طلبك، وسيتواصل معك فريق AbrIT لمتابعة المراجعة.",
    error: "تعذر إرسال الطلب. تحقق من المعلومات أو حاول مجدداً بعد بضع دقائق.",
    trust: [
      "مراجعة من المختص المناسب",
      "دون التزام بالشراء",
      "تُستخدم المعلومات لمتابعة الطلب فقط",
    ],
  },
} as const;

const needTypeByService: Record<IndependentService["slug"], string> = {
  backup: "backup",
  "cloud-storage": "cloud",
  workspace: "cloud",
  voice: "other",
};

export function IndependentConsultationForm({
  locale,
  service,
  services,
}: {
  locale: Locale;
  service?: IndependentService;
  services: IndependentService[];
}) {
  const text = copy[locale];
  const returnTo = service
    ? `/${locale}/independent-services/${service.slug}`
    : `/${locale}/independent-services`;

  return (
    <section
      className={styles.section}
      id="service-consultation"
      aria-labelledby="service-consultation-title"
    >
      <div className="container">
        <div className={styles.shell}>
          <div className={styles.intro}>
            <span>{text.eyebrow}</span>
            <h2 id="service-consultation-title">{text.title}</h2>
            <p>{text.intro}</p>
            <div className={styles.trust}>
              {text.trust.map((item) => (
                <b key={item}>{item}</b>
              ))}
            </div>
          </div>

          <form
            className={styles.form}
            action="/api/forms/consultation"
            method="post"
          >
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="return_to" value={returnTo} />
            <input
              type="hidden"
              name="need_type"
              value={service ? needTypeByService[service.slug] : "other"}
            />
            {service ? (
              <input
                type="hidden"
                name="context"
                value={`independent-service:${service.slug}`}
              />
            ) : null}

            <div className={styles.grid}>
              {service ? (
                <div className={`${styles.field} ${styles.serviceField}`}>
                  <span>{text.service}</span>
                  <b>{service.title[locale]}</b>
                </div>
              ) : (
                <label className={styles.field}>
                  <span>{text.service}</span>
                  <select name="context" defaultValue="" required>
                    <option value="" disabled>
                      {text.choose}
                    </option>
                    {services.map((item) => (
                      <option
                        value={`independent-service:${item.slug}`}
                        key={item.slug}
                      >
                        {item.title[locale]}
                      </option>
                    ))}
                  </select>
                </label>
              )}
              <label className={styles.field}>
                <span>{text.name}</span>
                <input
                  name="full_name"
                  autoComplete="name"
                  minLength={2}
                  maxLength={120}
                  required
                />
              </label>
              <label className={styles.field}>
                <span>{text.phone}</span>
                <input
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  autoComplete="tel"
                  minLength={7}
                  maxLength={25}
                  dir="ltr"
                  required
                />
              </label>
              <label className={styles.field}>
                <span>{text.email}</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  maxLength={180}
                  dir="ltr"
                />
              </label>
              <label className={styles.field}>
                <span>{text.company}</span>
                <input
                  name="company"
                  autoComplete="organization"
                  maxLength={160}
                />
              </label>
              <label className={styles.field}>
                <span>{text.size}</span>
                <select name="company_size" defaultValue="">
                  <option value="">{text.choose}</option>
                  <option value="1-10">1–10</option>
                  <option value="11-50">11–50</option>
                  <option value="51-200">51–200</option>
                  <option value="201+">201+</option>
                </select>
              </label>
              <label className={`${styles.field} ${styles.wide}`}>
                <span>{text.details}</span>
                <textarea
                  name="details"
                  minLength={10}
                  maxLength={2000}
                  required
                />
              </label>
              <label className={styles.field}>
                <span>{text.contact}</span>
                <select name="preferred_contact" defaultValue="">
                  <option value="">{text.choose}</option>
                  <option value="phone">{text.phoneContact}</option>
                  <option value="email">{text.emailContact}</option>
                  <option value="whatsapp">{text.whatsapp}</option>
                </select>
              </label>
              <label className={styles.honeypot} aria-hidden="true">
                Website
                <input name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>
            <label className={styles.consent}>
              <input
                name="consent_given"
                type="checkbox"
                value="yes"
                required
              />
              <span>{text.consent}</span>
            </label>
            <button className={styles.submit} type="submit">
              {text.submit}
              <span aria-hidden="true">←</span>
            </button>
            <p
              className={`${styles.notice} ${styles.success}`}
              id="consultation-success"
              role="status"
            >
              {text.success}
            </p>
            <p
              className={`${styles.notice} ${styles.error}`}
              id="consultation-error"
              role="alert"
            >
              {text.error}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
