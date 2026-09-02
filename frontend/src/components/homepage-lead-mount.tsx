"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { LeadForm } from "./lead-form";
import type { Locale } from "@/lib/types";

const subscribeToHydration = () => () => undefined;

export function HomepageLeadMount({ locale }: { locale: Locale }) {
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false,
  );
  const target = hydrated ? document.getElementById("homepage-lead-form") : null;

  return target ? createPortal(<LeadForm locale={locale} context="home-assessment" compact />, target) : null;
}
