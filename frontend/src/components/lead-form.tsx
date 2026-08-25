"use client";

import { useState, type FormEvent } from "react";
import styles from "./lead-form.module.css";
import type { Locale } from "@/lib/types";

type LeadFormKind = "consultation" | "quote-request";
type SubmitState = { type: "idle" | "pending" | "success" | "error"; message: string };

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api/v1").replace(/\/$/, "");

const copy = {
  fa: {
    eyebrow: "ABRIT · شروع همکاری",
    consultationTitle: "برای بررسی نیاز شما آماده‌ایم",
    consultationIntro: "چند اطلاعات اولیه ثبت کنید؛ تیم ابریت درخواست را بررسی می‌کند و برای ادامه مسیر با شما تماس می‌گیرد.",
    quoteTitle: "پیشنهاد متناسب با سازمانتان دریافت کنید",
    quoteIntro: "ظرفیت فعلی و نیاز اصلی را بگویید تا پکیج و محدوده خدمات مناسب بررسی شود.",
    name: "نام و نام خانوادگی", phone: "شماره تماس", email: "ایمیل کاری (اختیاری)", company: "نام سازمان (اختیاری)",
    companySize: "اندازه سازمان", need: "موضوع درخواست", details: "نیاز یا مسئله اصلی", contact: "روش تماس ترجیحی",
    users: "تعداد کاربران", sites: "تعداد شعب (اختیاری)", choose: "انتخاب کنید", submit: "ثبت درخواست", pending: "در حال ثبت...",
    fallbackSuccess: "درخواست شما ثبت شد؛ به‌زودی با شما تماس می‌گیریم.", error: "ثبت درخواست انجام نشد. لطفاً دوباره تلاش کنید.",
    consent: "با ثبت این فرم موافقم اطلاعات واردشده برای بررسی و پیگیری درخواست من نگهداری شود.",
    trust: ["بررسی درخواست توسط کارشناس", "اطلاعات فقط برای پیگیری درخواست", "بدون تعهد به خرید"],
  },
  en: {
    eyebrow: "ABRIT · START A CONVERSATION",
    consultationTitle: "Let’s understand what you need",
    consultationIntro: "Share a few initial details. The AbrIT team will review your request and contact you about the next step.",
    quoteTitle: "Receive a proposal shaped around your organization",
    quoteIntro: "Tell us about your current capacity and main need so we can review the right package and scope.",
    name: "Full name", phone: "Phone number", email: "Work email (optional)", company: "Organization (optional)",
    companySize: "Organization size", need: "Request topic", details: "Main requirement or challenge", contact: "Preferred contact method",
    users: "Users", sites: "Sites (optional)", choose: "Choose", submit: "Submit request", pending: "Submitting...",
    fallbackSuccess: "Your request has been received. We will contact you shortly.", error: "We could not submit the request. Please try again.",
    consent: "I agree that the submitted information may be retained to review and follow up my request.",
    trust: ["Reviewed by a specialist", "Used only to follow up your request", "No purchase commitment"],
  },
  "ar-ae": {
    eyebrow: "ABRIT · ابدأ المحادثة",
    consultationTitle: "لنبدأ بفهم احتياجك",
    consultationIntro: "شارك بعض المعلومات الأولية وسيراجع فريق AbrIT طلبك ويتواصل معك للخطوة التالية.",
    quoteTitle: "احصل على عرض يناسب مؤسستك",
    quoteIntro: "أخبرنا عن السعة الحالية والاحتياج الرئيسي لمراجعة الباقة والنطاق المناسبين.",
    name: "الاسم الكامل", phone: "رقم الهاتف", email: "البريد الإلكتروني للعمل (اختياري)", company: "المؤسسة (اختياري)",
    companySize: "حجم المؤسسة", need: "موضوع الطلب", details: "المتطلب أو التحدي الرئيسي", contact: "طريقة التواصل المفضلة",
    users: "عدد المستخدمين", sites: "عدد الفروع (اختياري)", choose: "اختر", submit: "إرسال الطلب", pending: "جارٍ الإرسال...",
    fallbackSuccess: "تم استلام طلبك وسنتواصل معك قريباً.", error: "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.",
    consent: "أوافق على حفظ المعلومات المدخلة لمراجعة طلبي ومتابعته.",
    trust: ["مراجعة من قبل مختص", "تستخدم المعلومات لمتابعة الطلب فقط", "دون التزام بالشراء"],
  },
} as const;

