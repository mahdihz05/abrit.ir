"use client";

import { useEffect, useRef } from "react";
import { HOMEPAGE_RUNTIME_URL } from "@/lib/homepage-assets";

type PausableSvg = SVGSVGElement & {
  pauseAnimations?: () => void;
  unpauseAnimations?: () => void;
};

export function HomepageRuntime() {
  const auraRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.querySelector<HTMLElement>(".reference-homepage");
    if (!root || root.dataset.motionInitialized === "true") return;

    root.dataset.motionInitialized = "true";
    let disposed = false;
    let fallbackRuntime: HTMLScriptElement | null = null;
    let fallbackTimer = 0;
    let pointerFrame = 0;
    const cleanup: Array<() => void> = [];

    const initializeMotion = () => {
      if (disposed || root.dataset.motionReady === "true") return;
      root.dataset.motionReady = "true";

      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const language = document.documentElement.lang.toLowerCase();
      const railLabels = language.startsWith("fa")
        ? { previous: "مورد قبلی", pause: "توقف حرکت", play: "ادامه حرکت", next: "مورد بعدی", group: "کنترل حرکت محتوا" }
        : language.startsWith("ar")
          ? { previous: "العنصر السابق", pause: "إيقاف الحركة", play: "متابعة الحركة", next: "العنصر التالي", group: "التحكم بحركة المحتوى" }
          : { previous: "Previous item", pause: "Pause movement", play: "Resume movement", next: "Next item", group: "Moving content controls" };
      const installRailControls = (
        viewport: HTMLElement,
        controlledTracks: HTMLElement | HTMLElement[],
        anchor: Element,
        itemCount: number,
        orientation: "horizontal" | "vertical" = "horizontal",
      ) => {
        const tracks = Array.isArray(controlledTracks) ? controlledTracks : [controlledTracks];
        const controls = document.createElement("div");
        controls.className = "rail-controls";
        if (orientation === "vertical") controls.classList.add("is-vertical");
        controls.setAttribute("role", "group");
        controls.setAttribute("aria-label", railLabels.group);
        const previous = document.createElement("button");
        const toggle = document.createElement("button");
        const next = document.createElement("button");
        previous.type = toggle.type = next.type = "button";
        previous.textContent = orientation === "vertical" ? "↑" : "‹";
        toggle.textContent = "Ⅱ";
        next.textContent = orientation === "vertical" ? "↓" : "›";
        previous.setAttribute("aria-label", railLabels.previous);
        toggle.setAttribute("aria-label", railLabels.pause);
        next.setAttribute("aria-label", railLabels.next);
        controls.append(previous, toggle, next);
        anchor.insertAdjacentElement("beforebegin", controls);

        const animations = () => tracks.map((track) => track.getAnimations()[0]).filter(Boolean);
        const animation = () => animations()[0];
        const move = (amount: number) => {
          animations().forEach((railAnimation) => {
            const current = typeof railAnimation.currentTime === "number" ? railAnimation.currentTime : 0;
            railAnimation.currentTime = Math.max(0, current + amount);
          });
        };
        const stepDuration = () => {
          const duration = animation()?.effect?.getTiming().duration;
          return typeof duration === "number" && itemCount > 0 ? duration / itemCount : 3500;
        };
        const onPrevious = () => move(-stepDuration());
        const onNext = () => move(stepDuration());
        const onToggle = () => {
          const paused = viewport.classList.toggle("is-manually-paused");
          toggle.textContent = paused ? "▶" : "Ⅱ";
          toggle.setAttribute("aria-label", paused ? railLabels.play : railLabels.pause);
          animations().forEach((railAnimation) => {
            if (paused) railAnimation.pause();
            else railAnimation.play();
          });
        };
        previous.addEventListener("click", onPrevious);
        toggle.addEventListener("click", onToggle);
        next.addEventListener("click", onNext);
        cleanup.push(() => {
          previous.removeEventListener("click", onPrevious);
          toggle.removeEventListener("click", onToggle);
          next.removeEventListener("click", onNext);
          controls.remove();
        });
      };
      const visibilityTargets = root.querySelectorAll<HTMLElement>(
        ".hero-shell, .services, .operations, .network-section, .process, .tech",
      );
      const setVisibility = (element: HTMLElement, visible: boolean) => {
        element.classList.toggle("is-in-view", visible);
        element.querySelectorAll<PausableSvg>("svg").forEach((svg) => {
          if (visible || reducedMotion) svg.unpauseAnimations?.();
          else svg.pauseAnimations?.();
        });
      };

      if (reducedMotion) {
        visibilityTargets.forEach((element) => {
          element.classList.add("is-in-view", "is-active");
          setVisibility(element, true);
        });
      } else {
        const visibilityObserver = new IntersectionObserver(
          (entries) => entries.forEach((entry) => setVisibility(entry.target as HTMLElement, entry.isIntersecting)),
          { rootMargin: "12% 0px 12%", threshold: 0.08 },
        );
        visibilityTargets.forEach((element) => visibilityObserver.observe(element));
        cleanup.push(() => visibilityObserver.disconnect());

        const activationObserver = new IntersectionObserver(
          (entries) => entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-active");
            activationObserver.unobserve(entry.target);
          }),
          { threshold: 0.25 },
        );
        root.querySelectorAll<HTMLElement>(".network-section, .process").forEach((element) => activationObserver.observe(element));
        cleanup.push(() => activationObserver.disconnect());
      }

      root.querySelectorAll<HTMLElement>(".servicegrid, .outgrid, .packages").forEach((grid) => {
        Array.from(grid.children).forEach((child, index) => {
          if (child instanceof HTMLElement) child.style.setProperty("--motion-order", String(Math.min(index, 4)));
        });
      });

      const services = root.querySelector<HTMLElement>("#servicegrid");
      if (services && !services.querySelector(":scope > .service-track")) {
        const cards = Array.from(services.children);
        const track = document.createElement("div");
        const primary = document.createElement("div");
        const duplicate = document.createElement("div");
        track.className = "service-track";
        primary.className = "service-set";
        duplicate.className = "service-set";
        duplicate.setAttribute("aria-hidden", "true");
        duplicate.setAttribute("inert", "");
        cards.forEach((card) => {
          card.classList.add("on");
          primary.appendChild(card);
          const clone = card.cloneNode(true) as HTMLElement;
          clone.classList.add("on");
          duplicate.appendChild(clone);
        });
        track.append(primary, duplicate);
        services.classList.add("service-rail");
        services.appendChild(track);
        services.dataset.cardsPerView = "3";
        installRailControls(services, track, services, cards.length, "vertical");
        cleanup.push(() => {
          services.replaceChildren(...Array.from(primary.children));
          services.classList.remove("service-rail");
          delete services.dataset.cardsPerView;
        });
      }

      const tags = root.querySelector<HTMLElement>("#tags");
      if (tags && !tags.querySelector(":scope > .technology-track")) {
        const originalItems = Array.from(tags.children);
        const tracks = Array.from({ length: 3 }, (_, rowIndex) => {
          const track = document.createElement("div");
          const primary = document.createElement("div");
          const duplicate = document.createElement("div");
          const offset = rowIndex * 4;
          track.className = `technology-track technology-row technology-row-${rowIndex + 1}`;
          primary.className = "technology-set";
          duplicate.className = "technology-set";
          duplicate.setAttribute("aria-hidden", "true");
          duplicate.setAttribute("inert", "");
          originalItems.forEach((_, itemIndex) => {
            const source = originalItems[(itemIndex + offset) % originalItems.length];
            const item = rowIndex === 0 ? source : source.cloneNode(true);
            primary.appendChild(item);
            duplicate.appendChild(item.cloneNode(true));
          });
          if (rowIndex > 0) {
            primary.setAttribute("aria-hidden", "true");
            primary.setAttribute("inert", "");
          }
          track.append(primary, duplicate);
          return track;
        });
        tags.classList.add("technology-rail", "technology-wall");
        tags.append(...tracks);
        installRailControls(tags, tracks, tags, originalItems.length);
        cleanup.push(() => {
          tags.replaceChildren(...originalItems);
          tags.classList.remove("technology-rail", "technology-wall");
        });
      }
    };

    const runtime = document.querySelector<HTMLScriptElement>("script[data-abrit-homepage-runtime]");
    const contentReady = () => root.dataset.contentReady === "true" || Boolean(root.querySelector("#servicegrid > *, #packages > *"));
    const onRuntimeReady = () => {
      if (contentReady()) initializeMotion();
    };
    window.addEventListener("abrit:homepage-ready", onRuntimeReady, { once: true });
    runtime?.addEventListener("load", onRuntimeReady, { once: true });

    if (contentReady()) queueMicrotask(initializeMotion);
    else {
      fallbackTimer = window.setTimeout(() => {
        if (disposed || contentReady()) return;
        fallbackRuntime = document.createElement("script");
        fallbackRuntime.src = HOMEPAGE_RUNTIME_URL;
        fallbackRuntime.async = false;
        fallbackRuntime.addEventListener("load", onRuntimeReady, { once: true });
        document.body.appendChild(fallbackRuntime);
      }, 750);
    }

    const aura = auraRef.current;
    const precisePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (aura && precisePointer && !reducedMotion) {
      let pointerX = window.innerWidth / 2;
      let pointerY = window.innerHeight / 2;
      const paintAura = () => {
        pointerFrame = 0;
        aura.style.setProperty("--aura-x", `${pointerX}px`);
        aura.style.setProperty("--aura-y", `${pointerY}px`);
        aura.classList.add("is-visible");
      };
      const onPointerMove = (event: PointerEvent) => {
        pointerX = event.clientX;
        pointerY = event.clientY;
        if (!pointerFrame) pointerFrame = window.requestAnimationFrame(paintAura);
      };
      const onPointerLeave = (event: PointerEvent) => {
        if (!event.relatedTarget) aura.classList.remove("is-visible");
      };
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("pointerout", onPointerLeave, { passive: true });
      cleanup.push(() => {
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerout", onPointerLeave);
      });
    }

    return () => {
      disposed = true;
      if (pointerFrame) window.cancelAnimationFrame(pointerFrame);
      window.clearTimeout(fallbackTimer);
      window.removeEventListener("abrit:homepage-ready", onRuntimeReady);
      runtime?.removeEventListener("load", onRuntimeReady);
      fallbackRuntime?.removeEventListener("load", onRuntimeReady);
      fallbackRuntime?.remove();
      cleanup.reverse().forEach((dispose) => dispose());
      delete root.dataset.motionInitialized;
      delete root.dataset.motionReady;
    };
  }, []);

  return <div ref={auraRef} className="homepage-pointer-aura" aria-hidden="true" />;
}
