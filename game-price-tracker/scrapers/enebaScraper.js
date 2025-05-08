const puppeteer = require('puppeteer');

function titleMatchesSearch(title, search) {
    const normalize = str => str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return normalize(title).includes(normalize(search));
}

function isProbablyFullGame(title) {
    const lower = title.toLowerCase();
    const banned = ['dlc', 'expansion', 'add-on', 'add on', 'currency', 'coins', 'bundle', 'skin', 'pack', 'pass', 'subscription'];
    return !banned.some(word => lower.includes(word));
}

async function scrapeEnebaPrice(gameTitle) {
    const searchUrl = `https://www.eneba.com/pl/store/all?text=${encodeURIComponent(gameTitle)}`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(searchUrl, { waitUntil: 'networkidle2' });
        await page.waitForSelector('.L5ErLT.wTj8OK', { timeout: 15000 });

        const prices = await page.$$eval('span.L5ErLT.wTj8OK', elements =>
            elements.map(el => el.textContent.trim())
        );
        const titles = await page.$$eval('span.YLosEL', elements =>
            elements.map(el => el.textContent.trim())
        );

        const products = titles.map((title, index) => {
            const rawPrice = prices[index] || '';
            const numericPrice = parseFloat(rawPrice.replace(',', '.').replace(/[^\d.]/g, '')) || Infinity;
            return {
                title,
                rawPrice,
                numericPrice,
                platform: title.includes('PC') ? 'PC' :
                    title.includes('Xbox') ? 'Xbox' :
                        title.includes('PlayStation') ? 'PlayStation' : 'Unknown'
            };
        });

        const filtered = products.filter(p =>
            p.platform === 'PC' &&
            titleMatchesSearch(p.title, gameTitle) &&
            isProbablyFullGame(p.title) &&
            isFinite(p.numericPrice)
        );

        if (filtered.length === 0) return null;

        const cheapest = filtered.reduce((min, p) => p.numericPrice < min.numericPrice ? p : min);

        await browser.close();
        return {
            title: cheapest.title,
            price: cheapest.rawPrice,
            platform: cheapest.platform
        };

    } catch (error) {
        console.error('❌ Błąd scrapera:', error.message);
        await browser.close();
        return null;
    }
}

module.exports = { scrapeEnebaPrice };