const options = {
  need: {
    fa: [["assessment", "ارزیابی وضعیت IT"], ["managed-it", "مدیریت و پشتیبانی IT"], ["security", "شبکه و امنیت"], ["cloud", "زیرساخت و سرویس ابری"], ["backup", "بکاپ و تداوم خدمت"], ["automation", "اتوماسیون و ERP"], ["other", "سایر موارد"]],
    en: [["assessment", "IT assessment"], ["managed-it", "Managed IT and support"], ["security", "Network and security"], ["cloud", "Cloud infrastructure"], ["backup", "Backup and continuity"], ["automation", "Automation and ERP"], ["other", "Other"]],
    "ar-ae": [["assessment", "تقييم تقنية المعلومات"], ["managed-it", "إدارة ودعم تقنية المعلومات"], ["security", "الشبكات والأمن"], ["cloud", "البنية السحابية"], ["backup", "النسخ واستمرارية الأعمال"], ["automation", "الأتمتة وERP"], ["other", "أخرى"]],
  },
  contact: {
    fa: [["phone", "تماس تلفنی"], ["email", "ایمیل"], ["whatsapp", "واتساپ"]],
    en: [["phone", "Phone"], ["email", "Email"], ["whatsapp", "WhatsApp"]],
    "ar-ae": [["phone", "الهاتف"], ["email", "البريد الإلكتروني"], ["whatsapp", "واتساب"]],
  },
} as const;

export function LeadForm({ locale, kind = "consultation", context = "", defaultPackage = "", compact = false }: { locale: Locale; kind?: LeadFormKind; context?: string; defaultPackage?: string; compact?: boolean }) {
  const text = copy[locale];
  const [state, setState] = useState<SubmitState>({ type: "idle", message: "" });
  const isQuote = kind === "quote-request";

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    const data: Record<string, string> = {};
    for (const [key, value] of values.entries()) {
      if (!["consent_given", "website"].includes(key) && typeof value === "string" && value.trim()) data[key] = value.trim();
    }
    setState({ type: "pending", message: text.pending });
    try {
      const response = await fetch(`${API_URL}/forms/${kind}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          locale,
          data,
          consent_given: values.get("consent_given") === "yes",
          website: values.get("website") ?? "",
          source_url: window.location.href,
          referrer: document.referrer,
        }),
      });
      const payload = await response.json().catch(() => null) as { data?: { message?: string } } | null;
      if (!response.ok) throw new Error("submission_failed");
      form.reset();
      setState({ type: "success", message: payload?.data?.message ?? text.fallbackSuccess });
    } catch {
      setState({ type: "error", message: text.error });
    }
  }

  return (
    <div className={`${styles.card} ${compact ? styles.compact : ""}`} data-lead-form={kind}>
      <div className={styles.intro}>
        <span className={styles.eyebrow}>{text.eyebrow}</span>
        <h2>{isQuote ? text.quoteTitle : text.consultationTitle}</h2>
        <p>{isQuote ? text.quoteIntro : text.consultationIntro}</p>
        <div className={styles.trust}>{text.trust.map((item) => <span key={item}>{item}</span>)}</div>
      </div>
      <form className={styles.form} onSubmit={submit}>
        <div className={styles.grid}>
          <label className={styles.field}><span>{text.name}</span><input name="full_name" autoComplete="name" minLength={2} maxLength={120} required /></label>
          <label className={styles.field}><span>{text.phone}</span><input name="phone" type="tel" inputMode="tel" autoComplete="tel" minLength={7} maxLength={25} dir="ltr" required /></label>
          <label className={styles.field}><span>{text.email}</span><input name="email" type="email" autoComplete="email" maxLength={180} dir="ltr" /></label>
          <label className={styles.field}><span>{text.company}</span><input name="company" autoComplete="organization" maxLength={160} /></label>
          {isQuote ? <>
            <label className={styles.field}><span>{text.users}</span><input name="users" type="number" inputMode="numeric" min="1" max="100000" required /></label>
            <label className={styles.field}><span>{text.sites}</span><input name="sites" type="number" inputMode="numeric" min="1" max="100000" /></label>
          </> : <>
            <label className={styles.field}><span>{text.companySize}</span><select name="company_size" defaultValue=""><option value="">{text.choose}</option><option value="1-10">1–10</option><option value="11-50">11–50</option><option value="51-200">51–200</option><option value="201+">201+</option></select></label>
            <label className={styles.field}><span>{text.need}</span><select name="need_type" defaultValue="" required><option value="">{text.choose}</option>{options.need[locale].map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>
          </>}
          <label className={`${styles.field} ${styles.wide}`}><span>{text.details}</span><textarea name="details" minLength={isQuote ? undefined : 10} maxLength={2000} required={!isQuote} /></label>
          {!isQuote && <label className={styles.field}><span>{text.contact}</span><select name="preferred_contact" defaultValue=""><option value="">{text.choose}</option>{options.contact[locale].map(([value, label]) => <option value={value} key={value}>{label}</option>)}</select></label>}
          {isQuote ? <input type="hidden" name="package" value={defaultPackage} /> : <input type="hidden" name="context" value={context} />}
          <label className={styles.honeypot} aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
        </div>
        <label className={styles.consent}><input name="consent_given" type="checkbox" value="yes" required /><span>{text.consent}</span></label>
        <div className={styles.actions}>
          <button className={styles.submit} type="submit" disabled={state.type === "pending"}>{state.type === "pending" ? text.pending : text.submit}</button>
          <p className={`${styles.status} ${state.type === "success" ? styles.success : state.type === "error" ? styles.error : ""}`} role="status" aria-live="polite">{state.message}</p>
        </div>
      </form>
    </div>
  );
}
