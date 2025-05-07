// controllers/gamesController.js
const Game = require('../models/Game');
const { scrapeEnebaPrice } = require('../scrapers/enebaScraper');
const { scrapeG2APrice } = require('../scrapers/g2aScraper');
const { scrapeSteamPrice } = require('../scrapers/scrapeSteamPrice');
const { getIGDBGameData: fetchIGDBData } = require('../scrapers/scrapeIGDB');
const { scrapeInstantGaming } = require('../scrapers/scrapeInstantGaming');

// Handler do pobierania wszystkich gier
const getGames = async (req, res) => {
  try {
    const games = await Game.find();
    res.json(games);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Handler do dodawania gry
const addGame = async (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ message: 'Title is required' });
  try {
    const newGame = new Game({ title });
    await newGame.save();
    res.status(201).json(newGame);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Handler do usuwania gry
const deleteGame = async (req, res) => {
  try {
    const deleted = await Game.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Game not found' });
    res.json({ message: 'Game deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Handler do pobierania ceny z Eneba (nowa funkcja)
const getEnebaPrice = async (req, res) => {
  const { gameTitle } = req.query;
  if (!gameTitle)
    return res.status(400).json({ message: 'gameTitle query parameter is required' });

  try {
    const result = await scrapeEnebaPrice(gameTitle);
    if (result) {
      res.json(result); // np. { title, price, platform }
    } else {
      res.status(404).json({ message: 'Price not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getG2APrice = async (req, res) => {
  const { gameTitle } = req.query;
  if (!gameTitle) return res.status(400).json({ message: 'gameTitle is required' });

  try {
    const result = await scrapeG2APrice(gameTitle);
    if (result) {
      res.json({ gameTitle, ...result });
    } else {
      res.status(404).json({ message: 'Price not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSteamPrice = async (req, res) => {
  const { gameTitle } = req.query;
  if (!gameTitle)
    return res.status(400).json({ message: 'gameTitle query parameter is required' });

  try {
    const result = await scrapeSteamPrice(gameTitle);
    if (result) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'Game not found or price unavailable' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getIGDBGameData = async (req, res) => {
  const { gameTitle } = req.query;

  if (!gameTitle) {
    return res.status(400).json({ message: 'gameTitle is required' });
  }
  
  try {
    const game = await fetchIGDBData(gameTitle);
    if (game && game.rating && game.summary) {
      res.json({
        summary: game.summary,
        rating: Math.round(game.rating * 100) / 100
      });
    } else {
      res.status(404).json({ message: 'Game summary or rating not found' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getInstantGamingPrice = async (req, res) => {
  const { gameTitle } = req.query;
  if (!gameTitle) {
    return res.status(400).json({ message: 'gameTitle query parameter is required' });
  }

  try {
    const data = await scrapeInstantGaming(gameTitle);
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ message: 'Game not found on Instant Gaming' });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getGames, addGame, deleteGame, getEnebaPrice, getG2APrice, getSteamPrice, getIGDBGameData, getInstantGamingPrice };



