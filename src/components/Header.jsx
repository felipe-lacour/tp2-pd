import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SongPlayContext } from '../context/SongPlayContext';
import { UserContext } from '../context/UserContext'; // Asegúrate de que esta ruta sea la correcta

const Header = () => {
    const { handleSearch, searchTerm } = useContext(SongPlayContext);
    const { user, handleAuthAction } = useContext(UserContext);
    const location = useLocation();



    return (
        <header className="navbar">
            <h1 className="logo">Sputify</h1>

            <div className="navegamo">        
                {location.pathname === '/player' && (
                    <input
                        type="text"
                        className="search"
                        placeholder="Search..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                )}

                <nav className="nav-links">
                    <Link to="/" className="nav-link">ABOUT</Link>
                    <Link to="/player" className="nav-link">PLAYER</Link>
                    <Link to="/contact" className="nav-link">CONTACT</Link>
                    <button className="nav-link" onClick={handleAuthAction}>
                        {user ? 'LOG OUT' : 'LOG IN'}
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;