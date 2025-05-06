import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar({ newTitle, setNewTitle, addGame }) {
    return (
        <header className="navbar">
            <div className="navbar-left">
                <Link to="/" className="logo-link">
                    <h1>Game Price <br />Tracker</h1>
                </Link>
            </div>

            {newTitle !== undefined && setNewTitle && addGame && (
                <div className="navbar-center">
                    <div className="search-bar">
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            placeholder="Wpisz tytuł gry..."
                        />
                        <button onClick={addGame}>🔍</button>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Navbar;
