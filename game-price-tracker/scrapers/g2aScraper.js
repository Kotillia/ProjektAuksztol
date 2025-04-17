const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

puppeteer.use(StealthPlugin());

async function scrapeG2APrice(gameTitle) {
  const searchUrl = `https://www.g2a.com/search?query=${encodeURIComponent(gameTitle)}`;

  const browser = await puppeteer.launch({
    headless: false,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();


  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
  );

  await page.setExtraHTTPHeaders({
    'accept-language': 'en-US,en;q=0.9',
  });
  await page.goto(searchUrl, { waitUntil: 'networkidle2' });
await page.waitForTimeout(2000);
await page.mouse.move(100, 100);
await page.mouse.click(100, 100);
await page.waitForTimeout(1000);
await page.keyboard.press('PageDown');
await page.waitForTimeout(3000);



  try {
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    // Czekamy na pojawienie się kontenerów z ofertami
    await page.waitForSelector('li.indexes__StyledProductCard-wklrsw-107.lmXBiM'); // kontener z kartą gry

    const offers = await page.$$eval('li.indexes__StyledProductCard-wklrsw-107.lmXBiM', cards => {
      return cards.map(card => {
        const title = card.querySelector('h3.line-clamp-1.text-3xl')?.textContent?.trim();
        const price = card.querySelector('div.font-bold.text-foreground.text-price-2xl')?.textContent?.trim();
        return { title, price };
        
      }).filter(el => el.title && el.price);
    });

    

    // Sortujemy ceny i wybieramy najtańszą
    const sorted = offers
      .map(o => ({
        ...o,
        priceValue: parseFloat(o.price.replace(',', '.').replace(/[^\d.]/g, '')),
      }))
      .sort((a, b) => a.priceValue - b.priceValue);

    await browser.close();
    
    return sorted.length > 0 ? { title: sorted[0].title, price: sorted[0].price } : null;

  } catch (err) {
    await browser.close();
    console.error('❌ Błąd scrapera G2A:', err.message);
    return null;
  }
}

module.exports = { scrapeG2APrice };