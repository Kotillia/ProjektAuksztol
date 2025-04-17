const puppeteer = require('puppeteer');

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

    // Połącz tytuły i ceny w jeden obiekt
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

    // Filtrowanie np. tylko PC
    const filtered = products.filter(p => p.platform === 'PC' && isFinite(p.numericPrice));

    if (filtered.length === 0) return null;

    // Szukamy najtańszej opcji
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