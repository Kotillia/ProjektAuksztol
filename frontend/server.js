const express = require('express');
const cors = require('cors'); // Dodajemy CORS
const sql = require('mssql'); // Jeżeli używasz SQL Server

const app = express();
const port = 3000;

// Włączamy CORS w całym serwerze
app.use(cors());

// Konfiguracja połączenia z bazą danych
const config = {
  user: 'sa',
  password: '123',
  server: 'localhost', // lub adres twojego serwera bazy danych
  database: 'GamePriceTracker',
  options: {
    encrypt: true, // Jeśli masz połączenie szyfrowane (dla Azure)
    trustServerCertificate: true, // Możesz ustawić na 'true' jeśli masz problemy z certyfikatami
  },
};

// Endpoint do pobierania danych z bazy
app.get('/api/dane', (req, res) => {
  sql.connect(config, err => {
    if (err) {
      console.error('Błąd połączenia z bazą danych:', err);
      return res.status(500).send('Błąd połączenia z bazą danych');
    }

    const request = new sql.Request();
    request.query('SELECT * FROM gry', (err, result) => {
      
      if (err) {
        console.error('Błąd zapytania do bazy danych:', err);
        return res.status(500).send('Błąd zapytania do bazy danych');
      }
      res.json(result.recordset); // Zwracamy dane jako JSON
    });
  });
});

// Uruchomienie serwera
app.listen(port, () => {
  console.log(`Serwer działa na http://localhost:${port}`);
});
