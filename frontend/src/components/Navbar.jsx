import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

function Navbar({ newTitle, setNewTitle, addGame }) {
    const navigate = useNavigate();

    const handleSearch = () => {
        if (!newTitle.trim()) return;
        const id = newTitle.trim().replace(/\s+/g, '-'); // np. "Call of Duty" → "Call-of-Duty"
        navigate(`/game/${id}`);
        setNewTitle(''); // wyczyść pole po wyszukaniu
    };

    return (
        <header className="navbar">
            <div className="navbar-left">
                <Link to="/" className="logo-link">
                    <h1>Game Price <br />Tracker</h1>
                </Link>
            </div>

            {newTitle !== undefined && setNewTitle && (
                <div className="navbar-center">
                    <div className="search-bar">
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Wpisz tytuł gry..."
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSearch();
                            }}
                        />
                        <button onClick={handleSearch}>🔍</button>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;
