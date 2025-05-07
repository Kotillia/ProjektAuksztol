const puppeteer = require('puppeteer');

function detectPlatform(title) {
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('steam') || lowerTitle.includes('pc')) return 'PC';
  if (lowerTitle.includes('xbox')) return 'Xbox';
  if (lowerTitle.includes('playstation') || lowerTitle.includes('ps4') || lowerTitle.includes('ps5')) return 'PlayStation';
  if (lowerTitle.includes('switch')) return 'Nintendo Switch';
  return 'Unknown';
}

function titleMatchesSearch(title, search) {
  const normalize = str => str.toLowerCase().replace(/[^a-z0-9]/gi, '');
  return normalize(title).includes(normalize(search));
}

function isProbablyFullGame(title) {
  const lower = title.toLowerCase();
  const banned = ['dlc', 'expansion', 'add-on', 'add on', 'currency', 'coins', 'bundle', 'skin', 'pack', 'pass', 'subscription'];
  return !banned.some(badWord => lower.includes(badWord));
}

async function scrapeInstantGaming(gameTitle) {
  const url = `https://www.instant-gaming.com/en/search/?q=${encodeURIComponent(gameTitle)}`;
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('.item');

    const games = await page.$$eval('.item', items => {
      return items.map(item => {
        const title = item.querySelector('.title')?.textContent.trim();
        const price = item.querySelector('.price')?.textContent.trim();
        return { title, price };
      });
    });

    const filteredGames = games
      .filter(game =>
        game.title &&
        game.price &&
        !game.price.includes('%') &&
        isProbablyFullGame(game.title) &&
        titleMatchesSearch(game.title, gameTitle)
      )
      .map(game => ({
        ...game,
        platform: detectPlatform(game.title)
      }))
      .sort((a, b) => a.numericPrice - b.numericPrice);

    await browser.close();

    return filteredGames[0] || null;
  } catch (error) {
    console.error('❌ Błąd scrapera Instant Gaming:', error.message);
    await browser.close();
    return null;
  }
}

module.exports = { scrapeInstantGaming };
