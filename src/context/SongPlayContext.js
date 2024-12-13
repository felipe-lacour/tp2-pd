import { createContext, useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "./UserContext";
import { useSongs } from "../customHooks/useSongs";
import { usePlaylists } from "../customHooks/usePlaylists";
import { getFirestore, collection, addDoc, doc, getDoc, getDocs, query, where, documentId, updateDoc, arrayUnion } from "firebase/firestore";

const SongPlayContext = createContext();

const SongPlayContextProvider = ({ children }) => {
  const { user } = useContext(UserContext);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState([]); // Nunca null
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const newSongs = useSongs(); 
  const audioRef = useRef(new Audio());
  const [userPlaylists, setUserPlaylists] = useState(null);
  const [isLoadingPlaylists, setIsLoadingPlaylist] = useState(true);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [playlistName, setPlaylistName] = useState(null)
  const newUserPlaylists = usePlaylists(user?.id);

  const songSet = () => {
    const playlistAux = (selectedPlaylist && selectedPlaylist.length > 0) ? selectedPlaylist : playlist;

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

  useEffect(() => {
    if (newUserPlaylists === null) {
      setIsLoadingPlaylist(true);
    } else {
      setUserPlaylists(newUserPlaylists);
      console.log('User Playlists', userPlaylists)
      setIsLoadingPlaylist(false);
    }
  }, [newUserPlaylists]);

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

  useEffect(() => {
    const audioElement = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
      setProgress((audioElement.currentTime / audioElement.duration) * 100 || 0);
    };

    const handleEnded = () => {
      // Antes de cambiar la canción, verifica playlist
      console.log("Canción terminada. Playlist actual:", playlist, "Selected:", selectedPlaylist);
      handleNextSong();
    };

    audioElement.addEventListener("timeupdate", handleTimeUpdate);
    audioElement.addEventListener("ended", handleEnded);

    return () => {
      audioElement.removeEventListener("timeupdate", handleTimeUpdate);
      audioElement.removeEventListener("ended", handleEnded);
    };
  }, [playlist, selectedPlaylist]);

  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleNextSong = () => {
    const playlistAux = (selectedPlaylist && selectedPlaylist.length > 0) ? selectedPlaylist : playlist;
    
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
    const playlistAux = (selectedPlaylist && selectedPlaylist.length > 0) ? selectedPlaylist : playlist;

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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const createPlaylist = async (name) => {
    if (!user || !name) return;
    const db = getFirestore();
    const refCollection = collection(db, "playlists");
    await addDoc(refCollection, {
      user_id: user.id,
      name: name,
      songs: []
    });
  };

  const handlePlaylistSelect = async (playlist) => {
    if (playlist === null) {
      setPlaylistName(null);
      setSelectedPlaylist(null);
      return;
    }
    setPlaylistName(playlist.data.name);
    try {
      setCurrentSongIndex(null);
      audioRef.current.pause();
      const db = getFirestore();
  
      const playlistRef = doc(db, "playlists", playlist.id);
      const playlistSnap = await getDoc(playlistRef);
  
      if (!playlistSnap.exists()) {
        console.warn(`Playlist with ID ${playlist.id} does not exist.`);
        setSelectedPlaylist([]);
        return;
      }
  
      const playlistData = playlistSnap.data();
      const songs = playlistData.songs || [];
  
      if (songs.length === 0) {
        console.warn(`Playlist with ID ${playlist.id} has no songs.`);
        setSelectedPlaylist([]);
        return;
      }
  
      // Como ahora cada canción ya contiene { id, data: { ... } },
      // simplemente seteamos la playlist sin consultas adicionales.
      setSelectedPlaylist(songs);
  
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
      setSelectedPlaylist([]);
    }
  };

  const handleAddToPlayList = async (songId, item) => {
    if (userPlaylists === null) {
      console.error('No hay ninguna playlist.');
      return;
    }

    if (!item.data.songs.find(sId => sId === songId.id)) {
      const db = getFirestore();
      const docRef = doc(db, 'playlists', item.id);

      try {
        await updateDoc(docRef, {
          songs: arrayUnion(songId),
        });
        alert('Canción agregada a la playlist con éxito.');
      } catch (error) {
        console.error('Error al agregar la canción a la playlist:', error);
      }
    } else {
      alert('La canción ya está en la playlist.');
    }
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
    formatTime,
    createPlaylist,
    userPlaylists,
    isLoadingPlaylists,
    selectedPlaylist,
    handlePlaylistSelect,
    handleAddToPlayList,
    playlistName
  };

  return (
    <SongPlayContext.Provider value={contextValue}>
      {children}
    </SongPlayContext.Provider>
  );
};

export { SongPlayContext, SongPlayContextProvider };