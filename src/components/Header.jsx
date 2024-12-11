import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SongPlayContext } from '../context/SongPlayContext';

const Header = () => {
    const {handleSearch, searchTerm} = useContext(SongPlayContext);
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
                </nav>
            </div>
        </header>
    );
};

export default Header;