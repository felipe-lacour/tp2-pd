import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import axios from 'axios';
import Header from './components/Header';
import PlaylistSection from './components/PlaylistSection';
import PlayBar from './components/PlayBar';
import About from './pages/About';
import Contact from './pages/Contact';
import Sent from './pages/Sent';

const App = () => {
    const [playlist, setPlaylist] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchSongs = async () => {
            const response = await axios.get('http://localhost:8080/data');
            setPlaylist(response.data.songs);
        };
        fetchSongs();
    }, []);

    const handleSongSelect = (index) => {
        setCurrentSongIndex(index);
    };

    const handleNextSong = () => {
        setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlist.length);
    };

    const handlePreviousSong = () => {
        setCurrentSongIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
    };

    return (
        <Router>
            <Header searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <Routes>
                <Route
                    path="/player"
                    element={
                        <PlaylistSection
                            playlist={playlist}
                            onSongSelect={handleSongSelect}
                            searchTerm={searchTerm}
                        />
                    }
                />
                <Route path="/" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/Sent" element={<Sent />} />
            </Routes>
            {currentSongIndex !== null && (
                <PlayBar
                    song={playlist[currentSongIndex]}
                    onNext={handleNextSong}
                    onPrev={handlePreviousSong}
                />
            )}
        </Router>
    );
};

export default App;
