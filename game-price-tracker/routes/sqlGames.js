const express = require('express');
const sql = require('mssql');

const router = express.Router();

const config = {
  user: 'sa',
  password: '123',
  server: 'localhost',
  database: 'GamePriceTracker',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

// Pobieranie wszystkich danych
router.get('/dane', async (req, res) => {
  try {
    await sql.connect(config);
    const result = await sql.query('SELECT * FROM Gry');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Błąd podczas pobierania danych:', err);
    res.status(500).send('Błąd połączenia lub zapytania do bazy danych');
  }
});

// Sprawdzanie gry po nazwie (ignorujemy wielkość liter)
router.get('/check', async (req, res) => {
  const gameName = req.query.name;
  if (!gameName) {
    return res.status(400).json({ message: 'Brakuje parametru "name"' });
  }

  try {
    await sql.connect(config);
    const request = new sql.Request();
    request.input('gameName', sql.VarChar, gameName.trim().toLowerCase());

    const result = await request.query(`
      SELECT TOP 1 * FROM Gry WHERE LOWER(LTRIM(RTRIM(NazwaGry))) = @gameName
    `);

    if (result.recordset.length === 0) {
      return res.status(200).json({});
    }

    const game = result.recordset[0];
    res.json({
      ...game,
      DataAktualizacji: game.DataAktualizacji?.toISOString()
    });
  } catch (err) {
    console.error('❌ Błąd podczas sprawdzania gry:', err);
    res.status(500).json({ message: 'Błąd połączenia z bazą danych' });
  }
});

// Dodawanie gry, jeśli nie istnieje
router.post('/dodaj-jezeli-nie-ma', async (req, res) => {
  const { NazwaGry, CenaEneba, CenaSteam, Obrazek, OcenaGry, Opis } = req.body;

  if (!NazwaGry) {
    return res.status(400).json({ message: 'Pole NazwaGry jest wymagane' });
  }

  try {
    await sql.connect(config);
    const trimmedName = NazwaGry.trim().toLowerCase();
    const check = await sql.query`
      SELECT * FROM Gry WHERE LOWER(LTRIM(RTRIM(NazwaGry))) = ${trimmedName}
    `;

    if (check.recordset.length > 0) {
      console.log(`ℹ️ Gra "${NazwaGry}" już istnieje w bazie – nie dodano`);
      return res.status(200).json({ message: 'Gra już istnieje w bazie danych' });
    }

    await sql.query`
      INSERT INTO Gry (NazwaGry, CenaEneba, CenaSteam, Obrazek, OcenaGry, Opis, DataAktualizacji)
      VALUES (${NazwaGry}, ${CenaEneba}, ${CenaSteam}, ${Obrazek}, ${OcenaGry}, ${Opis}, GETDATE())
    `;

    console.log(`✅ Dodano nową grę do bazy: ${NazwaGry}`);
    res.status(201).json({ message: 'Gra została dodana do bazy danych' });
  } catch (err) {
    console.error('❌ Błąd podczas dodawania gry:', err);
    res.status(500).json({ message: 'Błąd zapisu do bazy danych' });
  }
});

// Aktualizacja gry (ignorując wielkość liter)
router.put('/update', async (req, res) => {
  const { NazwaGry, CenaEneba, CenaSteam, Obrazek, OcenaGry, Opis } = req.body;

  if (!NazwaGry) {
    return res.status(400).json({ message: 'Pole NazwaGry jest wymagane' });
  }

  try {
    await sql.connect(config);
    const trimmedName = NazwaGry.trim().toLowerCase();
    const result = await sql.query`
      UPDATE Gry
      SET CenaEneba = ${CenaEneba}, CenaSteam = ${CenaSteam},
          Obrazek = ${Obrazek}, OcenaGry = ${OcenaGry},
          Opis = ${Opis}, DataAktualizacji = GETDATE()
      WHERE LOWER(LTRIM(RTRIM(NazwaGry))) = ${trimmedName}
    `;

    console.log(`🔁 Zaktualizowano ${result.rowsAffected[0]} rekord(ów) dla "${NazwaGry}"`);
    res.status(200).json({ message: 'Gra zaktualizowana pomyślnie' });
  } catch (err) {
    console.error('❌ Błąd przy aktualizacji gry:', err);
    res.status(500).json({ message: 'Błąd aktualizacji danych' });
  }
});

module.exports = router;
