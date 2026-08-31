from __future__ import annotations

import json
import os
import sys

from playwright.sync_api import sync_playwright


BASE = "http://127.0.0.1:3100"
PUBLIC_PATHS = [
    "/fa", "/en", "/ar-ae",
    "/fa/services", "/en/solutions", "/ar-ae/products",
    "/fa/pricing", "/en/about", "/fa/contact",
    "/sitemap.xml", "/robots.txt", "/admin",
]


def main() -> None:
    failures: list[str] = []
    console_errors: list[str] = []
    with sync_playwright() as playwright:
        executable = os.environ.get("PLAYWRIGHT_BROWSER_PATH")
        browser = playwright.chromium.launch(headless=True, executable_path=executable)
        page = browser.new_page()
        page.on("console", lambda message: console_errors.append(message.text) if message.type == "error" else None)
        for path in PUBLIC_PATHS:
            response = page.goto(f"{BASE}{path}", wait_until="networkidle")
            status = response.status if response else 0
            if status != 200:
                failures.append(f"GET {path}: {status}")
            if path in {"/fa", "/en", "/ar-ae"} and page.locator("h1").count() != 1:
                failures.append(f"GET {path}: expected exactly one h1")

        api = page.request
        pricing = api.post(f"{BASE}/api/pricing/calculate", data={
            "package": "essential", "term_months": 3, "users": 5, "endpoints": 6,
        })
        if pricing.status != 200:
            failures.append(f"POST /api/pricing/calculate: {pricing.status} {pricing.text()}")
        else:
            result = pricing.json().get("data", {})
            if result.get("contract_total_toman") != 44_159_500:
                failures.append(f"pricing total: {result.get('contract_total_toman')}")

        invalid_form = api.post(f"{BASE}/api/forms/consultation/submissions", data={
            "locale": "fa", "data": {}, "consent_given": False,
        })
        if invalid_form.status != 400:
            failures.append(f"invalid consultation form: {invalid_form.status}")

        valid_form = api.post(f"{BASE}/api/forms/consultation/submissions", data={
            "locale": "fa",
            "data": {
                "full_name": "تست مهاجرت Payload",
                "phone": "09123456789",
                "need_type": "assessment",
                "details": "درخواست آزمایشی برای بررسی برابری فرم پس از مهاجرت.",
            },
            "consent_given": True,
            "source_url": f"{BASE}/fa/contact",
        })
        if valid_form.status != 201:
            failures.append(f"valid consultation form: {valid_form.status} {valid_form.text()}")

        private_file = api.get(f"{BASE}/api/private/submission-files/1")
        if private_file.status != 401:
            failures.append(f"unauthenticated private file: {private_file.status}")
        browser.close()

    ignored_fragments = ["favicon.ico"]
    actionable_console = [message for message in console_errors if not any(fragment in message for fragment in ignored_fragments)]
    if actionable_console:
        failures.extend(f"browser console: {message}" for message in actionable_console)
    print(json.dumps({"checked": len(PUBLIC_PATHS), "console_errors": actionable_console, "failures": failures}, ensure_ascii=False, indent=2))
    raise SystemExit(1 if failures else 0)


if __name__ == "__main__":
    main()
