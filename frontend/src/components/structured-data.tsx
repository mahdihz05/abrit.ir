import { SITE_URL } from "@/lib/seo";
import type { ContentDetail, Locale, SiteSettings } from "@/lib/types";

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

export function OrganizationJsonLd({ settings }: { settings: SiteSettings }) {
  const data: Record<string, unknown> = { "@context": "https://schema.org", "@type": "Organization", name: settings.brand_name, url: SITE_URL };
  if (settings.logo_url) data.logo = settings.logo_url;
  if (settings.phone) data.telephone = settings.phone;
  if (settings.email) data.email = settings.email;
  if (settings.address) data.address = { "@type": "PostalAddress", streetAddress: settings.address };
  return <JsonLd data={data} />;
}

export function ContentJsonLd({ locale, content }: { locale: Locale; content: ContentDetail }) {
  const url = `${SITE_URL}${content.url}`;
  const breadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "AbrIT", item: `${SITE_URL}/${locale}` },
      { "@type": "ListItem", position: 2, name: content.title, item: url },
    ],
  };
  const entity: Record<string, unknown> | null = content.kind === "service"
    ? { "@context": "https://schema.org", "@type": "Service", name: content.title, description: content.excerpt, url, provider: { "@type": "Organization", name: "AbrIT", url: SITE_URL } }
    : (["knowledge", "news"].includes(content.kind) && content.published_at)
      ? { "@context": "https://schema.org", "@type": "Article", headline: content.title, description: content.excerpt, url, datePublished: content.published_at, publisher: { "@type": "Organization", name: "AbrIT", url: SITE_URL } }
      : null;
  return <>{entity && <JsonLd data={entity} />}<JsonLd data={breadcrumb} /></>;
}
