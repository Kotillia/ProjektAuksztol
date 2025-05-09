import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './GameSlider.css';

function GameSlider() {
    const [games, setGames] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState('right');
    const [animationClass, setAnimationClass] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:3000/api/sqlgames/dane')
            .then(res => res.json())
            .then(data => {
                const filtered = data.filter(g => g.Obrazek); // tylko gry z obrazkiem
                setGames(filtered);
            })
            .catch(err => {
                console.error('❌ Błąd podczas pobierania gier:', err);
            });
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(interval);
    }, [games]);

    const handleNext = () => {
        setDirection('right');
        setAnimationClass('slide-in-right');
        setCurrentIndex(prev => (prev + 1) % games.length);
    };

    const handlePrev = () => {
        setDirection('left');
        setAnimationClass('slide-in-left');
        setCurrentIndex(prev => (prev - 1 + games.length) % games.length);
    };

    const handleImageClick = () => {
        const name = games[currentIndex]?.NazwaGry;
        if (name) {
            const urlName = name.trim().replace(/\s+/g, '-');
            navigate(`/game/${urlName}`);
        }
    };

    if (games.length === 0) return <div>🔄 Wczytywanie gier...</div>;

    const left = (currentIndex - 1 + games.length) % games.length;
    const right = (currentIndex + 1) % games.length;

    return (
        <div className="slider-wrapper">
            <div className="carousel">
                <button className="arrow-button left" onClick={handlePrev}>❮</button>

                <img src={games[left]?.Obrazek} alt="Lewy" className="image image-prev" />

                <img
                    key={currentIndex}
                    src={games[currentIndex]?.Obrazek}
                    alt={games[currentIndex]?.NazwaGry}
                    className={`image image-current ${animationClass}`}
                    onClick={handleImageClick}
                    onAnimationEnd={() => setAnimationClass('')}
                    style={{ cursor: 'pointer' }}
                />

                <img src={games[right]?.Obrazek} alt="Prawy" className="image image-next" />

                <button className="arrow-button right" onClick={handleNext}>❯</button>
            </div>
        </div>
    );
}

export default GameSlider;
