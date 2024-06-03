const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

let browser;
(async () => {
    browser = await puppeteer.launch();
})();

app.post('/capture', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 }); // Timeout after 30 seconds

        // Extract the title from the meta tags or the document title
        const title = await page.evaluate(() => {
            const metaTitle = document.querySelector('meta[property="og:title"]') || 
                              document.querySelector('meta[name="twitter:title"]') || 
                              document.querySelector('meta[name="title"]');
            return metaTitle ? metaTitle.content : document.title;
        });

        const screenshot = await page.screenshot({ encoding: 'base64' });
        await page.close();

        res.status(200).json({ title, image: `data:image/png;base64,${screenshot}` });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error capturing the screenshot');
    }
});

process.on('exit', async () => {
    if (browser) await browser.close();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
