const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // Obsługa JSON dla POST/PUT

// 👉 Importujemy router z sqlGames
const sqlGamesRoutes = require('./routes/sqlGames');
app.use('/api/sqlgames', sqlGamesRoutes); // Prefixujemy: /api/sqlgames/check, /api/sqlgames/insert, itd.

// Start serwera
app.listen(port, () => {
  console.log(`✅ Serwer SQL działa na http://localhost:${port}`);
});
