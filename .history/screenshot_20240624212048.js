// Import required libraries using ES module syntax
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Function to capture a screenshot
const captureScreenshot = async (url) => {
  // Launch browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the website
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Extract the title of the page
  const title = await page.title();

  // Take screenshot
  const screenshotPath = path.join(process.cwd(), 'screenshots');
  if (!fs.existsSync(screenshotPath)) {
    fs.mkdirSync(screenshotPath);
  }

  const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filePath = path.join(screenshotPath, `${sanitizedTitle}.png`);
  await page.screenshot({ path: filePath });

  console.log(`Screenshot saved at: ${filePath}`);

  // Close the browser
  await browser.close();
};

// URL to capture (replace with the target URL)
const url = 'https://example.com';

// Run the capture function
captureScreenshot(url);
