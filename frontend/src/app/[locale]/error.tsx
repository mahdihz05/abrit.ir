"use client";

import { useParams } from "next/navigation";
import { isLocale, ui } from "@/lib/locales";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const params = useParams<{ locale: string }>();
  const locale = isLocale(params.locale) ? params.locale : "fa";
  return <main className="error-state"><h1>AbrIT</h1><p>{ui[locale].unavailable}</p><button className="button button-primary" onClick={reset}>↻</button></main>;
}
