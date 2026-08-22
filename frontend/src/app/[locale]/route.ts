import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const languageKeys = {
  fa: "fa",
  en: "en",
  "ar-ae": "ar",
} as const;

async function readReferenceHome() {
  const referencePath = path.join(process.cwd(), "..", "abrit-homepage-polished-v5.html");
  return readFile(referencePath, "utf8");
}

export async function GET(_request: Request, context: RouteContext<"/[locale]">) {
  const { locale } = await context.params;
  if (!(locale in languageKeys)) {
    return new Response("Not found", { status: 404, headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  const language = languageKeys[locale as keyof typeof languageKeys];
  const reference = await readReferenceHome();
  const alternates = `<link rel="alternate" hreflang="fa" href="/fa"><link rel="alternate" hreflang="en" href="/en"><link rel="alternate" hreflang="ar-AE" href="/ar-ae"><link rel="alternate" hreflang="x-default" href="/fa">`;
  const localeNavigation = `<script>
document.querySelectorAll('.langmenu button').forEach(function(button){
  button.addEventListener('click',function(){
    var routes={fa:'/fa',en:'/en',ar:'/ar-ae'};
    var route=routes[button.dataset.lang];
    if(route) history.replaceState(null,'',route);
  });
});
</script>`;
  const html = reference
    .replace('setLang("fa");', `setLang("${language}");`)
    .replace("</head>", `${alternates}</head>`)
    .replace("</body>", `${localeNavigation}</body>`);

  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-AbrIT-Visual-Reference": "abrit-homepage-polished-v5",
    },
  });
}
