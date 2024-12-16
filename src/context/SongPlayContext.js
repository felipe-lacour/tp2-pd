import { createContext, useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "./UserContext";
import { useSongs } from "../customHooks/useSongs";
import { PlaylistContext } from "./PlaylistContext";
import { PlayerContext } from "./PlayerContext";
import { SharedContext } from "./SharedContext";

const SongPlayContext = createContext();

const SongPlayContextProvider = ({ children }) => {
  const {setDuration, setCurrentTime, setProgress, isPlaying, handleSongSelect, handleProgressClick} = useContext(PlayerContext)
  const {playlist, setPlaylist, selectedPlaylist, currentSongIndex, audioRef, activePopup, setActivePopup} = useContext(SharedContext);
  const [searchTerm, setSearchTerm] = useState("");
  const newSongs = useSongs(); 


  const songSet = () => {
    const playlistAux = (selectedPlaylist && selectedPlaylist.data.songs.length > 0) ? selectedPlaylist.data.songs : playlist;
    if (
      currentSongIndex !== null &&
      Array.isArray(playlistAux) && 
      playlistAux.length > 0 && 
      playlistAux[currentSongIndex]
    ) {
      return playlistAux[currentSongIndex];
    }

    return null;
  };

  const song = songSet();

  // Actualiza playlist solo si newSongs es válido (array con datos)
  useEffect(() => {
    if (Array.isArray(newSongs) && newSongs.length > 0) {
      setPlaylist(newSongs);
    }
  }, [newSongs]);

  useEffect(() => {
    if (!song) return;
    const audioElement = audioRef.current;
    audioElement.src = song.data.song;
    audioElement.load();

    const handleLoadedData = () => {
      setDuration(audioElement.duration || 0);
      setCurrentTime(audioElement.currentTime || 0);
      setProgress((audioElement.currentTime / audioElement.duration) * 100 || 0);

      if (isPlaying) {
        audioElement.play().catch((error) => {
          console.error("Error al reproducir el audio tras load:", error);
        });
      }
    };
  
    audioElement.addEventListener("loadeddata",handleLoadedData);
  
    return () => {
      audioElement.removeEventListener("loadeddta", handleLoadedData);
    };
    // eslint-disable-next-line
  }, [song]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const contextValue = {
    playlist,
    searchTerm,
    handleSongSelect,
    handleSearch,
    song,
    handleProgressClick,
    activePopup,
    setActivePopup
  };

  return (
    <SongPlayContext.Provider value={contextValue}>
      {children}
    </SongPlayContext.Provider>
  );
};

export { SongPlayContext, SongPlayContextProvider };