"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type PatternVariant = "hero" | "topology" | "cables" | "infrastructure" | "cta";

const PATTERN_TARGETS: ReadonlyArray<{ selector: string; variant: PatternVariant }> = [
  { selector: ".hero-shell", variant: "hero" },
  { selector: ".operations", variant: "topology" },
  { selector: ".services", variant: "cables" },
  { selector: ".network-section", variant: "infrastructure" },
  { selector: ".ctabox", variant: "cta" },
];

function NetworkPattern({ variant }: { variant: PatternVariant }) {
  if (variant === "hero") {
    return <div className="network-pattern network-pattern--hero" aria-hidden="true">
      <svg viewBox="0 0 1440 760" preserveAspectRatio="none">
        <path id="homepageHeroRoute" className="network-route network-route--primary" d="M-80 190 C170 72 310 300 540 175 S920 20 1160 175 S1400 310 1530 165" />
        <path className="network-route network-route--secondary" d="M-40 570 C230 430 390 650 650 500 S1040 360 1490 590" />
        <path className="network-route network-route--fine" d="M105 0 C205 175 350 145 455 282 S690 435 825 300" />
        <path className="network-route network-route--primary" d="M-120 365 C120 260 285 430 470 348 S770 210 965 338 S1260 505 1540 392" />
        <path className="network-route network-route--secondary" d="M65 705 C235 585 410 735 595 625 S910 500 1110 635 S1360 720 1510 645" />
        <path className="network-route network-route--fine" d="M860 -40 C810 135 990 188 930 355 S975 610 1165 760" />
        <path className="network-route network-route--fine" d="M280 -30 C390 92 515 52 610 160 S720 350 660 520" />
        <g className="network-nodes">
          <circle cx="172" cy="126" r="5" /><circle cx="540" cy="175" r="6" /><circle cx="875" cy="112" r="4" />
          <circle cx="1160" cy="175" r="6" /><circle cx="374" cy="568" r="4" /><circle cx="650" cy="500" r="6" /><circle cx="1128" cy="452" r="4" />
          <circle cx="470" cy="348" r="6" /><circle cx="965" cy="338" r="5" /><circle cx="595" cy="625" r="6" />
          <circle cx="1110" cy="635" r="5" /><circle cx="930" cy="355" r="6" /><circle cx="610" cy="160" r="4" />
        </g>
        <circle className="network-signal" r="4"><animateMotion dur="19s" repeatCount="indefinite"><mpath href="#homepageHeroRoute" /></animateMotion></circle>
      </svg>
    </div>;
  }

  if (variant === "cables") {
    return <div className="network-pattern network-pattern--cables" aria-hidden="true">
      <svg viewBox="0 0 1440 820" preserveAspectRatio="none">
        <path className="network-route network-route--primary" d="M-60 135 C150 80 165 320 350 290 S520 82 720 155" />
        <path className="network-route network-route--secondary" d="M1445 600 C1250 690 1200 470 1030 510 S840 740 650 650" />
        <path className="network-route network-route--fine" d="M-40 185 C165 130 205 365 380 332" />
        <path className="network-route network-route--primary" d="M-80 470 C145 345 290 520 485 430 S770 305 970 405 S1230 540 1510 410" />
        <path className="network-route network-route--secondary" d="M80 760 C235 610 405 760 575 620 S900 490 1085 630 S1300 745 1490 680" />
        <path className="network-route network-route--secondary" d="M220 -30 C170 155 370 205 315 390 S350 670 545 840" />
        <path className="network-route network-route--fine" d="M920 -25 C830 150 1010 230 930 380 S1035 670 1260 795" />
        <g className="network-nodes">
          <circle cx="350" cy="290" r="5" /><circle cx="720" cy="155" r="4" /><circle cx="1030" cy="510" r="5" /><circle cx="650" cy="650" r="4" />
          <circle cx="485" cy="430" r="6" /><circle cx="970" cy="405" r="5" /><circle cx="575" cy="620" r="6" />
          <circle cx="1085" cy="630" r="5" /><circle cx="315" cy="390" r="4" /><circle cx="930" cy="380" r="5" />
        </g>
      </svg>
    </div>;
  }

  if (variant === "topology") {
    return <div className="network-pattern network-pattern--topology" aria-hidden="true">
      <svg viewBox="0 0 1440 760" preserveAspectRatio="none">
        <g className="network-topology-lines">
          <path d="M1020 85 L1160 165 L1325 105" /><path d="M1160 165 L1080 300 L1245 370 L1370 285" />
          <path d="M1080 300 L930 430 L1088 520 L1275 485 L1395 610" /><path d="M1245 370 L1275 485" />
          <path d="M85 185 L230 105 L385 205 L540 120 L705 240" /><path d="M230 105 L300 315 L470 390 L625 330" />
          <path d="M85 520 L245 430 L395 555 L560 485 L755 610" /><path d="M300 315 L245 430" /><path d="M470 390 L560 485" />
          <path d="M705 240 L830 315 L930 430" /><path d="M755 610 L915 565 L1088 520" />
        </g>
        <g className="network-nodes network-nodes--outlined">
          <circle cx="1020" cy="85" r="7" /><circle cx="1160" cy="165" r="9" /><circle cx="1325" cy="105" r="6" />
          <circle cx="1080" cy="300" r="7" /><circle cx="1245" cy="370" r="9" /><circle cx="1370" cy="285" r="6" />
          <circle cx="930" cy="430" r="6" /><circle cx="1088" cy="520" r="8" /><circle cx="1275" cy="485" r="6" /><circle cx="1395" cy="610" r="8" />
          <circle cx="85" cy="185" r="6" /><circle cx="230" cy="105" r="8" /><circle cx="385" cy="205" r="6" />
          <circle cx="540" cy="120" r="7" /><circle cx="705" cy="240" r="9" /><circle cx="300" cy="315" r="6" />
          <circle cx="470" cy="390" r="8" /><circle cx="625" cy="330" r="6" /><circle cx="85" cy="520" r="7" />
          <circle cx="245" cy="430" r="9" /><circle cx="395" cy="555" r="6" /><circle cx="560" cy="485" r="8" /><circle cx="755" cy="610" r="7" />
        </g>
      </svg>
    </div>;
  }

  if (variant === "infrastructure") {
    return <div className="network-pattern network-pattern--infrastructure" aria-hidden="true">
      <svg viewBox="0 0 1440 850" preserveAspectRatio="none">
        <g className="network-patch-grid">
          <rect x="42" y="105" width="260" height="160" rx="18" /><rect x="78" y="138" width="42" height="28" rx="5" />
          <rect x="137" y="138" width="42" height="28" rx="5" /><rect x="196" y="138" width="42" height="28" rx="5" />
          <rect x="78" y="185" width="42" height="28" rx="5" /><rect x="137" y="185" width="42" height="28" rx="5" />
          <rect x="196" y="185" width="42" height="28" rx="5" />
          <rect x="1125" y="545" width="270" height="170" rx="18" /><rect x="1162" y="582" width="44" height="29" rx="5" />
          <rect x="1222" y="582" width="44" height="29" rx="5" /><rect x="1282" y="582" width="44" height="29" rx="5" />
          <rect x="1162" y="630" width="44" height="29" rx="5" /><rect x="1222" y="630" width="44" height="29" rx="5" />
          <rect x="1282" y="630" width="44" height="29" rx="5" />
        </g>
        <path className="network-route network-route--primary" d="M99 166 C98 350 395 325 450 505 S800 685 980 525 S1240 400 1480 570" />
        <path className="network-route network-route--secondary" d="M216 213 C310 390 535 245 630 395 S870 610 1080 400" />
        <path className="network-route network-route--primary" d="M-40 690 C190 555 300 740 520 625 S850 455 1090 595 S1320 760 1500 680" />
        <path className="network-route network-route--secondary" d="M-50 390 C180 250 360 445 555 330 S870 205 1065 330 S1270 480 1470 360" />
        <path className="network-route network-route--fine" d="M420 -40 C350 155 560 230 490 405 S565 720 760 875" />
        <path className="network-route network-route--fine" d="M1010 -30 C900 170 1110 240 1020 430 S1085 720 1260 850" />
        <g className="network-nodes">
          <circle cx="450" cy="505" r="6" /><circle cx="630" cy="395" r="5" /><circle cx="980" cy="525" r="7" /><circle cx="1080" cy="400" r="5" />
          <circle cx="520" cy="625" r="7" /><circle cx="1090" cy="595" r="6" /><circle cx="555" cy="330" r="6" />
          <circle cx="1065" cy="330" r="7" /><circle cx="490" cy="405" r="5" /><circle cx="1020" cy="430" r="6" />
        </g>
      </svg>
    </div>;
  }

  return <div className="network-pattern network-pattern--cta" aria-hidden="true">
    <svg viewBox="0 0 1240 300" preserveAspectRatio="none">
      <path id="homepageCtaRoute" className="network-route network-route--primary" d="M-40 230 C180 90 330 270 520 135 S850 65 1040 155 S1230 255 1300 170" />
      <path className="network-route network-route--secondary" d="M520 135 C610 180 690 250 820 275" />
      <path className="network-route network-route--secondary" d="M-30 80 C180 205 315 20 485 110 S790 240 955 110 S1150 35 1290 90" />
      <path className="network-route network-route--fine" d="M240 -20 C300 70 270 145 360 205 S540 270 650 220" />
      <path className="network-route network-route--fine" d="M870 -20 C815 75 900 145 850 225 S925 310 1060 285" />
      <g className="network-nodes">
        <circle cx="180" cy="145" r="5" /><circle cx="520" cy="135" r="7" /><circle cx="1040" cy="155" r="5" />
        <circle cx="185" cy="154" r="4" /><circle cx="485" cy="110" r="6" /><circle cx="955" cy="110" r="6" />
        <circle cx="360" cy="205" r="4" /><circle cx="850" cy="225" r="5" />
      </g>
      <circle className="network-signal" r="3"><animateMotion begin="-7s" dur="24s" repeatCount="indefinite"><mpath href="#homepageCtaRoute" /></animateMotion></circle>
    </svg>
  </div>;
}

export function HomepageNetworkPatterns() {
  const [targets, setTargets] = useState<Array<{ element: Element; selector: string; variant: PatternVariant }>>([]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const root = document.querySelector(".reference-homepage");
      if (!root) return;
      setTargets(PATTERN_TARGETS.flatMap((item) => {
        const element = root.querySelector(item.selector);
        return element ? [{ element, selector: item.selector, variant: item.variant }] : [];
      }));
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return <>{targets.map((target) => createPortal(<NetworkPattern variant={target.variant} />, target.element, target.selector))}</>;
}
