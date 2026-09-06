"use client";

import { useEffect } from "react";

type HeroContent = {
  eyebrow: string;
  title: string;
  highlight: string;
  body: string;
  primaryCTA?: { label?: string | null; url?: string | null; openInNewTab?: boolean | null } | null;
  secondaryCTA?: { label?: string | null; url?: string | null; openInNewTab?: boolean | null } | null;
  points: string[];
};

function text(root: Element, selector: string, value: string) {
  const target = root.querySelector<HTMLElement>(selector);
  if (target) target.textContent = value;
}

function link(root: Element, selector: string, value?: { label?: string | null; url?: string | null; openInNewTab?: boolean | null } | null) {
  const target = root.querySelector<HTMLAnchorElement>(selector);
  if (!target || !value?.label || !value.url) return;
  target.textContent = value.label;
  target.href = value.url;
  if (value.openInNewTab) {
    target.target = "_blank";
    target.rel = "noopener noreferrer";
  } else {
    target.removeAttribute("target");
    target.removeAttribute("rel");
  }
}

function render(root: Element, content: HeroContent, index: number) {
  const copy = root.querySelector<HTMLElement>("#herocopy");
  copy?.classList.remove("swap");
  void copy?.offsetWidth;
  copy?.classList.add("swap");
  text(root, "#hk", content.eyebrow);
  const title = root.querySelector<HTMLElement>("#hh");
  const highlightIndex = content.title.indexOf(content.highlight);
  if (title && highlightIndex >= 0) {
    const emphasis = document.createElement("em");
    emphasis.textContent = content.highlight;
    title.replaceChildren(document.createTextNode(content.title.slice(0, highlightIndex)), emphasis, document.createTextNode(content.title.slice(highlightIndex + content.highlight.length)));
  } else if (title) title.textContent = content.title;
  text(root, "#hp", content.body);
  link(root, "#ha", content.primaryCTA);
  link(root, "#hb", content.secondaryCTA);
  const points = root.querySelector<HTMLElement>("#hpoints");
  points?.replaceChildren(...content.points.map((value) => {
    const point = document.createElement("span");
    point.textContent = value;
    return point;
  }));
  root.querySelectorAll<HTMLButtonElement>(".dots button").forEach((button, buttonIndex) => button.classList.toggle("active", buttonIndex === index));
}

export function HomepageCmsHero({ content }: { content: HeroContent[] }) {
  useEffect(() => {
    const root = document.querySelector(".reference-homepage");
    const shell = root?.querySelector<HTMLElement>(".hero-shell");
    if (!root || !shell) return;
    shell.dataset.abritReactOwned = "hero";
    if (!content.length) return;
    let index = 0;
    render(root, content[index], index);
    const buttons = Array.from(root.querySelectorAll<HTMLButtonElement>(".dots button"));
    const handlers = buttons.map((button, buttonIndex) => {
      const handler = () => { index = buttonIndex; render(root, content[index], index); };
      button.addEventListener("click", handler);
      return handler;
    });
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = content.length > 1 && !reducedMotion ? window.setInterval(() => {
      if (document.hidden || !shell.classList.contains("is-in-view")) return;
      index = (index + 1) % content.length;
      render(root, content[index], index);
    }, 7_000) : undefined;
    return () => {
      if (timer) window.clearInterval(timer);
      buttons.forEach((button, buttonIndex) => button.removeEventListener("click", handlers[buttonIndex]));
    };
  }, [content]);

  return null;
}
