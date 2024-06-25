import express from 'express';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

const app = express();
const port = 3000;

app.get('/scrape', async (req, res) => {
    const url = req.query.url;
    console.log(`Received request to scrape: ${url}`);
    
    if (!url) {
        console.error('No URL provided');
        return res.status(400).json({ error: 'URL is required' });
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    try {
        await page.goto(url);

        const title = await page.title();
        const screenshotPath = 'screenshot.png';
        await page.screenshot({ path: screenshotPath });

        const result = {
            title: title,
            screenshotPath: screenshotPath
        };

        fs.writeFileSync('result.json', JSON.stringify(result, null, 2));
        
        console.log(`Successfully scraped: ${url}`);
        res.json(result);
    } catch (error) {
        console.error('Failed to scrape the website:', error);
        res.status(500).json({ error: 'Failed to scrape the website' });
    } finally {
        await browser.close();
    }
});

app.get('/screenshot.png', (req, res) => {
    res.sendFile(path.resolve('screenshot.png'));
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve('index.html'));
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
