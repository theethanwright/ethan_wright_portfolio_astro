const express = require('express');
const puppeteer = require('puppeteer');
const cors = require('cors');
const app = express();
const port = 3000;

// Use CORS middleware
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/capture', async (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).send('URL is required');
    }

    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url);
        const screenshot = await page.screenshot({ encoding: 'base64' });
        await browser.close();

        res.status(200).json({ image: `data:image/png;base64,${screenshot}` });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error capturing the screenshot');
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
