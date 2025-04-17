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
  getSteamPrice
} = require('../controllers/gamesController');

// Endpointy:
router.get('/', getGames);
router.post('/', addGame);
router.delete('/:id', deleteGame);

// Nowy endpoint do pobierania ceny z Eneba
// Wywołanie: GET /api/eneba?gameTitle=Cyberpunk%202077
router.get('/eneba', getEnebaPrice);
router.get('/g2a', getG2APrice);
router.get('/steam', getSteamPrice);

module.exports = router;