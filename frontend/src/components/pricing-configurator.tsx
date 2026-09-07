"use client";

import { useMemo, useState, type CSSProperties } from "react";
import { buildManagedItWhmcsUrl, estimateManagedItPrice, managedItCycles, managedItPackages, type ManagedItCycle } from "@/lib/managed-it-packages";
import { createPriceFormatter } from "@/lib/pricing-currency";
import type { Locale } from "@/lib/types";

const labels = {
  fa: { title: "پکیج‌تان را متناسب با تیم خود بسازید", eyebrow: "پیکربندی و خرید آنلاین", choose: "انتخاب پکیج", users: "کاربر", endpoints: "دستگاه", usersLabel: "تعداد کاربران", endpointsLabel: "تعداد دستگاه‌ها", included: "بازه کاربران این پکیج", to: "تا", contract: "دوره قرارداد", months: "ماهه", base: "قیمت پایه", extras: "ظرفیت اضافه", total: "برآورد کل قرارداد", toman: "تومان", continue: "ادامه فرایند خرید", contact: "درخواست راه‌اندازی این پکیج", finalPrice: "قیمت نهایی پس از تأیید سفارش محاسبه می‌شود.", extraUser: "کاربر اضافه", extraEndpoint: "دستگاه اضافه", noExtra: "بدون ظرفیت اضافه", setupPending: "امکان خرید مستقیم این پکیج هنوز فعال نشده است.", optionPending: "ظرفیت انتخابی در مرحله بعد تأیید می‌شود.", suggested: "پیشنهاد بهتر برای این ظرفیت", switchTo: "انتخاب", selected: "انتخاب‌شده", summaryLabel: "ابریت · خدمات مدیریت‌شده فناوری اطلاعات" },
  en: { title: "Build a package around your team", eyebrow: "Configure and buy online", choose: "Choose package", users: "users", endpoints: "endpoints", usersLabel: "Users", endpointsLabel: "Endpoints", included: "Package user range", to: "to", contract: "Contract term", months: "months", base: "Base price", extras: "Additional capacity", total: "Estimated contract total", toman: "toman", continue: "Continue in WHMCS", contact: "Request package setup", finalPrice: "WHMCS calculates the authoritative checkout total.", extraUser: "extra users", extraEndpoint: "extra endpoints", noExtra: "No additional capacity", setupPending: "This package's WHMCS product ID is not configured yet.", optionPending: "Confirm the selected capacity in WHMCS on the next step.", suggested: "A better fit for this capacity", switchTo: "Choose", selected: "Selected", summaryLabel: "ABRIT · MANAGED IT" },
  "ar-ae": { title: "أنشئ باقة تناسب فريقك", eyebrow: "الإعداد والشراء عبر الإنترنت", choose: "اختر الباقة", users: "مستخدم", endpoints: "جهاز", usersLabel: "المستخدمون", endpointsLabel: "الأجهزة", included: "نطاق مستخدمي الباقة", to: "إلى", contract: "مدة العقد", months: "أشهر", base: "السعر الأساسي", extras: "السعة الإضافية", total: "إجمالي العقد التقديري", toman: "تومان", continue: "المتابعة في WHMCS", contact: "طلب إعداد الباقة", finalPrice: "يحسب WHMCS السعر النهائي عند الدفع.", extraUser: "مستخدمون إضافيون", extraEndpoint: "أجهزة إضافية", noExtra: "دون سعة إضافية", setupPending: "لم يتم إعداد معرف منتج WHMCS لهذه الباقة بعد.", optionPending: "أكد السعة المختارة في WHMCS في الخطوة التالية.", suggested: "باقة أنسب لهذه السعة", switchTo: "اختيار", selected: "محددة", summaryLabel: "ABRIT · خدمات تقنية المعلومات المُدارة" },
} as const;

function RangeSelector({ label, value, minimum, maximum, formatValue, onChange }: { label: string; value: number; minimum: number; maximum: number; formatValue: (value: number) => string; onChange: (value: number) => void }) {
  const steps = Array.from({ length: maximum - minimum + 1 }, (_, index) => minimum + index);
  const progress = ((value - minimum) / (maximum - minimum)) * 100;
  const rangeStyle = { "--range-progress": `${progress}%`, "--range-steps": steps.length } as CSSProperties;
  return <div className="managed-range-field">
    <div className="managed-range-heading"><span>{label}</span><output>{formatValue(value)}</output></div>
    <div className="managed-range-control" dir="ltr">
      <input className="managed-range" style={rangeStyle} aria-label={label} type="range" min={minimum} max={maximum} step="1" value={value} onChange={(event) => onChange(Number(event.target.value))} />
      <div className="managed-range-ticks" aria-hidden="true">
        {steps.map((step, index) => <i key={step} style={{ "--step-position": `${(index / (steps.length - 1)) * 100}%` } as CSSProperties} />)}
      </div>
    </div>
    <div className="managed-range-scale" style={rangeStyle} dir="ltr">{steps.map((step) => <small key={step}>{formatValue(step)}</small>)}</div>
  </div>;
}

