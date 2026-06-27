import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:3000")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'عرض كل المنتجات ←' (View all products) link on the homepage to open the products/catalog page.
        # عرض كل المنتجات ← link
        elem = page.get_by_role('link', name='عرض كل المنتجات ←', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'الأعشاب الطبية' category link to apply the herbs category filter and observe whether the product list updates to show matching items.
        # 🌿 الأعشاب الطبية link
        elem = page.get_by_text('المكملات الغذائية', exact=True).locator("xpath=ancestor-or-self::*[.//a][1]").get_by_role('link', name='🌿 الأعشاب الطبية', exact=True)
        await elem.click(timeout=10000)
        
        # -> Scroll down the products page and look for visible product cards or product list items to verify that the 'الأعشاب الطبية' category displays matching products.
        await page.mouse.wheel(0, 300)
        
        # --> Assertions to verify final state
        
        # --> Verify products matching the selected category are displayed
        # Assert: The product 'أعشاب الزنجبيل' is displayed in the filtered results.
        await expect(page.locator("xpath=/html/body/div[2]/main/div/div/div[2]/div[2]/div[2]/div[4]/div[3]/a").nth(0)).to_have_text("\u0623\u0639\u0634\u0627\u0628 \u0627\u0644\u0632\u0646\u062c\u0628\u064a\u0644", timeout=15000), "The product '\u0623\u0639\u0634\u0627\u0628 \u0627\u0644\u0632\u0646\u062c\u0628\u064a\u0644' is displayed in the filtered results."
        # Assert: The product 'أعشاب الكركديه' is displayed in the filtered results.
        await expect(page.locator("xpath=/html/body/div[2]/main/div/div/div[2]/div[2]/div[2]/div[5]/div[3]/a").nth(0)).to_have_text("\u0623\u0639\u0634\u0627\u0628 \u0627\u0644\u0643\u0631\u0643\u062f\u064a\u0647", timeout=15000), "The product '\u0623\u0639\u0634\u0627\u0628 \u0627\u0644\u0643\u0631\u0643\u062f\u064a\u0647' is displayed in the filtered results."
        # Assert: The product 'أعشاب المريمية' is displayed in the filtered results.
        await expect(page.locator("xpath=/html/body/div[2]/main/div/div/div[2]/div[2]/div[2]/div[10]/div[3]/a").nth(0)).to_have_text("\u0623\u0639\u0634\u0627\u0628 \u0627\u0644\u0645\u0631\u064a\u0645\u064a\u0629", timeout=15000), "The product '\u0623\u0639\u0634\u0627\u0628 \u0627\u0644\u0645\u0631\u064a\u0645\u064a\u0629' is displayed in the filtered results."
        
        # --> Verify the filtered catalog remains visible
        await page.locator("xpath=/html/body/div[2]/main/div/div/div[2]/div[1]/div[2]/div/div[5]/button[1]").nth(0).scroll_into_view_if_needed()
        # Assert: The filters sidebar's "تطبيق الفلاتر" button is visible, confirming the filters panel is shown.
        await expect(page.locator("xpath=/html/body/div[2]/main/div/div/div[2]/div[1]/div[2]/div/div[5]/button[1]").nth(0)).to_be_visible(timeout=15000), "The filters sidebar's \"\u062a\u0637\u0628\u064a\u0642 \u0627\u0644\u0641\u0644\u0627\u062a\u0631\" button is visible, confirming the filters panel is shown."
        await page.locator("xpath=/html/body/div[2]/main/div/div/div[2]/div[2]/div[2]/div[1]/a/div/img").nth(0).scroll_into_view_if_needed()
        # Assert: A product item (image for "أعشاب اليانسون") is visible, confirming the filtered catalog (product grid) is displayed.
        await expect(page.locator("xpath=/html/body/div[2]/main/div/div/div[2]/div[2]/div[2]/div[1]/a/div/img").nth(0)).to_be_visible(timeout=15000), "A product item (image for \"\u0623\u0639\u0634\u0627\u0628 \u0627\u0644\u064a\u0627\u0646\u0633\u0648\u0646\") is visible, confirming the filtered catalog (product grid) is displayed."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    