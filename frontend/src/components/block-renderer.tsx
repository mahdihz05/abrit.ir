import Link from "next/link";
import { ui } from "@/lib/locales";
import { createPriceFormatter, monthlyPriceLabel } from "@/lib/pricing-currency";
import type { ContentBlock, ContentSummary, Locale, Package } from "@/lib/types";

type Props = { block: ContentBlock; locale: Locale; services: ContentSummary[]; packages: Package[] };

function text(value: unknown): string { return typeof value === "string" ? value : ""; }
function record(value: unknown): Record<string, unknown> { return value && typeof value === "object" ? value as Record<string, unknown> : {}; }

function Hero({ block, locale }: Pick<Props, "block" | "locale">) {
  const props = block.props;
  const primary = record(props.primary_cta);
  const secondary = record(props.secondary_cta);
  const points = Array.isArray(props.points) ? props.points.filter((value): value is string => typeof value === "string") : [];
  const title = text(props.title);
  const highlight = text(props.highlight);
  const parts = highlight ? title.split(highlight) : [title];

  return (
    <section className="hero">
      <div className="hero-grid" aria-hidden="true" />
      <div className="container hero-layout">
        <div className="hero-copy">
          <p className="eyebrow"><span />{text(props.eyebrow)}</p>
          <h1>{parts[0]}{highlight && <mark>{highlight}</mark>}{parts.slice(1).join(highlight)}</h1>
          <p className="hero-body">{text(props.body)}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href={text(primary.url) || `/${locale}/contact`}>{text(primary.label)}</Link>
            <Link className="button button-secondary" href={text(secondary.url) || `/${locale}/services`}>{text(secondary.label)}</Link>
          </div>
          <ul className="hero-points">{points.map((point) => <li key={point}>{point}</li>)}</ul>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="control-card">
            <span className="status-pill">● LIVE</span>
            <div className="metric-row"><span>99.9%</span><i /></div>
            <div className="metric-row"><span>24/7</span><i /></div>
            <div className="metric-row"><span>360°</span><i /></div>
          </div>
          <div className="floating-card floating-top"><b>IT</b><span>Managed</span></div>
          <div className="floating-card floating-bottom"><b>✓</b><span>Protected</span></div>
        </div>
      </div>
    </section>
  );
}

function ServiceGrid({ block, locale, services }: Props) {
  return (
    <section className="section services-section">
      <div className="container">
        <div className="section-heading"><span>01</span><h2>{text(block.props.title)}</h2></div>
        <div className="service-grid">
          {services.map((service, index) => (
            <article className={index === 0 ? "service-card service-featured" : "service-card"} key={service.id}>
              <div className="service-icon" aria-hidden="true">{String(index + 1).padStart(2, "0")}</div>
              <h3>{service.title}</h3><p>{service.excerpt}</p>
              <Link href={service.url}>{ui[locale].explore}<span aria-hidden="true"> ←</span></Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing({ block, locale, packages }: Props) {
  const labels = ui[locale];
  const money = createPriceFormatter(locale);
  return (
    <section className="section pricing-section">
      <div className="container">
        <div className="section-kicker">{labels.packages}</div>
        <div className="section-heading"><span>02</span><h2>{text(block.props.title)}</h2></div>
        <div className="package-grid">
          {packages.map((item) => (
            <article key={item.key} className={item.is_featured ? "package-card is-featured" : "package-card"}>
              {item.is_featured && <span className="popular">★</span>}
              <p className="package-name">{item.name}</p>
              <div className="package-price"><b>{money.format(item.base_monthly_toman)}</b><span>{monthlyPriceLabel(locale)}</span></div>
              <p>{item.sla}</p>
              <ul>
                <li><b>{item.included_users}</b> {labels.users}</li>
                <li><b>{item.included_endpoints}</b> {labels.endpoints}</li>
                <li><b>{item.included_servers}</b> {labels.servers}</li>
                <li><b>{item.included_sites}</b> {labels.sites}</li>
              </ul>
              <Link className="package-link" href={`/${locale}/pricing?package=${item.key}`}>{labels.configure}</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallToAction({ block, locale }: Pick<Props, "block" | "locale">) {
  const cta = record(block.props.primary_cta);
  return <section className="section"><div className="container"><div className="cta-panel"><div><span>AbrIT</span><h2>{text(block.props.title)}</h2><p>{text(block.props.body)}</p></div><Link className="button button-light" href={text(cta.url) || `/${locale}/contact`}>{text(cta.label) || ui[locale].contact}</Link></div></div></section>;
}

export function BlockRenderer(props: Props) {
  if (props.block.type === "hero") return <Hero {...props} />;
  if (props.block.type === "service_grid") return <ServiceGrid {...props} />;
  if (props.block.type === "pricing") return <Pricing {...props} />;
  if (props.block.type === "cta") return <CallToAction {...props} />;
  return null;
}
