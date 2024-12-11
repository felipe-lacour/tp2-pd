import './App.css';
import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import PlaylistSection from './components/PlaylistSection';
import About from './pages/About';
import Contact from './pages/Contact';
import Sent from './pages/Sent';
import { SongPlayContext, SongPlayContextProvider } from './context/SongPlayContext';

const App = () => {
    return (
        <SongPlayContextProvider>
            <Router>
                <Header />
                <Routes>
                    <Route path="/player" element={<PlaylistSection/>} />
                    <Route path="/" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/Sent" element={<Sent />} />
                </Routes>
            </Router>
        </SongPlayContextProvider>
    );
};

export default App;
