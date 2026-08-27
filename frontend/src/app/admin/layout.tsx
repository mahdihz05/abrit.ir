import type { Metadata } from "next";
import { ibmPlexArabic, inter, vazirmatn } from "../fonts";

import "./admin.css";

export const metadata: Metadata = {
  title: "مدیریت | AbrIT",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} ${inter.variable} ${ibmPlexArabic.variable}`}>
      <body className="admin-body">{children}</body>
    </html>
  );
}
