// App.js
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import PlaylistSection from './components/PlaylistSection';
import About from './pages/About';
import Contact from './pages/Contact';
import Sent from './pages/Sent';
import LoginPage from './pages/LoginPage';
import { SongPlayContextProvider } from './context/SongPlayContext';
import { UserContextProvider } from './context/UserContext';

const App = () => {
    return (
        <UserContextProvider>
            <SongPlayContextProvider>
                <Router>
                    <Header />
                    <Routes>
                        <Route path="/player" element={<PlaylistSection />} />
                        <Route path="/" element={<About />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/sent" element={<Sent />} />
                        <Route path="/login" element={<LoginPage />} />
                    </Routes>
                </Router>
            </SongPlayContextProvider>
        </UserContextProvider>
    );
};

export default App;