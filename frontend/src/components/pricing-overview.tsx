import Link from "next/link";
import type { Locale, Package } from "@/lib/types";

const labels = {
  fa: { monthly: "تومان / ماه", users: "کاربر", endpoints: "Endpoint", servers: "سرور", sites: "سایت", featured: "پیشنهاد ویژه", select: "انتخاب و محاسبه", matrix: "مقایسه ظرفیت بسته‌ها", sla: "زمان پاسخ بحرانی" },
  en: { monthly: "toman / month", users: "users", endpoints: "endpoints", servers: "servers", sites: "sites", featured: "Recommended", select: "Select & calculate", matrix: "Package capacity comparison", sla: "Critical response" },
  "ar-ae": { monthly: "تومان / شهر", users: "مستخدمون", endpoints: "أجهزة", servers: "خوادم", sites: "مواقع", featured: "موصى بها", select: "اختر واحسب", matrix: "مقارنة سعة الباقات", sla: "الاستجابة الحرجة" },
} as const;

export function PricingOverview({ locale, packages }: { locale: Locale; packages: Package[] }) {
  const copy = labels[locale];
  const number = new Intl.NumberFormat(locale);
  return <>
    <div className="pricing-package-grid">{packages.map((item) => <article className={item.is_featured ? "is-featured" : ""} key={item.key}>
      {item.is_featured && <small>{copy.featured}</small>}<h2>{item.name}</h2><p className="public-price"><b>{number.format(item.base_monthly_toman)}</b><span>{copy.monthly}</span></p>
      <ul><li><b>{number.format(item.included_users)}</b> {copy.users}</li><li><b>{number.format(item.included_endpoints)}</b> {copy.endpoints}</li><li><b>{number.format(item.included_servers)}</b> {copy.servers}</li><li><b>{number.format(item.included_sites)}</b> {copy.sites}</li></ul>
      <p className="package-sla">{item.sla}</p><Link href={`/${locale}/pricing?package=${item.key}#calculator`}>{copy.select}</Link>
    </article>)}</div>
    <div className="pricing-matrix"><h2>{copy.matrix}</h2><div className="table-scroll"><table><thead><tr><th></th>{packages.map((item) => <th key={item.key}>{item.name}</th>)}</tr></thead><tbody>
      {[[copy.users, "included_users"], [copy.endpoints, "included_endpoints"], [copy.servers, "included_servers"], [copy.sites, "included_sites"], [copy.sla, "sla"]].map(([label, key]) => <tr key={key}><th>{label}</th>{packages.map((item) => <td key={item.key}>{key === "sla" ? item.sla : number.format(item[key as "included_users" | "included_endpoints" | "included_servers" | "included_sites"] as number)}</td>)}</tr>)}
    </tbody></table></div></div>
  </>;
}
