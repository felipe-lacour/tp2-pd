import { createContext, useState, useEffect, useRef, useCallback } from "react";
import { useSongs } from "../customHooks/useSongs";

const SongPlayContext = createContext();

const SongPlayContextProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const newSongs = useSongs();
  const audioRef = useRef(new Audio()); // Audio Ref Global
  const song = currentSongIndex !== null ? playlist[currentSongIndex] : null;

  // Cargar la playlist
  useEffect(() => {
    setPlaylist(newSongs);
  }, [newSongs]);

  // Cambiar canción cuando cambia currentSongIndex
  useEffect(() => {
    if (!song) return;
  
    const audioElement = audioRef.current;
    audioElement.src = song.data.song; // Cambiar la fuente del audio
    audioElement.load(); // Cargar solo al cambiar la canción
  
    const handleLoadedData = () => {
      setDuration(audioElement.duration || 0);
      setCurrentTime(0);
      setProgress(0);
    };
  
    audioElement.addEventListener("loadeddata", handleLoadedData);
  
    return () => {
      audioElement.removeEventListener("loadeddata", handleLoadedData);
    };
  }, [song]);
  
  useEffect(() => {
    const audioElement = audioRef.current;
  
    if (isPlaying) {
      audioElement.play().catch((error) => {
        console.error("Error al reproducir el audio:", error);
      });
    } else {
      audioElement.pause();
    }
  }, [isPlaying]);
  
  const togglePlay = () => {
    const audioElement = audioRef.current;
    if (isPlaying) {
      audioElement.pause(); // Solo pausa el audio
    } else {
      audioElement.play().catch((error) => {
        console.error("Error al reproducir la canción:", error);
      });
    }

    setIsPlaying(!isPlaying); // Actualiza el estado
  };

  // Actualizar tiempo y progreso

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

  const handleSongSelect = (index) => {
    setCurrentSongIndex(index);
    setIsPlaying(true); // Reproduce la canción automáticamente
  };

  const handleNextSong = () => {
    if (!playlist || playlist.length === 0) {
      console.error("La lista de reproducción está vacía.");
      return;
    }
  
    const audioElement = audioRef.current;
  
    // Configurar la nueva fuente y recargar
    setCurrentSongIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % playlist.length;
      return nextIndex;
    });
  
    if (playlist.length > 0) {
      const nextSong = playlist[(currentSongIndex + 1) % playlist.length];
      audioElement.src = nextSong.song;
      audioElement.load();
  
      // Usar el evento loadeddata
      audioElement.addEventListener(
        "loadeddata",
        () => {
          audioElement.play()
            .then(() => {
              console.log("Reproduciendo la siguiente canción.");
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Error al reproducir la canción:", error);
            });
        },
        { once: true } // Ejecutar el evento solo una vez
      );
    }
  };

  const handlePreviousSong = () => {
    if (!playlist || playlist.length === 0) {
      console.error("La lista de reproducción está vacía.");
      return;
    }
  
    const audioElement = audioRef.current;
  
    // Configurar la nueva fuente y recargar
    setCurrentSongIndex((prevIndex) => {
      const nextIndex = (prevIndex - 1) % playlist.length;
      return nextIndex;
    });
  
    if (playlist.length > 0) {
      const nextSong = playlist[(currentSongIndex - 1) % playlist.length];
      audioElement.src = nextSong.song;
      audioElement.load();
  
      // Usar el evento loadeddata
      audioElement.addEventListener(
        "loadeddata",
        () => {
          audioElement.play()
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.error("Error al reproducir la canción:", error);
            });
        },
        { once: true } // Ejecutar el evento solo una vez
      );
    }
  };

  const handleProgressClick = (event) => {
    const progressBar = event.currentTarget;
    const clickPosition = event.nativeEvent.offsetX;
    const progressWidth = progressBar.offsetWidth;
    const newTime = (clickPosition / progressWidth) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
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
    handleSearch,
    song,
    currentTime,
    handleProgressClick,
    progress,
    duration,
    togglePlay,
    isPlaying,
  };

  return (
    <SongPlayContext.Provider value={contextValue}>
      {children}
    </SongPlayContext.Provider>
  );
};

export { SongPlayContext, SongPlayContextProvider };