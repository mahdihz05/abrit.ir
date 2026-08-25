import Link from "next/link";
import { LeadForm } from "./lead-form";
import { getCapability, getService, pageCopy, services, type PublicService, type PublicSolution } from "@/lib/public-content";
import type { Locale } from "@/lib/types";

export function PublicDetail({ locale, item, kind }: { locale: Locale; item: PublicService | PublicSolution; kind: "service" | "solution" }) {
  const copy = pageCopy[locale];
  const isService = kind === "service";
  const service = isService ? item as PublicService : null;
  const solution = !isService ? item as PublicSolution : null;
  const related = solution
    ? solution.serviceSlugs.map(getService).filter((value): value is PublicService => Boolean(value))
    : services.filter((entry) => entry.slug !== service?.slug && entry.capabilities.some((key) => service?.capabilities.includes(key))).slice(0, 3);
  const capabilities = service?.capabilities.map(getCapability) ?? related.flatMap((entry) => entry.capabilities.slice(0, 1).map(getCapability));
  const technologies = service?.technologies ?? [...new Set(related.flatMap((entry) => entry.technologies))];
  const title = item.title[locale];
  const excerpt = item.excerpt[locale];
  const faq = {
    fa: [["محدوده دقیق این خدمت چگونه مشخص می‌شود؟", "پس از ارزیابی وضعیت موجود، دارایی‌ها و اولویت‌ها، محدوده اجرا و سطح خدمت در پیشنهاد و قرارداد مشخص می‌شود."], ["آیا لازم است همه زیرساخت فعلی تعویض شود؟", "خیر. ابتدا وضعیت موجود بررسی می‌شود و تغییرات ضروری به‌صورت مرحله‌ای و اولویت‌بندی‌شده پیشنهاد می‌شوند."], ["آیا این خدمت برای چند شعبه قابل تعریف است؟", "بله؛ تعداد سایت‌ها، شیوه ارتباط و محدوده پشتیبانی هر شعبه باید در ارزیابی و قرارداد مشخص شود."]],
    en: [["How is the exact scope defined?", "The implementation scope and service level are defined after assessing the current environment, assets and priorities."], ["Must the existing infrastructure be replaced?", "No. The current state is assessed first and necessary changes are prioritized for staged implementation."], ["Can this cover multiple branches?", "Yes. The sites, connectivity and support scope for each branch must be defined during assessment and contracting."]],
    "ar-ae": [["كيف يتم تحديد النطاق الدقيق؟", "يتم تحديد نطاق التنفيذ ومستوى الخدمة بعد تقييم البيئة الحالية والأصول والأولويات."], ["هل يجب استبدال البنية الحالية بالكامل؟", "لا. يتم تقييم الوضع الحالي أولاً ثم ترتيب التغييرات الضرورية وتنفيذها على مراحل."], ["هل يمكن أن تشمل الخدمة عدة فروع؟", "نعم، مع تحديد المواقع وطريقة الاتصال ونطاق دعم كل فرع خلال التقييم والعقد."]],
  }[locale];

  return <main className="internal-main public-detail">
    <section className="detail-hero"><div className="container detail-hero-grid">
      <div><span className="internal-eyebrow">ABRIT · {isService ? "SERVICE" : "SOLUTION"}</span><h1>{title}</h1><p>{excerpt}</p><div className="detail-actions"><Link className="reference-button primary" href={`/${locale}/contact`}>{copy.assessment}</Link><Link className="reference-button outline" href={`/${locale}/${isService ? "services" : "solutions"}`}>{copy.back}</Link></div></div>
      <div className="detail-console" aria-hidden="true"><span>ABRIT · OPERATING MODEL</span>{copy.processSteps.map((step, index) => <div key={step}><i /><b><small>{String(index + 1).padStart(2, "0")}</small>{step}</b></div>)}</div>
    </div></section>
    <section className="internal-section"><div className="container">
      <header className="public-section-heading"><span>01</span><div><small>{copy.overview}</small><h2>{title}</h2><p>{excerpt}</p></div></header>
      <div className="capability-grid">{capabilities.map((capability, index) => <article key={`${capability.title.en}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><h3>{capability.title[locale]}</h3><p>{capability.description[locale]}</p></article>)}</div>
    </div></section>
    <section className="public-process"><div className="container"><header className="public-section-heading light-heading"><span>02</span><div><small>{copy.process}</small><h2>{copy.process}</h2></div></header><ol>{copy.processSteps.map((step, index) => <li key={step}><b>{String(index + 1).padStart(2, "0")}</b><span>{step}</span></li>)}</ol></div></section>
    <section className="internal-section"><div className="container public-technology"><header className="public-section-heading"><span>03</span><div><small>{copy.technologies}</small><h2>{copy.technologies}</h2></div></header><div>{technologies.map((technology) => <span key={technology} dir="ltr">{technology}</span>)}</div>{related.length > 0 && <><header className="public-section-heading related-heading"><span>04</span><div><small>{copy.related}</small><h2>{copy.related}</h2></div></header><div className="related-grid">{related.map((entry) => <Link href={`/${locale}/services/${entry.slug}`} key={entry.slug}><small>{copy.service}</small><h3>{entry.title[locale]}</h3><p>{entry.excerpt[locale]}</p></Link>)}</div></>}</div></section>
    <section className="faq-section"><div className="container"><header className="public-section-heading"><span>05</span><div><small>FAQ</small><h2>{locale === "fa" ? "پرسش‌های متداول" : locale === "en" ? "Frequently asked questions" : "الأسئلة الشائعة"}</h2></div></header><div className="faq-grid">{faq.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div></div></section>
    <section className="lead-section"><div className="container"><LeadForm locale={locale} context={`${kind}:${item.slug}`} compact /></div></section>
  </main>;
}
