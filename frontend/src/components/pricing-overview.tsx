import Link from "next/link";
import { createPriceFormatter, monthlyPriceLabel } from "@/lib/pricing-currency";
import type { Locale, Package } from "@/lib/types";

const labels = {
  fa: { monthly: "تومان / ماه", users: "کاربر", to: "تا", servers: "سرور", sites: "سایت", featured: "پیشنهاد ویژه", select: "انتخاب و محاسبه", matrix: "مقایسه ظرفیت پکیج‌ها", sla: "زمان پاسخ بحرانی", rail: "ابریت / پکیج" },
  en: { monthly: "toman / month", users: "users", to: "to", servers: "servers", sites: "sites", featured: "Recommended", select: "Select & calculate", matrix: "Package capacity comparison", sla: "Critical response", rail: "ABRIT / PLAN" },
  "ar-ae": { monthly: "تومان / شهر", users: "مستخدمون", to: "إلى", servers: "خوادم", sites: "مواقع", featured: "موصى بها", select: "اختر واحسب", matrix: "مقارنة سعة الباقات", sla: "الاستجابة الحرجة", rail: "ABRIT / PLAN" },
} as const;

const extraUserCapacityByOrder = [1, 2, 3, 5, 7] as const;

export function PricingOverview({ locale, packages }: { locale: Locale; packages: Package[] }) {
  const copy = labels[locale];
  const number = new Intl.NumberFormat(locale);
  const money = createPriceFormatter(locale);
  return <div className="pricing-motion-layout">
    <aside className="listing-rail pricing-rail" data-motion-reveal aria-label={copy.matrix}>
      <span>{copy.rail}</span><i aria-hidden="true" /><b>{number.format(packages.length)}</b>
    </aside>
    <div className="pricing-motion-content">
    <div className="pricing-package-grid">{packages.map((item) => <article data-motion-reveal className={item.is_featured ? "is-featured" : ""} key={item.key}>
      {item.is_featured && <small>{copy.featured}</small>}<h2>{item.name}</h2><p className="public-price"><b>{money.format(item.base_monthly_toman)}</b><span>{monthlyPriceLabel(locale)}</span></p>
      <ul><li><b>{number.format(item.included_users)} {copy.to} {number.format(item.included_users + (extraUserCapacityByOrder[item.order - 1] ?? 0))}</b> {copy.users}</li><li><b>{number.format(item.included_servers)}</b> {copy.servers}</li><li><b>{number.format(item.included_sites)}</b> {copy.sites}</li></ul>
      <p className="package-sla">{item.sla}</p><Link href={`/${locale}/pricing?package=${item.key}#calculator`}>{copy.select}</Link>
    </article>)}</div>
    <div className="pricing-matrix" data-motion-reveal><h2>{copy.matrix}</h2><div className="table-scroll"><table><thead><tr><th></th>{packages.map((item) => <th key={item.key}>{item.name}</th>)}</tr></thead><tbody>
      {[[copy.users, "included_users"], [copy.servers, "included_servers"], [copy.sites, "included_sites"], [copy.sla, "sla"]].map(([label, key]) => <tr key={key}><th>{label}</th>{packages.map((item) => <td key={item.key}>{key === "sla" ? item.sla : key === "included_users" ? `${number.format(item.included_users)} ${copy.to} ${number.format(item.included_users + (extraUserCapacityByOrder[item.order - 1] ?? 0))}` : number.format(item[key as "included_servers" | "included_sites"] as number)}</td>)}</tr>)}
    </tbody></table></div></div>
    </div>
  </div>;
}
