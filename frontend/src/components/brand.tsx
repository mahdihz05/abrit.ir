import Link from "next/link";
import type { Locale } from "@/lib/types";

export function Brand({ locale }: { locale: Locale }) {
  return (
    <Link href={`/${locale}`} className="brand" aria-label="AbrIT">
      <span className="brand-css-mark" aria-hidden="true"><i /><i /></span>
      <span className="brand-word">Abr<span>IT</span></span>
    </Link>
  );
}
