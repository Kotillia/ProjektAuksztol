// scrapers/enebaScraper.js
const puppeteer = require('puppeteer');

/**
 * Funkcja, która wyszukuje grę na Eneba i próbuje pobrać jej cenę.
 * @param {string} gameTitle - Tytuł gry, której cenę chcesz pobrać.
 * @returns {Promise<string|null>} - Zwraca tekst ceny lub null, jeśli nie znaleziono.
 */
async function scrapeEnebaPrice(gameTitle) {
  const searchUrl = `https://www.eneba.com/search?text=${encodeURIComponent(gameTitle)}`;
  const browser = await puppeteer.launch({ headless: true }); // headless: true działa w tle, bez UI
  const page = await browser.newPage();

  try {
    // Przejdź do strony wyszukiwania
    await page.goto(searchUrl, { waitUntil: 'networkidle2' });
    
    // Opcjonalnie, można ustawić timeout lub czekać na konkretny selektor
    // await page.waitForSelector('.price-selector'); // zmodyfikuj do realnego selektora

    // Zbierz dane ze strony
    const priceData = await page.evaluate(() => {
      // Upewnij się, że selektor odpowiada strukturze strony Eneba!
      // Możesz np. wyszukać pierwszy element z ceną
      const priceElement = document.querySelector('.styles__BuyContainer-sc-17owr6m-0 span'); 
      return priceElement ? priceElement.innerText.trim() : null;
    });

    await browser.close();
    return priceData;

  } catch (error) {
    console.error('Błąd podczas scrapowania:', error);
    await browser.close();
    return null;
  }
}

module.exports = { scrapeEnebaPrice };

// Testowanie funkcji (opcjonalnie)
// (async () => {
//   const price = await scrapeEnebaPrice('Cyberpunk 2077');
//   console.log('Cena:', price);
// })();
