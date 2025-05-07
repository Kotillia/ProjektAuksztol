import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import GameSlider from './components/GameSlider';
import GameDetails from './components/GameDetails';
import Navbar from './components/Navbar';

function Home() {
    const [games, setGames] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const API_BASE = 'http://localhost:5000/api';

    // ✅ Fetch gier z bazy
    const fetchGames = async () => {
        const res = await fetch(`${API_BASE}/games`);
        const data = await res.json();
        setGames(data);
    };

    // ❌ Poprzednie dodawanie do bazy – NIEUŻYWANE
    /*
    const addGame = async () => {
        if (!newTitle.trim()) return;
        await fetch(`${API_BASE}/games`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle })
        });
        setNewTitle('');
        fetchGames();
    };
    */

    // ✅ Zamiast tego: scraping i alert
    const fetchPrices = async () => {
        if (!newTitle.trim()) return;

        const title = encodeURIComponent(newTitle.trim());

        try {
            const [eneba, g2a, steam, igdb, ig] = await Promise.all([
                fetch(`${API_BASE}/eneba?gameTitle=${title}`).then(res => res.json()),
                fetch(`${API_BASE}/g2a?gameTitle=${title}`).then(res => res.json()),
                fetch(`${API_BASE}/steam?gameTitle=${title}`).then(res => res.json()),
                fetch(`${API_BASE}/igdb?gameTitle=${title}`).then(res => res.json()),
                fetch(`${API_BASE}/instantgaming?gameTitle=${title}`).then(res => res.json())
            ]);

            alert(
                `📊 Wyniki dla "${newTitle}":\n\n` +
                `💰 Eneba: ${eneba.price || 'Brak'}\n` +
                `💰 G2A: ${g2a.price || 'Brak'}\n` +
                `💰 Steam: ${steam.price || 'Brak'}\n` +
                `💰 InstantGaming: ${ig.price || 'Brak'}\n` +
                `⭐ Ocena IGDB: ${igdb.rating || 'Brak'}\n\n` +
                `📝 Opis IGDB:\n${igdb.summary || 'Brak opisu'}`
            );
        } catch (error) {
            console.error('❌ Błąd podczas pobierania danych:', error);
            alert('❌ Wystąpił błąd podczas pobierania danych.');
        }
    };

    const deleteGame = async (id) => {
        await fetch(`${API_BASE}/games/${id}`, { method: 'DELETE' });
        fetchGames();
    };

    useEffect(() => {
        fetchGames();
    }, []);

    return (
        <>
            <Navbar newTitle={newTitle} setNewTitle={setNewTitle} addGame={fetchPrices} />
            <div className="container">
                <GameSlider />
            </div>
            <div className="container">
                <ul className="game-list">
                    {games.map((game) => (
                        <li key={game._id}>
                            <span>{game.title}</span>
                            <button onClick={() => deleteGame(game._id)}>🗑️ Usuń</button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
}

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/game/:id" element={<GameDetails />} />
            </Routes>
        </Router>
    );
}

export default App;
