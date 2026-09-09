from playwright.sync_api import sync_playwright

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    errors = []
    page.on("console", lambda message: errors.append(message.text) if message.type == "error" else None)
    response = page.goto("http://127.0.0.1:3100/fa", wait_until="networkidle")
    assert response and response.status == 200, response.status if response else "no response"
    assert "عملیات فناوری اطلاعات" in page.locator("h1").inner_text()
    assert page.locator("a[href='/fa/contact']").count() >= 1
    assert page.locator("a[href^='/fa/services/']").count() >= 6
    health = page.request.get("http://127.0.0.1:3100/healthz")
    assert health.status == 200
    assert health.json()["status"] == "ok"
    assert not errors, errors
    browser.close()
