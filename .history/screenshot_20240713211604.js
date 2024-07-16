// Import required libraries using ES module syntax
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the current directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to capture a screenshot
const captureScreenshot = async (url, folderPath) => {
  // Launch browser
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // Navigate to the website
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Extract the title of the page
  const title = await page.title();

  // Take screenshot
  const screenshotPath = path.resolve(__dirname, folderPath);
  if (!fs.existsSync(screenshotPath)) {
    fs.mkdirSync(screenshotPath, { recursive: true });
  }

  const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const filePath = path.join(screenshotPath, `${sanitizedTitle}.png`);
  await page.screenshot({ path: filePath });

  console.log(`Screenshot saved at: ${filePath}`);

  // Close the browser
  await browser.close();
};

// URL to capture (replace with the target URL)
const url = 'https://example.com'; // Replace with your target URL

// Specify the folder path within the code
const folderPath = '/path/to/save/folder'; // Replace with your desired folder path

// Run the capture function
captureScreenshot(url, folderPath);
