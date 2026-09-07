import type { Locale } from "@/lib/types";

export const pricingCurrencies = {
  fa: {
    code: "IRT",
    label: "تومان",
    tomanPerUnit: 1,
    numberLocale: "fa-IR",
  },
  en: {
    code: "USD",
    label: "USD",
    tomanPerUnit: 221_600,
    numberLocale: "en-US",
  },
  "ar-ae": {
    code: "AED",
    label: "د.إ",
    tomanPerUnit: 60_330,
    numberLocale: "ar-AE",
  },
} as const satisfies Record<
  Locale,
  {
    code: string;
    label: string;
    tomanPerUnit: number;
    numberLocale: string;
  }
>;

export function createPriceFormatter(locale: Locale) {
  const currency = pricingCurrencies[locale];
  const number = new Intl.NumberFormat(currency.numberLocale, {
    maximumFractionDigits: 0,
  });

  return {
    ...currency,
    format(toman: number) {
      return number.format(Math.round(toman / currency.tomanPerUnit));
    },
  };
}

export function monthlyPriceLabel(locale: Locale) {
  const { label } = pricingCurrencies[locale];
  if (locale === "fa") return `${label} / ماه`;
  if (locale === "ar-ae") return `${label} / شهرياً`;
  return `${label} / month`;
}
