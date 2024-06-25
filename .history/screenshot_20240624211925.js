const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    // URL to capture
    const url = 'https://example.com'; // Replace with the target URL

    // Launch browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate to the website
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Extract the title of the page
    const title = await page.title();

    // Take screenshot
    const screenshotPath = path.join(__dirname, 'screenshots');
    if (!fs.existsSync(screenshotPath)) {
        fs.mkdirSync(screenshotPath);
    }

    const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filePath = path.join(screenshotPath, `${sanitizedTitle}.png`);
    await page.screenshot({ path: filePath });

    console.log(`Screenshot saved at: ${filePath}`);

    // Close the browser
    await browser.close();
})();
