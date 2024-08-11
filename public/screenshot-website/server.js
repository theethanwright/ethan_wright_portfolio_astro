// Import required libraries
import express from 'express';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());
const PORT = 4000;

const captureScreenshot = async (url, folderPath) => {
    let browser;
    try {
        browser = await puppeteer.launch();
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

        return { filePath, title };
    } catch (error) {
        throw new Error(`Failed to capture screenshot for ${url}: ${error.message}`);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

app.post('/screenshot', async (req, res) => {
    const { urls } = req.body;
    if (!urls || !Array.isArray(urls) || urls.length === 0) {
        return res.status(400).json({ message: 'No URLs provided' });
    }

    const folderPath = 'screenshots';
    const results = [];

    for (const url of urls) {
        try {
            const { filePath, title } = await captureScreenshot(url, folderPath);
            results.push({ url, filePath, title });
        } catch (error) {
            results.push({ url, error: error.message });
        }
    }

    res.json(results);
});

const categoryToFilePath = {
    'Archive': '/Users/ethanwright/Code_Projects/Website/ethan_wright_portfolio_astro/src/components/ResourceGridArchive.astro',
    'Books': '/Users/ethanwright/Code_Projects/Website/ethan_wright_portfolio_astro/src/components/ResourceGridBooks.astro',
    'Colors': '/Users/ethanwright/Code_Projects/Website/ethan_wright_portfolio_astro/src/components/ResourceGridColor.astro',
    'Design Agencies': '/Users/ethanwright/Code_Projects/Website/ethan_wright_portfolio_astro/src/components/ResourceGridDA.astro',
    'Design Blogs': '/Users/ethanwright/Code_Projects/Website/ethan_wright_portfolio_astro/src/components/ResourceGridDB.astro',
    'Design Research': '/Users/ethanwright/Code_Projects/Website/ethan_wright_portfolio_astro/src/components/ResourceGridDR.astro',
    'Icons': '/Users/ethanwright/Code_Projects/Website/ethan_wright_portfolio_astro/src/components/ResourceGridIcons.astro',
    'Imagery': '/Users/ethanwright/Code_Projects/Website/ethan_wright_portfolio_astro/src/components/ResourceGridImagery.astro',
    'Mockups': '/Users/ethanwright/Code_Projects/Website/ethan_wright_portfolio_astro/src/components/ResourceGridMockups.astro',
    'Type': '/Users/ethanwright/Code_Projects/Website/ethan_wright_portfolio_astro/src/components/ResourceGridType.astro',
    'Web & UI': '/Users/ethanwright/Code_Projects/Website/ethan_wright_portfolio_astro/src/components/ResourceGridWUI.astro',
};

app.post('/save-code', (req, res) => {
    const { code, category } = req.body; // Destructure 'code' and 'category' from the request body

    const pathToRemove = '/Users/ethanwright/Code_Projects/Website/ethan_wright_portfolio_astro/public/';
    
    // Remove the specified path part from the code
    const cleanCode = code.replace(pathToRemove, '');

    const filePath = categoryToFilePath[category];

    if (!filePath) {
        return res.status(400).json({ message: 'Invalid category selected' });
    }

    fs.appendFile(filePath, cleanCode + '\n', (err) => {
        if (err) {
            console.error('Error appending to the file:', err);
            return res.status(500).json({ message: 'Error appending to the file.' });
        }
        res.status(200).json({ message: 'File appended successfully.' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
