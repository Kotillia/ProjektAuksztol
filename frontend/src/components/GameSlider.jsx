import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // 👈 DODANE
import './GameSlider.css';

const images = [
    '/Placeholder1.jpg',
    '/Placeholder2.jpg',
    '/Placeholder3.jpg',
    '/Placeholder4.jpg',
    '/Placeholder5.jpg'
];

function GameSlider() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState('right');
    const [animationClass, setAnimationClass] = useState('');
    const navigate = useNavigate(); // 👈 DODANE

    useEffect(() => {
        const interval = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleNext = () => {
        setDirection('right');
        setAnimationClass('slide-in-right');
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const handlePrev = () => {
        setDirection('left');
        setAnimationClass('slide-in-left');
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    const handleImageClick = () => {
        const filename = images[currentIndex].split('/').pop().split('.')[0]; // np. Placeholder3
        navigate(`/game/${filename}`);
    };

    const left = (currentIndex - 1 + images.length) % images.length;
    const right = (currentIndex + 1) % images.length;

    return (
        <div className="slider-wrapper">
            <div className="carousel">
                <button className="arrow-button left" onClick={handlePrev}>❮</button>

                <img src={images[left]} alt="Lewy" className="image image-prev" />

                <img
                    key={currentIndex}
                    src={images[currentIndex]}
                    alt="Aktualny"
                    className={`image image-current ${animationClass}`}
                    onClick={handleImageClick} // 👈 DODANE
                    onAnimationEnd={() => setAnimationClass('')}
                    style={{ cursor: 'pointer' }} // 👈 DODANE
                />

                <img src={images[right]} alt="Prawy" className="image image-next" />

                <button className="arrow-button right" onClick={handleNext}>❯</button>
            </div>
        </div>
    );
}

export default GameSlider;
