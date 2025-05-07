import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import './GameDetails.css';
import { useState, useEffect } from 'react';

function GameDetails() {
    const { id } = useParams();
    const [newTitle, setNewTitle] = useState('');
    const [gameTitle, setGameTitle] = useState('');
    const [prices, setPrices] = useState(null);
    const [expanded, setExpanded] = useState(false); // 👈 przycisk rozwiń/zwiń opis

    const API_BASE = 'http://localhost:5000/api';

    useEffect(() => {
        const formattedTitle = id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        setGameTitle(formattedTitle);
        fetchData(formattedTitle);
    }, [id]);

    const fetchData = async (title) => {
        try {
            const enebaRes = await fetch(`${API_BASE}/eneba?gameTitle=${encodeURIComponent(title)}`);
            const steamRes = await fetch(`${API_BASE}/steam?gameTitle=${encodeURIComponent(title)}`);
            const igdbRes = await fetch(`${API_BASE}/igdb?gameTitle=${encodeURIComponent(title)}`);
            const igRes = await fetch(`${API_BASE}/instantgaming?gameTitle=${encodeURIComponent(title)}`);

            // sprawdzamy czy nie ma błędów sieciowych
            if (!enebaRes.ok) console.error('❌ Eneba fetch failed');
            if (!steamRes.ok) console.error('❌ Steam fetch failed');
            if (!igdbRes.ok) console.error('❌ IGDB fetch failed');
            if (!igRes.ok) console.error('❌ InstantGaming fetch failed');

            // parsujemy dane
            const eneba = await enebaRes.json();
            const steam = await steamRes.json();
            const igdb = await igdbRes.json();
            const ig = await igRes.json();

            // logujemy wszystko
            console.log('✅ Eneba:', eneba);
            console.log('✅ Steam:', steam);
            console.log('✅ IGDB:', igdb);
            console.log('✅ InstantGaming:', ig);

            setPrices({ eneba, steam, igdb, ig });
        } catch (err) {
            console.error('Błąd podczas pobierania danych:', err);
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

                            <div className={`description-block info-block ${!expanded ? 'collapsed' : ''}`}>
                                <h3>Opis gry:</h3>
                                <p>{prices?.igdb?.summary || 'Brak opisu'}</p>

                                {!expanded && (
                                    <div className="show-more-button" onClick={() => setExpanded(true)}>
                                        Pokaż więcej
                                    </div>
                                )}

                                {expanded && (
                                    <div className="show-more-button" onClick={() => setExpanded(false)}>
                                        Zwiń
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
