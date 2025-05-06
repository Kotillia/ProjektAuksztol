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

    const fetchGames = async () => {
        const res = await fetch(`${API_BASE}/games`);
        const data = await res.json();
        setGames(data);
    };

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

    const deleteGame = async (id) => {
        await fetch(`${API_BASE}/games/${id}`, { method: 'DELETE' });
        fetchGames();
    };

    useEffect(() => {
        fetchGames();
    }, []);

    return (
        <>
            <Navbar newTitle={newTitle} setNewTitle={setNewTitle} addGame={addGame} />
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
