"use client";

import { FormEvent, useMemo, useState } from "react";
import type { Locale, Package, PricingResult } from "@/lib/types";

const labels = {
  fa: { package: "پکیج", term: "مدت قرارداد", users: "تعداد کاربران", endpoints: "تعداد Endpointها", calculate: "محاسبه قیمت", months: "ماه", monthly: "هزینه ماهانه", total: "مجموع قرارداد", quote: "این ظرفیت نیازمند استعلام اختصاصی است.", upgrade: "پکیج پیشنهادی", details: "جزئیات محاسبه", error: "محاسبه انجام نشد؛ مقادیر را بررسی کنید." },
  en: { package: "Package", term: "Contract term", users: "Users", endpoints: "Endpoints", calculate: "Calculate price", months: "months", monthly: "Monthly recurring", total: "Contract total", quote: "This capacity requires a custom quote.", upgrade: "Recommended package", details: "Calculation details", error: "Calculation failed. Please check the values." },
  "ar-ae": { package: "الباقة", term: "مدة العقد", users: "المستخدمون", endpoints: "الأجهزة", calculate: "حساب السعر", months: "أشهر", monthly: "التكلفة الشهرية", total: "إجمالي العقد", quote: "تحتاج هذه السعة إلى عرض سعر مخصص.", upgrade: "الباقة المقترحة", details: "تفاصيل الحساب", error: "تعذر الحساب. يرجى مراجعة القيم." },
} as const;

export function PricingConfigurator({ locale, packages, initialPackage }: { locale: Locale; packages: Package[]; initialPackage?: string }) {
  const first = packages.find((item) => item.key === initialPackage) ?? packages[0];
  const [packageKey, setPackageKey] = useState(first?.key ?? "");
  const selected = useMemo(() => packages.find((item) => item.key === packageKey) ?? first, [first, packageKey, packages]);
  const [term, setTerm] = useState(12);
  const [users, setUsers] = useState(selected?.included_users ?? 0);
  const [endpoints, setEndpoints] = useState(selected?.included_endpoints ?? 0);
  const [result, setResult] = useState<PricingResult | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const copy = labels[locale];
  const number = new Intl.NumberFormat(locale);

  function selectPackage(key: string) {
    const next = packages.find((item) => item.key === key);
    setPackageKey(key); setResult(null);
    if (next) { setUsers(next.included_users); setEndpoints(next.included_endpoints); }
  }

  async function calculate(event: FormEvent) {
    event.preventDefault(); setBusy(true); setError("");
    try {
      const response = await fetch("/api/pricing/calculate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ package: packageKey, term_months: term, users, endpoints }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.error?.detail ?? copy.error);
      setResult(payload.data as PricingResult);
    } catch (reason) { setError(reason instanceof Error ? reason.message : copy.error); }
    finally { setBusy(false); }
  }

  return (
    <div className="configurator-grid">
      <form className="configurator-panel" onSubmit={calculate}>
        <label>{copy.package}<select value={packageKey} onChange={(event) => selectPackage(event.target.value)}>{packages.map((item) => <option key={item.key} value={item.key}>{item.name}</option>)}</select></label>
        <div className="configurator-pair">
          <label>{copy.users}<input type="number" min="0" max="10000" value={users} onChange={(event) => setUsers(Number(event.target.value))} /></label>
          <label>{copy.endpoints}<input type="number" min="0" max="10000" value={endpoints} onChange={(event) => setEndpoints(Number(event.target.value))} /></label>
        </div>
        <fieldset><legend>{copy.term}</legend><div className="term-options">{[3, 6, 12].map((value) => <label key={value} className={term === value ? "active" : ""}><input type="radio" name="term" value={value} checked={term === value} onChange={() => setTerm(value)} />{value} {copy.months}</label>)}</div></fieldset>
        <button className="reference-button primary" disabled={busy || !packageKey}>{busy ? "…" : copy.calculate}</button>
        {error && <p className="form-error" role="alert">{error}</p>}
      </form>
      <section className="pricing-result" aria-live="polite">
        {!result && selected && <><span>ABRIT · {selected.name}</span><h2>{number.format(selected.base_monthly_toman)}</h2><p>{selected.sla}</p><div className="result-placeholder"><i /><i /><i /></div></>}
        {result?.quote_required && <><span>ABRIT · CUSTOM</span><h2>{copy.quote}</h2>{result.recommended_upgrade && <p>{copy.upgrade}: <b>{result.recommended_upgrade}</b></p>}</>}
        {result && !result.quote_required && <><span>{copy.details}</span><div className="result-totals"><div><small>{copy.monthly}</small><b>{number.format(result.monthly_recurring_toman ?? 0)}</b></div><div><small>{copy.total}</small><b>{number.format(result.contract_total_toman ?? 0)}</b></div></div><ul>{result.lines.filter((line) => line.amount_toman !== 0).map((line) => <li key={line.key}><span>{line.key.replaceAll("_", " ")}{line.quantity > 1 ? ` × ${line.quantity}` : ""}</span><b>{number.format(line.amount_toman)}</b></li>)}</ul>{result.recommended_upgrade && <p>{copy.upgrade}: <b>{result.recommended_upgrade}</b></p>}</>}
      </section>
    </div>
  );
}
