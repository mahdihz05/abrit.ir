import Link from "next/link";
import type { ContentSummary, Locale } from "@/lib/types";

export function ContentListing({
  locale, eyebrow, title, intro, items, itemLabel, readMore,
}: {
  locale: Locale; eyebrow: string; title: string; intro: string; items: ContentSummary[]; itemLabel: string; readMore: string;
}) {
  return (
    <main className="internal-main">
      <section className="internal-hero">
        <div className="container"><span className="internal-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{intro}</p></div>
      </section>
      <section className="internal-section">
        <div className="container content-card-grid">
          {items.map((item, index) => (
            <article className="content-card" key={item.id}>
              <span className="content-card-number">{String(index + 1).padStart(2, "0")}</span>
              <small>{itemLabel}</small><h2>{item.title}</h2><p>{item.excerpt}</p>
              <Link href={item.url}>{readMore}<span aria-hidden="true"> ←</span></Link>
            </article>
          ))}
        </div>
      </section>
      <section className="internal-assessment"><div className="container"><div className="internal-cta"><div><span>ABRIT · IT ASSESSMENT</span><h2>{title}</h2></div><Link className="reference-button light" href={`/${locale}/contact`}>{locale === "en" ? "Start assessment" : locale === "fa" ? "شروع ارزیابی" : "ابدأ التقييم"}</Link></div></div></section>
    </main>
  );
}
