import { createContext, useState, useRef, useEffect, useContext } from "react";
import { SongPlayContext } from "./SongPlayContext";
import { PlaylistContext } from "./PlaylistContext";
import { SharedContext } from "./SharedContext";

const PlayerContext = createContext();

const PlayerContextProvider = ({children}) => {
  const { selectedPlaylist, currentSongIndex, setCurrentSongIndex, audioRef, playlist } = useContext(SharedContext)
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audioElement = audioRef.current;
    if (isPlaying) {
      audioElement.play().catch((error) => {
        console.error("Error al reproducir el adio:", error);
      });
    } else {
      audioElement.pause();
    }
  }, [isPlaying]);

  useEffect(() => {
    const audioElement = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
      setProgress((audioElement.currentTime / audioElement.duration) * 100 || 0);
    };

    const handleEnded = () => {
      handleNextSong();
    };

    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("ended", handleEnded);

    return () => {
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNextSong = () => {
    console.log('handleNextSong', selectedPlaylist)
    const playlistAux = (selectedPlaylist && selectedPlaylist.data.songs.length > 0) ? selectedPlaylist.data.songs : playlist;

    console.log(playlistAux)
    
    if (!Array.isArray(playlistAux) || playlistAux.length === 0) {
        console.warn("La playlist está vacía o no es un array.");
        setIsPlaying(false);
        return;
    }

    setCurrentSongIndex((prevIndex) => {
      // Si prevIndex es null, comienza desde 0
      if (prevIndex === null) {
        return 0;
      }
      const nextIndex = (prevIndex + 1) % playlistAux.length;
      return nextIndex;
    });

    setIsPlaying(true);
  };

  const handlePreviousSong = () => {
    const playlistAux = (selectedPlaylist && selectedPlaylist.data.songs.length > 0) ? selectedPlaylist.data.songs : playlist;

    if (!Array.isArray(playlistAux) || playlistAux.length === 0) {
      return;
    }

    setCurrentSongIndex((prevIndex) => {
      if (prevIndex === null) {
        return playlistAux.length - 1;
      }
      const prevIndexNormalized = (prevIndex - 1 + playlistAux.length) % playlistAux.length;
      return prevIndexNormalized;
    });
    setIsPlaying(true);
  };

  const handleSongSelect = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true);
  };

  const handleProgressClick = (event) => {
    const progressBar = event.currentTarget;
    const clickPosition = event.nativeEvent.offsetX;
    const progressWidth = progressBar.offsetWidth;
    const newTime = (clickPosition / progressWidth) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const value = {
    // Estados
    isPlaying,
    currentTime,
    progress,
    duration,
    currentSongIndex,
  
    // Referencias
    audioRef,
  
    // Funciones
    setDuration,
    setCurrentTime,
    setProgress,
    togglePlay,
    handleNextSong,
    handlePreviousSong,
    handleSongSelect,
    handleProgressClick,
    formatTime,
    setCurrentSongIndex
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  )
}

export { PlayerContext, PlayerContextProvider };