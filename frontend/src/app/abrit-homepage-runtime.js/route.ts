import { extractReferenceRuntime, readReferenceHomepage } from "@/lib/reference-homepage";

export const dynamic = "force-static";

export async function GET() {
  const runtime = extractReferenceRuntime(await readReferenceHomepage());
  return new Response(`(function(){window.__abritHomepageRuntimeDispose?.();const abritRuntimeToken=Symbol("abrit-homepage-runtime");window.__abritHomepageRuntimeToken=abritRuntimeToken;${runtime}\nwindow.__abritHomepageRuntimeDispose=()=>{clearInterval(timer);if(window.__abritHomepageRuntimeToken===abritRuntimeToken)window.__abritHomepageRuntimeToken=null;};const root=document.querySelector(".reference-homepage");if(root){root.dataset.contentReady="true";window.dispatchEvent(new CustomEvent("abrit:homepage-ready",{detail:{root}}));}})();`, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": "application/javascript; charset=utf-8",
    },
  });
}
