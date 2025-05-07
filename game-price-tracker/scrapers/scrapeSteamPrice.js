const axios = require('axios');

async function scrapeSteamPrice(gameTitle) {
  try {
    // 1. Szukamy AppID
    const searchUrl = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(gameTitle)}&cc=pl&l=polish`;
    const searchRes = await axios.get(searchUrl);
    const game = searchRes.data.items[0];

    if (!game) return null;

    const appId = game.id;

    // 2. Pobieramy szczegóły gry
    const detailUrl = `https://store.steampowered.com/api/appdetails?appids=${appId}&cc=pl&l=polish`;
    const detailRes = await axios.get(detailUrl);
    const gameData = detailRes.data[appId].data;

    if (!gameData || !gameData.price_overview) return null;

    return {
      title: gameData.name,
      price: gameData.price_overview.final_formatted,
      headerImage: gameData.header_image
    };
  } catch (err) {
    console.error('❌ Błąd scrapera Steam:', err.message);
    return null;
  }
}

module.exports = { scrapeSteamPrice };
