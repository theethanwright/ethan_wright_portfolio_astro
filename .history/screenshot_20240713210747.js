// Import required libraries
import express from 'express';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
app.use(express.json());
const PORT = 3000;

// Function to capture a screenshot
const captureScreenshot = async (url, folderPath) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const title = await page.title();
    const screenshotPath = path.resolve(__dirname, folderPath);
    if (!fs.existsSync(screenshotPath)) {
        fs.mkdirSync(screenshotPath, { recursive: true });
    }

    const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const filePath = path.join(screenshotPath, `${sanitizedTitle}.png`);
    await page.screenshot({ path: filePath });

    await browser.close();
    return filePath;
};

// Endpoint to handle screenshot requests
app.post('/screenshot', async (req, res) => {
    const { urls } = req.body;
    const folderPath = 'screenshots';
    const results = [];

    for (const url of urls) {
        try {
            const filePath = await captureScreenshot(url, folderPath);
            results.push({ url, filePath });
        } catch (error) {
            results.push({ url, error: error.message });
        }
    }

    res.json(results);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
