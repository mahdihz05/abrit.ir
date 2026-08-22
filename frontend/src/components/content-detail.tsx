import Link from "next/link";
import type { ContentDetail as ContentDetailType, Locale } from "@/lib/types";

export function ContentDetail({ locale, content, label, backLabel, assessmentLabel }: { locale: Locale; content: ContentDetailType; label: string; backLabel: string; assessmentLabel: string }) {
  const listPath = content.kind === "service" ? "services" : "solutions";
  return (
    <main className="internal-main">
      <section className="detail-hero"><div className="container detail-hero-grid"><div><span className="internal-eyebrow">ABRIT · {label}</span><h1>{content.title}</h1><p>{content.excerpt}</p><div className="detail-actions"><Link className="reference-button primary" href={`/${locale}/contact`}>{assessmentLabel}</Link><Link className="reference-button outline" href={`/${locale}/${listPath}`}>{backLabel}</Link></div></div><div className="detail-console" aria-hidden="true"><span>ABRIT OPERATIONS</span><div><i /><b>Managed</b></div><div><i /><b>Monitored</b></div><div><i /><b>Documented</b></div></div></div></section>
      <section className="internal-section"><div className="container detail-body"><aside><span>01</span><b>{label}</b></aside><article><h2>{content.title}</h2><p>{content.excerpt}</p><div className="detail-principles"><div><b>Assessment</b><span>Current state and risks</span></div><div><b>Design</b><span>Right-sized operating model</span></div><div><b>Operate</b><span>Measured ongoing service</span></div></div></article></div></section>
    </main>
  );
}
