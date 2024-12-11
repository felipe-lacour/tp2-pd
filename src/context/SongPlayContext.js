import { createContext, useState, useEffect } from "react";
import { useSongs } from "../customHooks/useSongs";

const SongPlayContext = createContext();

const SongPlayContextProvider = ({children}) => {
  const [playlist, setPlaylist] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const newSongs = useSongs();

  useEffect(() => {
    setPlaylist(newSongs);
    console.log(playlist)
  }, [newSongs]);

  const handleSongSelect = (index) => {
    setCurrentSongIndex(index);
  };

  const handleNextSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlist.length);
  };

  const handlePreviousSong = () => {
    setCurrentSongIndex((prevIndex) => (prevIndex - 1 + playlist.length) % playlist.length);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };


  const contextValue = {
    playlist,
    currentSongIndex,
    searchTerm,
    handleNextSong,
    handlePreviousSong,
    handleSongSelect,
    handleSearch
  };

  return (
    <SongPlayContext.Provider value={contextValue}>
      {children}
    </SongPlayContext.Provider>
  )
}

export { SongPlayContext, SongPlayContextProvider };