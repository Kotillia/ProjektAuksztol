// controllers/gamesController.js
const Game = require('../models/Game');
const { scrapeEnebaPrice } = require('../scrapers/enebaScraper');

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

module.exports = { getGames, addGame, deleteGame, getEnebaPrice };
