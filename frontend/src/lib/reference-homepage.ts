import { readFile } from "node:fs/promises";
import path from "node:path";

const referencePath = path.join(process.cwd(), "..", "abrit-homepage-polished-v5.html");

export async function readReferenceHomepage() {
  return readFile(referencePath, "utf8");
}

export function extractReferenceStyle(html: string) {
  const style = html.match(/<style>([\s\S]*?)<\/style>/i)?.[1];
  if (!style) throw new Error("The homepage reference stylesheet could not be parsed.");
  return style;
}

export function extractReferenceBody(html: string) {
  const body = html
    .match(/<body[^>]*>([\s\S]*?)<script(?:\s[^>]*)?>/i)?.[1]
    ?.replace('<footer id="contact">', '<footer id="legacy-contact">')
    .replace(/data:image\/png;base64,[A-Za-z0-9+/=]+/g, "/abrit-reference-brand.png")
    .replace(/data:image\/jpeg;base64,[A-Za-z0-9+/=]+/g, "/abrit-reference-globe.jpg");
  if (!body) throw new Error("The homepage reference body could not be parsed.");
  return body;
}

export function extractReferenceRuntime(html: string) {
  const script = html.match(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/i)?.[1];
  if (!script) throw new Error("The homepage reference runtime could not be parsed.");

  return script
    .replace(
      'setLang("fa");',
      'setLang(document.querySelector(".reference-homepage")?.dataset.homepageLocale==="ar-ae"?"ar":document.querySelector(".reference-homepage")?.dataset.homepageLocale==="en"?"en":"fa");',
    )
    .replace(
      '$$(".langmenu button").forEach(b=>b.onclick=()=>{setLang(b.dataset.lang);',
      () => '$$(".langmenu button").forEach(b=>b.onclick=()=>{window.location.href={fa:"/fa",en:"/en",ar:"/ar-ae"}[b.dataset.lang];',
    )
    .replace('document.documentElement.lang=t.lang;document.documentElement.dir=t.dir;', '')
    .replace(
      'timer=setInterval(()=>{slide=(slide+1)%2;renderHero(DATA[lang])},7000)',
      'timer=setInterval(()=>{const homepage=document.querySelector(".reference-homepage");const locale=lang==="ar"?"ar-ae":lang;if(window.__abritHomepageRuntimeToken===abritRuntimeToken&&!document.hidden&&homepage?.dataset.homepageLocale===locale&&homepage.querySelector(".hero-shell")?.classList.contains("is-in-view")){slide=(slide+1)%2;renderHero(DATA[lang])}},7000)',
    )
    .replace(/function renderHero\(t(?:,anim=true)?\)\{/, (signature) => `${signature}if(document.querySelector(".hero-shell")?.dataset.abritReactOwned==="hero")return;`)
    .replace('$("#servicegrid").innerHTML=t.services.map', 'if(!$("#servicegrid")?.dataset.abritReactOwned)$("#servicegrid").innerHTML=t.services.map')
    .replace('$("#nodes").innerHTML=t.solutions.map', 'if(!$("#nodes")?.dataset.abritReactOwned)$("#nodes").innerHTML=t.solutions.map');
}
