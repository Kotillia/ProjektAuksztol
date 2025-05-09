import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import './GameDetails.css';
import { useState, useEffect, useRef } from 'react';

// Pomocnicza funkcja do lokalnej interpretacji daty (bez przesuwania o UTC)
function parseLocalDate(dateStr) {
  const [datePart, timePart] = dateStr.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes, secondsWithMs] = timePart.split(':');
  const [seconds, ms = 0] = secondsWithMs.split('.').map(Number);
  return new Date(year, month - 1, day, Number(hours), Number(minutes), Number(seconds), Number(ms || 0));
}

function GameDetails() {
  const { id } = useParams();
  const [newTitle, setNewTitle] = useState('');
  const [gameTitle, setGameTitle] = useState('');
  const [prices, setPrices] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [showToggle, setShowToggle] = useState(false);

  const descriptionRef = useRef(null);

  const API_BASE = 'http://localhost:5000/api';
  const SQL_API = 'http://localhost:3000/api/sqlgames';

  const MAX_DATA_AGE_SECONDS = 60 * 20;

  useEffect(() => {
    const formattedTitle = id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    setGameTitle(formattedTitle);
    fetchInitialAndMaybeUpdate(formattedTitle);
  }, [id]);

  const fetchInitialAndMaybeUpdate = async (title) => {
    try {
      const res = await fetch(`${SQL_API}/check?name=${encodeURIComponent(title)}`);
      const dbData = await res.json();

      const existsInDb = res.ok && dbData?.NazwaGry;

      if (existsInDb) {
        console.log('✅ Dane z bazy (początkowe):', dbData);
        setPrices({
          eneba: { price: dbData.CenaEneba },
          steam: { price: dbData.CenaSteam, headerImage: dbData.Obrazek },
          igdb: { rating: dbData.OcenaGry, summary: dbData.Opis },
          ig: {}
        });

        setTimeout(() => {
          if (descriptionRef.current) {
            const shouldCollapse = descriptionRef.current.scrollHeight > 260;
            setShowToggle(shouldCollapse);
          }
        }, 0);
      } else {
        console.log('🆕 Gra nie istnieje w bazie – zostanie dodana po scrapowaniu');
      }

      const teraz = new Date();
      const aktualizacja = dbData?.DataAktualizacji
        ? parseLocalDate(dbData.DataAktualizacji)
        : null;

      const diffSec = aktualizacja
        ? Math.abs((teraz.getTime() - aktualizacja.getTime()) / 1000)
        : null;

      if (aktualizacja) {
        console.log(`🧪 DataAktualizacji RAW z bazy: ${dbData.DataAktualizacji}`);
        console.log(`📅 DataAktualizacji zinterpretowana lokalnie: ${aktualizacja.toLocaleString()}`);
        console.log(`🕒 Teraz lokalnie: ${teraz.toLocaleString()}`);
        console.log(`⏱️ Różnica czasu (abs): ${diffSec} sekund`);
        console.log(`📊 MAX_DATA_AGE_SECONDS: ${MAX_DATA_AGE_SECONDS}`);
      }

      const isStale = !aktualizacja || diffSec > MAX_DATA_AGE_SECONDS;

      console.log(`📉 Czy dane są przestarzałe? ${isStale}`);

      if (!isStale) {
        console.log('✅ Dane są aktualne – nie trzeba scrapować');
        return;
      }

      console.log('🔄 Dane nieaktualne – rozpoczynam scrapowanie...');

      let eneba = {}, steam = {}, igdb = {}, ig = {};
      try {
        const [enebaRes, steamRes, igdbRes, igRes] = await Promise.all([
          fetch(`${API_BASE}/eneba?gameTitle=${encodeURIComponent(title)}`),
          fetch(`${API_BASE}/steam?gameTitle=${encodeURIComponent(title)}`),
          fetch(`${API_BASE}/igdb?gameTitle=${encodeURIComponent(title)}`),
          fetch(`${API_BASE}/instantgaming?gameTitle=${encodeURIComponent(title)}`)
        ]);

        eneba = await enebaRes.json();
        steam = await steamRes.json();
        igdb = await igdbRes.json();
        ig = await igRes.json();
      } catch (scrapeErr) {
        console.warn('⚠️ Błąd podczas scrapowania danych:', scrapeErr);
      }

      console.log('✅ Dane ze scrapingu:', { eneba, steam, igdb, ig });

      const payload = {
        NazwaGry: title,
        CenaEneba: eneba?.price || '',
        CenaSteam: steam?.price || '',
        Obrazek: steam?.headerImage || '',
        OcenaGry: igdb?.rating || '',
        Opis: igdb?.summary || ''
      };

      const endpoint = existsInDb ? '/update' : '/dodaj-jezeli-nie-ma';

      const saveRes = await fetch(`${SQL_API}${endpoint}`, {
        method: existsInDb ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const saveResult = await saveRes.json();
      console.log(`📦 Odpowiedź serwera (${endpoint}):`, saveResult);

      setPrices({ eneba, steam, igdb, ig });

      setTimeout(() => {
        if (descriptionRef.current) {
          const shouldCollapse = descriptionRef.current.scrollHeight > 260;
          setShowToggle(shouldCollapse);
        }
      }, 0);
    } catch (err) {
      console.error('❌ Błąd podczas pobierania danych:', err);
    }
  };

  const searchGame = () => {
    if (!newTitle.trim()) return;
    const normalized = newTitle.trim().replace(/\s+/g, '-');
    window.location.href = `/game/${normalized}`;
  };

  return (
    <>
      <Navbar newTitle={newTitle} setNewTitle={setNewTitle} addGame={searchGame} />
      <div className="details-wrapper">
        <div className="details-layout">
          <h2 className="game-title">Szczegóły gry: {gameTitle}</h2>
          <div className="top-section">
            <div className="left-panel">
              <img
                src={prices?.steam?.headerImage || `/${id}.jpg`}
                alt={gameTitle}
                className="game-poster"
              />
              <div
                ref={descriptionRef}
                className={`description-block info-block ${!expanded ? 'collapsed' : ''}`}
              >
                <h3>Opis gry:</h3>
                <p>{prices?.igdb?.summary || 'Brak opisu'}</p>
                {showToggle && (
                  <div className="show-more-button" onClick={() => setExpanded(!expanded)}>
                    {expanded ? 'Zwiń' : 'Pokaż więcej'}
                  </div>
                )}
              </div>
            </div>
            <div className="right-panel">
              <div className="info-block">
                <h3>Oceny graczy:</h3>
                <p>{prices?.igdb?.rating ? `${prices.igdb.rating}/100` : 'Brak oceny'}</p>
              </div>
              <div className="info-block">
                <h3>Ceny w sklepach:</h3>
                <p><strong>Steam:</strong> {prices?.steam?.price || 'Brak'}</p>
                <p><strong>Eneba:</strong> {prices?.eneba?.price || 'Brak'}</p>
                <p><strong>Instant Gaming:</strong> {prices?.ig?.price || 'Brak'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default GameDetails;
