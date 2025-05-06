import { useParams } from 'react-router-dom';
import Navbar from './Navbar';
import './GameDetails.css';
import { useState } from 'react';

function GameDetails() {
    const { id } = useParams();
    const [newTitle, setNewTitle] = useState('');

    const searchGame = () => {
        if (!newTitle.trim()) return;
        console.log("Wyszukiwanie:", newTitle);
        setNewTitle('');
    };

    return (
        <>
            <Navbar newTitle={newTitle} setNewTitle={setNewTitle} addGame={searchGame} />

            <div className="details-layout">
                <div className="left-panel">
                    <img src={`/${id}.jpg`} alt={id} className="game-poster" />
                </div>

                <div className="right-panel">
                    <h2 className="game-title">Szczegóły gry: {id}</h2>

                    <div className="info-block">
                        <h3>Oceny graczy:</h3>
                        <p>Brak ocen jeszcze</p>
                    </div>

                    <div className="info-block">
                        <h3>Ceny w sklepach:</h3>
                        <p><strong>Steam:</strong> 129,99 zł</p>
                        <p><strong>Epic Games:</strong> 124,99 zł</p>
                        <p><strong>GOG:</strong> 119,00 zł</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default GameDetails;
