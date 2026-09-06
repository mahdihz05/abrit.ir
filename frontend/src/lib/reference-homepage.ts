import { readFile } from "node:fs/promises";
import path from "node:path";

const referencePath = path.join(process.cwd(), "..", "abrit-homepage-polished-v5.html");

const localHomepageAssets = [
  ["photo-1522071820081-009f0129c71c", "/media/homepage/team-collaboration.webp"],
  ["photo-1506399558188-acca6f8cbf41", "/media/homepage/infrastructure-console.webp"],
  ["photo-1558494949-ef010cbdcc31", "/media/homepage/managed-it.webp"],
  ["photo-1521737711867-e3b97375f902", "/media/homepage/solutions-team.webp"],
  ["photo-1456324504439-367cee3b3c32", "/media/homepage/knowledge-resources.webp"],
  ["photo-1495020689067-958852a7765e", "/media/homepage/news-media.webp"],
] as const;

function localizeHomepageAssets(source: string) {
  return localHomepageAssets.reduce(
    (result, [photoId, localPath]) => result.replace(
      new RegExp(`https://images\\.unsplash\\.com/${photoId}[^"'\\\\)\\s<]*`, "g"),
      localPath,
    ),
    source,
  );
}

export async function readReferenceHomepage() {
  return readFile(referencePath, "utf8");
}

export function extractReferenceStyle(html: string) {
  const style = html.match(/<style>([\s\S]*?)<\/style>/i)?.[1];
  if (!style) throw new Error("The homepage reference stylesheet could not be parsed.");
  return localizeHomepageAssets(style);
}

export function extractReferenceBody(html: string) {
  const body = html
    .match(/<body[^>]*>([\s\S]*?)<script(?:\s[^>]*)?>/i)?.[1]
    ?.replace('<footer id="contact">', '<footer id="legacy-contact">')
    .replace(/data:image\/png;base64,[A-Za-z0-9+/=]+/g, "/abrit-reference-brand.png")
    .replace(/data:image\/jpeg;base64,[A-Za-z0-9+/=]+/g, "/abrit-reference-globe.jpg");
  if (!body) throw new Error("The homepage reference body could not be parsed.");
  return localizeHomepageAssets(body);
}

export function extractReferenceRuntime(html: string) {
  const script = html.match(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/i)?.[1];
  if (!script) throw new Error("The homepage reference runtime could not be parsed.");

  return localizeHomepageAssets(script)
    .replace(
      'setLang("fa");',
      'setLang(document.querySelector(".reference-homepage")?.dataset.homepageLocale==="ar-ae"?"ar":document.querySelector(".reference-homepage")?.dataset.homepageLocale==="en"?"en":"fa");',
    )
    .replace(
      '$$(".langmenu button").forEach(b=>b.onclick=()=>{setLang(b.dataset.lang);',
      () => '$$(".langmenu button").forEach(b=>b.onclick=()=>{window.location.href={fa:"/fa",en:"/en",ar:"/ar-ae"}[b.dataset.lang];',
    )
    .replace(
      'timer=setInterval(()=>{slide=(slide+1)%2;renderHero(DATA[lang])},7000)',
      'timer=setInterval(()=>{const homepage=document.querySelector(".reference-homepage");const locale=lang==="ar"?"ar-ae":lang;if(window.__abritHomepageRuntimeToken===abritRuntimeToken&&!document.hidden&&homepage?.dataset.homepageLocale===locale&&homepage.querySelector(".hero-shell")?.classList.contains("is-in-view")){slide=(slide+1)%2;renderHero(DATA[lang])}},7000)',
    );
}