export function PricingConfigurator({ locale, initialPackage }: { locale: Locale; initialPackage?: string }) {
  const initial = managedItPackages.find((item) => item.key === initialPackage) ?? managedItPackages[0];
  const [packageKey, setPackageKey] = useState(initial.key);
  const selected = managedItPackages.find((item) => item.key === packageKey) ?? managedItPackages[0];
  const [cycle, setCycle] = useState<ManagedItCycle>("quarterly");
  const [users, setUsers] = useState(initial.includedUsers);
  const endpoints = selected.includedEndpoints;
  const copy = labels[locale];
  const number = useMemo(() => new Intl.NumberFormat(locale), [locale]);
  const money = useMemo(() => createPriceFormatter(locale), [locale]);
  const stepNumber = useMemo(() => new Intl.NumberFormat(locale, { minimumIntegerDigits: 2, useGrouping: false }), [locale]);
  const estimate = estimateManagedItPrice(selected, cycle, users, endpoints);
  const checkoutUrl = buildManagedItWhmcsUrl(selected);
  const recommendation = managedItPackages.find((item) => item.order > selected.order && users <= item.includedUsers);

  function selectPackage(key: string) {
    const next = managedItPackages.find((item) => item.key === key);
    if (!next) return;
    setPackageKey(next.key); setUsers(next.includedUsers);
  }

  return <div className="managed-configurator">
    <header className="managed-configurator-heading"><div><span>{copy.eyebrow}</span><h2>{copy.title}</h2></div><i>{locale === "fa" ? `مرحله ${number.format(1)} از ${number.format(3)}` : `${stepNumber.format(1)} / ${stepNumber.format(3)}`}</i></header>
    <div className="managed-package-picker" role="radiogroup" aria-label={copy.choose}>
      {managedItPackages.map((item) => <button type="button" role="radio" aria-checked={item.key === selected.key} className={item.key === selected.key ? "active" : ""} key={item.key} onClick={() => selectPackage(item.key)}><small>{stepNumber.format(item.order)}</small><b>{item.name[locale]}</b><span>{number.format(item.includedUsers)} {copy.to} {number.format(item.includedUsers + item.maxExtraUsers)} {copy.users}</span><i>{item.key === selected.key ? copy.selected : copy.switchTo}</i></button>)}
    </div>
    <div className="managed-builder-grid">
      <section className="managed-controls">
        <div className="managed-section-title"><span>{stepNumber.format(2)}</span><div><b>{selected.name[locale]}</b><small>{selected.caption[locale]}</small></div></div>
        <div className="managed-capacity-note"><span>{copy.included}</span><b>{number.format(selected.includedUsers)} {copy.to} {number.format(selected.includedUsers + selected.maxExtraUsers)} {copy.users}</b></div>
        <RangeSelector label={copy.usersLabel} value={users} minimum={selected.includedUsers} maximum={selected.includedUsers + selected.maxExtraUsers} formatValue={number.format} onChange={setUsers} />
        <fieldset className="managed-cycle"><legend>{copy.contract}</legend><div>{managedItCycles.map((item) => <label className={cycle === item.key ? "active" : ""} key={item.key}><input type="radio" name="managed-cycle" checked={cycle === item.key} onChange={() => setCycle(item.key)} /><b>{number.format(item.months)}</b><span>{copy.months}</span></label>)}</div></fieldset>
        {recommendation && users > selected.includedUsers && <button className="managed-recommendation" type="button" onClick={() => selectPackage(recommendation.key)}><span>{copy.suggested}</span><b>{recommendation.name[locale]} ←</b></button>}
      </section>
      <aside className="managed-order-summary">
        <div className="managed-summary-top"><span>{copy.summaryLabel}</span><b>{stepNumber.format(3)}</b></div><h3>{selected.name[locale]}</h3><p>{selected.caption[locale]}</p>
        <dl><div><dt>{copy.base}</dt><dd>{money.format(selected.pricing[cycle])} <small>{money.label}</small></dd></div><div><dt>{copy.extras}</dt><dd>{money.format(estimate.extras)} <small>{money.label}</small></dd></div></dl>
        <div className="managed-extra-lines">{estimate.extraUsers === 0 ? <span>{copy.noExtra}</span> : <span>{number.format(estimate.extraUsers)} {copy.extraUser} × {number.format(estimate.months)}</span>}</div>
        <div className="managed-total"><span>{copy.total}</span><b>{money.format(estimate.total)}</b><small>{money.label}</small></div><p className="managed-price-disclaimer">{copy.finalPrice}</p>
        <a className="managed-checkout" href={checkoutUrl}>{copy.continue}<span aria-hidden="true">←</span></a>
      </aside>
    </div>
  </div>;
}
