from argparse import ArgumentParser
from pathlib import Path
import json
import os
from playwright.sync_api import sync_playwright

parser = ArgumentParser()
parser.add_argument("--base", required=True)
parser.add_argument("--output", required=True)
args = parser.parse_args()

output = Path(args.output).resolve()
output.mkdir(parents=True, exist_ok=True)

locales = ["fa", "en", "ar-ae"]
services = ["managed-it", "digital-workspace", "network-security", "identity-access", "backup-recovery", "monitoring", "erp-automation", "business-telephony", "remote-management", "it-automation"]
solutions = ["integrated-it-management", "it-outsourcing", "security-continuity", "branch-management", "digital-workplace", "process-automation"]
independent = ["backup", "cloud-storage", "workspace", "voice"]
base_paths = ["", "services", "solutions", "independent-services", "products", "pricing", "knowledge", "news", "about", "contact"]
paths = [f"/{locale}/{path}".rstrip("/") or f"/{locale}" for locale in locales for path in base_paths]
paths += [f"/{locale}/services/{slug}" for locale in locales for slug in services]
paths += [f"/{locale}/solutions/{slug}" for locale in locales for slug in solutions]
paths += [f"/{locale}/independent-services/{slug}" for locale in locales for slug in independent]

representative = {
    "home-fa": "/fa",
    "home-en": "/en",
    "services-fa": "/fa/services",
    "service-fa": "/fa/services/managed-it",
    "solution-fa": "/fa/solutions/integrated-it-management",
    "independent-fa": "/fa/independent-services",
    "independent-detail-fa": "/fa/independent-services/backup",
    "products-fa": "/fa/products",
    "pricing-fa": "/fa/pricing",
    "about-fa": "/fa/about",
    "contact-fa": "/fa/contact",
}

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, executable_path=os.environ["PLAYWRIGHT_BROWSER_PATH"])
    page = browser.new_page(viewport={"width": 1440, "height": 1000}, device_scale_factor=1)
    report = []
    for route in paths:
        response = page.goto(f"{args.base}{route}", wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(50)
        report.append({
            "path": route,
            "status": response.status if response else 0,
            "title": page.title(),
            "h1": page.locator("h1").first.text_content() if page.locator("h1").count() else "",
            "description": page.locator('meta[name="description"]').get_attribute("content") if page.locator('meta[name="description"]').count() else "",
            "canonical": page.locator('link[rel="canonical"]').get_attribute("href") if page.locator('link[rel="canonical"]').count() else "",
            "textLength": len(page.locator("body").inner_text()),
            "links": page.locator("a").count(),
            "forms": page.locator("form").count(),
        })
    for name, route in representative.items():
        page.goto(f"{args.base}{route}", wait_until="domcontentloaded", timeout=30000)
        page.wait_for_timeout(1200)
        page.screenshot(path=str(output / f"{name}.png"), full_page=True)
    mobile = browser.new_page(viewport={"width": 390, "height": 844}, device_scale_factor=1)
    for name, route in {"home-fa-mobile": "/fa", "products-fa-mobile": "/fa/products", "independent-fa-mobile": "/fa/independent-services"}.items():
        mobile.goto(f"{args.base}{route}", wait_until="domcontentloaded", timeout=30000)
        mobile.wait_for_timeout(1200)
        mobile.screenshot(path=str(output / f"{name}.png"), full_page=True)
    browser.close()

(output / "routes.json").write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding="utf-8")
print(json.dumps({"routes": len(report), "non200": [item["path"] for item in report if item["status"] != 200]}, ensure_ascii=False))
