import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header = ({ searchTerm, setSearchTerm }) => {
    const location = useLocation();

    const handleSearch = (event) => {
        setSearchTerm(event.target.value.toLowerCase());
    };

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