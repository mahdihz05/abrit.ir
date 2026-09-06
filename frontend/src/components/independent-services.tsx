import type { CSSProperties } from "react";
import type { IndependentService, IndependentServiceBlock, IndependentServicesCopy } from "@/lib/independent-services-cms";
import type { ContentSummary, Locale } from "@/lib/types";
import { IndependentConsultationForm } from "./independent-consultation-form";
import styles from "./independent-services.module.css";

function ServiceGlyph({ slug }: { slug: IndependentService["slug"] }) {
  const glyphs = {
    backup: (
      <>
        <path d="M7 9a6 6 0 1 1 1.7 8.2" />
        <path d="M7 5v4h4" />
        <path d="M12 8v5l3 2" />
      </>
    ),
    "cloud-storage": (
      <>
        <path d="M7.4 18h10.2a4.4 4.4 0 0 0 .2-8.8A6.2 6.2 0 0 0 6 10.8 3.6 3.6 0 0 0 7.4 18Z" />
        <path d="M9 14h6" />
      </>
    ),
    workspace: (
      <>
        <rect x="4" y="5" width="16" height="14" rx="2" />
        <path d="M4 10h16M9 10v9" />
        <path d="M12 7h4" />
      </>
    ),
    voice: (
      <>
        <path d="M8.2 4.8 6 6.1c-.8.5-1.1 1.5-.8 2.4 1.7 5.2 5.1 8.6 10.3 10.3.9.3 1.9 0 2.4-.8l1.3-2.2-4.1-2-1.2 1.4a12.4 12.4 0 0 1-5.1-5.1l1.4-1.2-2-4.1Z" />
      </>
    ),
  };
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glyphs[slug]}
    </svg>
  );
}

function SectionHeading({
  eyebrow,
  title,
  intro,
  inverted = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  inverted?: boolean;
}) {
  return (
    <header
      className={`${styles.sectionHeading} ${inverted ? styles.inverted : ""}`}
    >
      <span>{eyebrow}</span>
      <div>
        <h2>{title}</h2>
        {intro ? <p>{intro}</p> : null}
      </div>
    </header>
  );
}

