import Link from "next/link";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { CmsForm } from "@/components/cms-form";
import { ui } from "@/lib/locales";
import type { Form } from "@/payload-types";
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
              <div className="package-price"><b>{new Intl.NumberFormat(locale).format(item.base_monthly_toman)}</b><span>{labels.monthly}</span></div>
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

function RichTextSection({ block }: Pick<Props, "block">) {
  const body = block.props.body;
  return (
    <section className="section cms-rich-section">
      <div className="container cms-narrow">
        {text(block.props.eyebrow) && <span className="section-kicker">{text(block.props.eyebrow)}</span>}
        <h2>{text(block.props.heading) || text(block.props.title)}</h2>
        <div className="cms-rich-body">
          {typeof body === "string"
            ? <p>{body}</p>
            : body && typeof body === "object" ? <RichText data={body as Parameters<typeof RichText>[0]["data"]} /> : null}
        </div>
      </div>
    </section>
  );
}

function FeatureGrid({ block, locale }: Pick<Props, "block" | "locale">) {
  const items = Array.isArray(block.props.items) ? block.props.items.map(record) : [];
  return (
    <section className="section cms-feature-section">
      <div className="container">
        <div className="public-section-heading">
          <span>{text(block.props.eyebrow) || "AbrIT"}</span>
          <div><h2>{text(block.props.heading) || text(block.props.title)}</h2>{text(block.props.intro) && <p>{text(block.props.intro)}</p>}</div>
        </div>
        <div className="cms-feature-grid">
          {items.map((item, index) => {
            const url = text(item.url);
            const card = <><span>{text(item.icon) || String(index + 1).padStart(2, "0")}</span><h3>{text(item.title)}</h3><p>{text(item.description)}</p></>;
            return url ? <Link href={url.startsWith("/") ? url : `/${locale}/${url}`} key={`${text(item.title)}-${index}`}>{card}</Link> : <article key={`${text(item.title)}-${index}`}>{card}</article>;
          })}
        </div>
      </div>
    </section>
  );
}

function FAQ({ block }: Pick<Props, "block">) {
  const items = Array.isArray(block.props.items) ? block.props.items.map(record) : [];
  return (
    <section className="section cms-faq-section">
      <div className="container cms-narrow">
        <h2>{text(block.props.heading) || text(block.props.title)}</h2>
        <div className="cms-faq-list">
          {items.map((item, index) => <details key={`${text(item.question)}-${index}`}><summary>{text(item.question)}</summary><p>{text(item.answer)}</p></details>)}
        </div>
      </div>
    </section>
  );
}

function Testimonials({ block }: Pick<Props, "block">) {
  const items = Array.isArray(block.props.items) ? block.props.items.map(record) : [];
  return (
    <section className="section cms-testimonial-section">
      <div className="container">
        <div className="section-heading"><span>“</span><h2>{text(block.props.heading) || text(block.props.title)}</h2></div>
        <div className="cms-testimonial-grid">
          {items.map((item, index) => <figure key={`${text(item.name)}-${index}`}><blockquote>{text(item.quote)}</blockquote><figcaption><b>{text(item.name)}</b><span>{[text(item.role), text(item.company)].filter(Boolean).join(" · ")}</span></figcaption></figure>)}
        </div>
      </div>
    </section>
  );
}

function FormSection({ block, locale }: Pick<Props, "block" | "locale">) {
  const form = block.props.form;
  if (!form || typeof form !== "object" || !("key" in form)) return null;
  const selectedForm = form as Form;
  if (selectedForm.isActive === false) return null;
  return <CmsForm form={selectedForm} locale={locale} eyebrow={text(block.props.eyebrow)} heading={text(block.props.heading)} intro={text(block.props.intro)} context={text(block.props.context)} compact={block.variant === "compact"} />;
}

export function BlockRenderer(props: Props) {
  if (props.block.type === "hero") return <Hero {...props} />;
  if (props.block.type === "service_grid") return <ServiceGrid {...props} />;
  if (props.block.type === "pricing") return <Pricing {...props} />;
  if (props.block.type === "cta") return <CallToAction {...props} />;
  if (props.block.type === "rich_text") return <RichTextSection {...props} />;
  if (props.block.type === "feature_grid") return <FeatureGrid {...props} />;
  if (props.block.type === "faq") return <FAQ {...props} />;
  if (props.block.type === "testimonials") return <Testimonials {...props} />;
  if (props.block.type === "form") return <FormSection {...props} />;
  return null;
}
