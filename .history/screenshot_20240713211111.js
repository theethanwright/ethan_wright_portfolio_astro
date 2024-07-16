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
  const filePath = path.join(screenshotPath, ${sanitizedTitle}.png);
  await page.screenshot({ path: filePath });

  console.log(Screenshot saved at: ${filePath});

  // Close the browser
  await browser.close();
};

// Get command-line arguments for URL and folder path
const [,, url, folderPath = 'screenshots'] = process.argv;

// Check if URL is provided
if (!url) {
  console.error('Please provide a URL as the first argument.');
  process.exit(1);
}

// Run the capture function
captureScreenshot(url, folderPath);