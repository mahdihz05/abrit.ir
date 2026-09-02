import styles from "./reference-homepage.module.css";
import { HomepageRuntime } from "./homepage-runtime";
import { HomepageNetworkPatterns } from "./homepage-network-patterns";
import { HomepageLeadMount } from "./homepage-lead-mount";
import { HOMEPAGE_RUNTIME_URL, HOMEPAGE_STYLESHEET_URL } from "@/lib/homepage-assets";
import type { Locale } from "@/lib/types";

export function ReferenceHomepage({ body, direction, locale }: { body: string; direction: "rtl" | "ltr"; locale: Locale }) {
  return (
    <>
      <link rel="stylesheet" href={HOMEPAGE_STYLESHEET_URL} />
      <span id="meta" hidden />
      <div
        className={`reference-homepage ${styles.homepage}`}
        data-homepage-locale={locale}
        dir={direction}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: body }}
      />
      <script src={HOMEPAGE_RUNTIME_URL} defer data-abrit-homepage-runtime="true" />
      <HomepageRuntime />
      <HomepageNetworkPatterns />
      <HomepageLeadMount locale={locale} />
    </>
  );
}
