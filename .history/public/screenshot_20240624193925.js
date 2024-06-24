

const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://example.com'); // Replace with your desired URL
    const screenshot = await page.screenshot({ encoding: 'base64' });
    await browser.close();
})();
