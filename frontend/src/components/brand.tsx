import Link from "next/link";
import type { Locale } from "@/lib/types";

export function Brand({ locale }: { locale: Locale }) {
  return (
    <Link href={`/${locale}`} className="brand" aria-label="AbrIT">
      <svg className="brand-mark" viewBox="0 0 64 42" aria-hidden="true">
        <path d="M13 34C6 34 2 29 2 23s5-11 12-11c2-7 8-10 14-10 7 0 12 4 15 10 2-1 4-1 6-1 8 0 13 5 13 12s-5 11-13 11H13Z" />
        <path d="m17 25 8-8 7 7 12-13" />
      </svg>
      <span className="brand-word">Abr<span>IT</span></span>
    </Link>
  );
}
