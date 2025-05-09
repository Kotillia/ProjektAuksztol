import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import GameSlider from './components/GameSlider';
import GameDetails from './components/GameDetails';
import Navbar from './components/Navbar';
import { useState } from 'react';

function Home() {
    const [newTitle, setNewTitle] = useState('');

    const handleSearch = () => {
        if (!newTitle.trim()) return;
        const formatted = newTitle.trim().replace(/\s+/g, '-');
        window.location.href = `/game/${formatted}`;
    };

    return (
        <>
            <Navbar newTitle={newTitle} setNewTitle={setNewTitle} addGame={handleSearch} />
            <div className="container">
                <GameSlider />
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
