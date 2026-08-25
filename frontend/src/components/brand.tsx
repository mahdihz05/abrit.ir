import Link from "next/link";
import Image from "next/image";
import type { Locale } from "@/lib/types";

export function Brand({ locale, inverse = false }: { locale: Locale; inverse?: boolean }) {
  return (
    <Link href={`/${locale}`} className={`brand${inverse ? " brand--inverse" : ""}`} aria-label="AbrIT Infinite Cloud">
      <span className="brand-logo-frame">
        <Image
          alt="AbrIT Infinite Cloud"
          className="brand-logo-image"
          height={1461}
          priority={!inverse}
          sizes={inverse ? "210px" : "148px"}
          src="/abrit-logo-transparent.png"
          width={3179}
        />
      </span>
    </Link>
  );
}
