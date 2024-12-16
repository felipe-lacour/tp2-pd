import { createContext, useState, useRef } from 'react';

const SharedContext = createContext();

const SharedContextProvider = ({ children }) => {
  // Estados compartidos
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [activePopup, setActivePopup] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const audioRef = useRef(new Audio());

  const value = {
    selectedPlaylist,
    setSelectedPlaylist,
    currentSongIndex,
    setCurrentSongIndex,
    audioRef,
    playlist,
    setPlaylist,
    activePopup,
    setActivePopup
  };

  return <SharedContext.Provider value={value}>{children}</SharedContext.Provider>;
};

export { SharedContext, SharedContextProvider };