function OperatingRail({
  items,
  locale,
  inverted = false,
}: {
  items: readonly IndependentServiceBlock[];
  locale: Locale;
  inverted?: boolean;
}) {
  return (
    <ol
      className={`${styles.operatingRail} ${inverted ? styles.operatingRailInverted : ""}`}
    >
      {items.map((item, index) => (
        <li
          key={item.title.en}
          style={{ "--rail-index": index } as CSSProperties}
        >
          <div className={styles.railNode}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <i aria-hidden="true" />
          </div>
          <h3>{item.title[locale]}</h3>
          <p>{item.body[locale]}</p>
          {item.tags ? (
            <ul>
              {item.tags.map((tag) => (
                <li key={tag} dir="ltr">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ol>
  );
}

export function IndependentServicesListing({ locale, services, copy }: { locale: Locale; services: IndependentService[]; copy: IndependentServicesCopy }) {
  return (
    <main className={styles.page}>
      <section className={styles.listingHero}>
        <div className={`container ${styles.listingHeroInner}`}>
          <div>
            <span className={styles.eyebrow}>{copy.eyebrow[locale]}</span>
            <h1>{copy.title[locale]}</h1>
            <p>{copy.intro[locale]}</p>
          </div>
          <div className={styles.familyDiagram} aria-hidden="true">
            <div className={styles.familyCore}>
              <b>AbrIT</b>
              <small>INDEPENDENT</small>
            </div>
            {services.map((service, index) => (
              <span
                key={service.slug}
                style={{ "--service-index": index } as CSSProperties}
              >
                {service.code.replace("ABRIT ", "")}
              </span>
            ))}
          </div>
        </div>
      </section>
      <section className={`${styles.section} ${styles.familySection}`}>
        <div className="container">
          <SectionHeading
            eyebrow="ABRIT · SERVICE MAP"
            title={copy.familyTitle[locale]}
            intro={copy.familyBody[locale]}
            inverted
          />
          <OperatingRail items={copy.familyStages} locale={locale} inverted />
        </div>
      </section>
      <section className={styles.listingSection}>
        <div className="container">
          <SectionHeading
            eyebrow={copy.eyebrow[locale]}
            title={copy.back[locale]}
            intro={copy.intro[locale]}
          />
          <div className={styles.listingGrid}>
            {services.map((service, index) => (
              <a
                className={styles.listingCard}
                href={`/${locale}/independent-services/${service.slug}`}
                key={service.slug}
              >
                <div className={styles.cardTop}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div className={styles.glyph}>
                    <ServiceGlyph slug={service.slug} />
                  </div>
                </div>
                <small>{service.category[locale]}</small>
                <h2>{service.title[locale]}</h2>
                <p>{service.heroBody[locale]}</p>
                <b>
                  {copy.explore[locale]} <span aria-hidden="true">↗</span>
                </b>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className={`${styles.section} ${styles.decisionSection}`}>
        <div className="container">
          <SectionHeading
            eyebrow="ABRIT · FIT"
            title={copy.decisionTitle[locale]}
            intro={copy.decisionBody[locale]}
          />
          <div className={styles.decisionGrid}>
            {copy.decisions.map((item, index) => (
              <article key={item.title.en}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{item.title[locale]}</h3>
                  <p>{item.body[locale]}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className={styles.listingCta}>
        <div className="container">
          <div>
            <span>ABRIT · ASSESSMENT</span>
            <h2>{copy.consult[locale]}</h2>
          </div>
          <a href="#service-consultation">
            {copy.consult[locale]} <span aria-hidden="true">←</span>
          </a>
        </div>
      </section>
      <IndependentConsultationForm locale={locale} services={services} />
    </main>
  );
}

export function IndependentServiceDetail({
  locale,
  service,
  services,
  copy,
  relatedManaged,
}: {
  locale: Locale;
  service: IndependentService;
  services: IndependentService[];
  copy: IndependentServicesCopy;
  relatedManaged: ContentSummary | null;
}) {
  const relatedIndependent = services
    .filter((item) => item.slug !== service.slug)
    .slice(0, 3);
  return (
    <main className={styles.page} data-service={service.slug}>
      <section className={styles.hero}>
        <div className={`container ${styles.heroGrid}`}>
          <div className={styles.heroCopy}>
            <span className={styles.eyebrow}>{service.category[locale]}</span>
            <h1>{service.heroTitle[locale]}</h1>
            <p>{service.heroBody[locale]}</p>
            <div className={styles.heroActions}>
              <a className={styles.primaryAction} href="#service-consultation">
                {copy.consult[locale]}
              </a>
              <a
                className={styles.secondaryAction}
                href={`/${locale}/independent-services`}
              >
                {copy.back[locale]}
              </a>
            </div>
          </div>
          <div
            className={styles.serviceSignal}
            aria-label={`${service.title[locale]} — ${service.pulse.map((item) => item[locale]).join("، ")}`}
          >
            <div className={styles.signalHeader}>
              <span>{service.code}</span>
              <b>ONLINE</b>
            </div>
            <div className={styles.signalCore} aria-hidden="true">
              <div className={styles.heroGlyph}>
                <ServiceGlyph slug={service.slug} />
              </div>
              <i />
              <i />
              <i />
            </div>
            <ul>
              {service.pulse.map((item, index) => (
                <li
                  key={item.en}
                  style={{ "--pulse-index": index } as CSSProperties}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{item[locale]}</b>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <SectionHeading
            eyebrow={copy.overview[locale]}
            title={service.overviewTitle[locale]}
            intro={service.overviewBody[locale]}
          />
          <div className={styles.contextGrid}>
            {service.context.map((item) => (
              <article key={item.title.en}>
                <h3>{item.title[locale]}</h3>
                <p>{item.body[locale]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.deliverablesSection}`}>
        <div className="container">
          <SectionHeading
            eyebrow={copy.deliverables[locale]}
            title={service.deliverablesTitle[locale]}
            intro={service.deliverablesBody[locale]}
          />
          <div className={styles.deliverablesGrid}>
            {service.deliverables.map((item, index) => (
              <article
                key={item.title.en}
                style={{ "--card-index": index } as CSSProperties}
              >
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i aria-hidden="true" />
                </div>
                <h3>{item.title[locale]}</h3>
                <p>{item.body[locale]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.softSection}`}>
        <div className="container">
          <SectionHeading
            eyebrow={copy.capabilities[locale]}
            title={service.capabilitiesTitle[locale]}
          />
          <div className={styles.capabilityGrid}>
            {service.capabilities.map((item, index) => (
              <article key={item.title.en}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{item.title[locale]}</h3>
                <p>{item.body[locale]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.darkSection}`}>
        <div className="container">
          <SectionHeading
            eyebrow={copy.architecture[locale]}
            title={service.architectureTitle[locale]}
            intro={service.architectureBody[locale]}
            inverted
          />
          <div className={styles.architectureGrid}>
            {service.architecture.map((item, index) => (
              <article key={item.title.en}>
                <div>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i />
                </div>
                <h3>{item.title[locale]}</h3>
                <p>{item.body[locale]}</p>
                {item.tags ? (
                  <ul>
                    {item.tags.map((tag) => (
                      <li key={tag} dir="ltr">
                        {tag}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </article>
            ))}
          </div>
        </div>
      </section>

      {service.comparison ? (
        <section className={styles.section}>
          <div className="container">
            <SectionHeading
              eyebrow={copy.comparison[locale]}
              title={service.showcaseTitle[locale]}
              intro={service.comparison.intro[locale]}
            />
            <div
              className={styles.tableRegion}
              role="region"
              aria-label={copy.comparison[locale]}
              tabIndex={0}
            >
              <table>
                <thead>
                  <tr>
                    {service.comparison.columns.map((column) => (
                      <th key={column.en} scope="col">
                        {column[locale]}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {service.comparison.rows.map((row) => (
                    <tr key={row.label.en}>
                      <th scope="row">{row.label[locale]}</th>
                      {row.values.map((value, index) => (
                        <td key={`${row.label.en}-${index}`}>
                          {value[locale]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      ) : (
        <section className={`${styles.section} ${styles.showcaseSection}`}>
          <div className="container">
            <SectionHeading
              eyebrow={service.code}
              title={service.showcaseTitle[locale]}
              intro={service.showcaseBody[locale]}
            />
            <div className={styles.showcaseGrid}>
              {service.showcase.map((item, index) => (
                <article
                  key={item.title.en}
                  className={index === 0 ? styles.featuredShowcase : ""}
                >
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{item.title[locale]}</h3>
                  <p>{item.body[locale]}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className={`${styles.section} ${styles.managedFlowSection}`}>
        <div className="container">
          <SectionHeading
            eyebrow={copy.managedScope[locale]}
            title={service.managedScopeTitle[locale]}
            intro={service.managedScopeBody[locale]}
            inverted
          />
          <OperatingRail
            items={service.managedScope}
            locale={locale}
            inverted
          />
        </div>
      </section>

      <section className={styles.processSection}>
        <div className="container">
          <SectionHeading
            eyebrow={copy.process[locale]}
            title={service.processTitle[locale]}
          />
          <ol>
            {service.process.map((step, index) => (
              <li key={step.title.en}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title[locale]}</h3>
                  <p>{step.body[locale]}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className={styles.technologyBar}>
            <span>{copy.technologies[locale]}</span>
            <div>
              {service.technologies.map((technology) => (
                <b key={technology} dir="ltr">
                  {technology}
                </b>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} ${styles.faqSection}`}>
        <div className="container">
          <SectionHeading
            eyebrow={copy.faq[locale]}
            title={service.faqTitle[locale]}
          />
          <div className={styles.faqList}>
            {service.faqs.map((item, index) => (
              <details key={item.question.en}>
                <summary>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <b>{item.question[locale]}</b>
                  <i aria-hidden="true" />
                </summary>
                <div>
                  <p>{item.answer[locale]}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className="container">
          <div>
            <span>{service.code}</span>
            <h2>{service.ctaTitle[locale]}</h2>
            <p>{service.ctaBody[locale]}</p>
          </div>
          <a href="#service-consultation">
            {copy.consult[locale]} <span aria-hidden="true">←</span>
          </a>
        </div>
      </section>

      <section className={styles.relatedSection}>
        <div className="container">
          <SectionHeading
            eyebrow={copy.related[locale]}
            title={copy.back[locale]}
          />
          <div className={styles.relatedGrid}>
            {relatedManaged ? (
              <a
                href={relatedManaged.url}
                className={styles.managedCard}
              >
                <small>{copy.related[locale]}</small>
                <h3>{relatedManaged.title}</h3>
                <p>{relatedManaged.excerpt}</p>
              </a>
            ) : null}
            {relatedIndependent.map((item) => (
              <a
                href={`/${locale}/independent-services/${item.slug}`}
                key={item.slug}
              >
                <small>{item.category[locale]}</small>
                <h3>{item.title[locale]}</h3>
                <p>{item.heroBody[locale]}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
      <IndependentConsultationForm locale={locale} service={service} services={services} />
    </main>
  );
}
