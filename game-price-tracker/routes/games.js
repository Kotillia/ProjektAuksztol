// routes/games.js
const express = require('express');
const router = express.Router();

// Importujemy wszystkie kontrolery z jednego miejsca
const {
  getGames,
  addGame,
  deleteGame,
  getEnebaPrice,
  getG2APrice,
  getSteamPrice,
  getIGDBGameData
} = require('../controllers/gamesController');

// Endpointy:
router.get('/', getGames);
router.post('/', addGame);
router.delete('/:id', deleteGame);


router.get('/eneba', getEnebaPrice);
router.get('/g2a', getG2APrice);
router.get('/steam', getSteamPrice);
router.get('/igdb', getIGDBGameData);

module.exports = router;