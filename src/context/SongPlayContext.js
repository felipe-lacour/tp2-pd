import { createContext, useState, useEffect, useRef, useContext } from "react";
import { UserContext } from "./UserContext";
import { useSongs } from "../customHooks/useSongs";
import { usePlaylists } from "../customHooks/usePlaylists";
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { 
  doc,
  getDoc,
  getDocs,
  query,
  where,
  documentId ,
  updateDoc,
  arrayUnion
} from "firebase/firestore";

const SongPlayContext = createContext();

const SongPlayContextProvider = ({ children }) => {
  const { user } = useContext(UserContext);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playlist, setPlaylist] = useState([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const newSongs = useSongs();
  const audioRef = useRef(new Audio());
  const [userPlaylists, setUserPlaylists] = useState(null)
  const [isLoadingPlaylists, setIsLoadingPlaylist] = useState(true)
  const [selectedPlaylist, setSelectedPlaylist] = useState(null)
  const newUserPlaylists = usePlaylists(user?.id);

  const songSet = () => {
    if(currentSongIndex !== null){
      if(selectedPlaylist){
        return selectedPlaylist[currentSongIndex]
      } 

      return playlist[currentSongIndex]
    } else return null
  }

  const song = songSet();



  useEffect(() => {
    if (newUserPlaylists === null) {
      setIsLoadingPlaylist(true);
    } else {
      setUserPlaylists(newUserPlaylists);
      setIsLoadingPlaylist(false);
    }
  }, [newUserPlaylists]);

  useEffect(() => {
    setPlaylist(newSongs);
  }, [newSongs]);

  // Cambiar canción cuando cambia currentSongIndex (NOTA: NO agregues `isPlaying` aquí)
  useEffect(() => {
    if (!song) return;
  
    const audioElement = audioRef.current;
    audioElement.src = song.data.song;
    audioElement.load();
  
    const handleLoadedData = () => {
      setDuration(audioElement.duration || 0);
      setCurrentTime(audioElement.currentTime || 0);
      setProgress((audioElement.currentTime / audioElement.duration) * 100 || 0);

      // Si ya estamos en estado "isPlaying", forzamos la reproducción aquí
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
  }, [song]); // <-- Sólo depende de 'song'

  // Controlar reproducción según isPlaying
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
    const playlistAux = selectedPlaylist ? selectedPlaylist : playlist
    setCurrentSongIndex((prevIndex) => (prevIndex + 1) % playlistAux.length);
    setIsPlaying(true);
  };

  const handlePreviousSong = () => {
    const playlistAux = selectedPlaylist ? selectedPlaylist : playlist
    setCurrentSongIndex((prevIndex) => {
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
      songs: [] // inicializamos la playlist sin canciones
    });
  };

  const handlePlaylistSelect = async (playlistId) => {
    if(playlistId === null){
      setSelectedPlaylist(null)
      return;
    }

    try {
      setCurrentSongIndex(null)
      audioRef.current.pause()
      const db = getFirestore();
  
      // Referencia al documento de la playlist
      const playlistRef = doc(db, "playlists", playlistId);
      const playlistSnap = await getDoc(playlistRef);
  
      if (!playlistSnap.exists()) {
        console.warn(`Playlist with ID ${playlistId} does not exist.`);
        return [];
      }
  
      const playlistData = playlistSnap.data();
      const songIds = playlistData.songs || [];
  
      if (songIds.length === 0) {
        console.warn(`Playlist with ID ${playlistId} has no songs.`);
        return [];
      }
  
      // Si hay 10 canciones o menos, consulta directamente
      if (songIds.length <= 10) {
        const q = query(collection(db, "songs"), where(documentId(), "in", songIds));
        const songsSnap = await getDocs(q);
        const allSongs = songsSnap.docs.map(songDoc => ({ id: songDoc.id, data: songDoc.data() }));
        setSelectedPlaylist(allSongs)
        return;
      }
  
      // Para más de 10 canciones, dividir en trozos
      const chunkSize = 10;
      const promises = [];
      for (let i = 0; i < songIds.length; i += chunkSize) {
        const chunk = songIds.slice(i, i + chunkSize);
        if (chunk.length > 0) { // Verificar que el chunk no esté vacío
          const q = query(collection(db, "songs"), where(documentId(), "in", chunk));
          promises.push(getDocs(q));
        }
      }
  
      // Resolver todas las promesas y aplanar los resultados
      const snapshots = await Promise.all(promises);
      const allSongs = snapshots.flatMap(snap =>
        snap.docs.map(songDoc => ({ id: songDoc.id, data:songDoc.data() }))
      );

      setSelectedPlaylist(allSongs)
      return;
    } catch (error) {
      console.error("Error fetching playlist songs:", error);
      return []; // Retornar un array vacío en caso de error
    }
  };

  const handleAddToPlayList = async (songId, item) => {
    if (userPlaylists === null) {
        return console.error('No hay ninguna playlist.');
    }

    console.log(songId);
    console.log(item);

    if (!item.data.songs.find(sId => sId === songId)) { // Verifica que el ID no está ya en la playlist
        const db = getFirestore();
        const docRef = doc(db, 'playlists', item.id); // Referencia al documento de la playlist

        try {
            await updateDoc(docRef, {
                songs: arrayUnion(songId), // Agrega el ID al array `songs` si no existe
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
    handleAddToPlayList
  };

  return (
    <SongPlayContext.Provider value={contextValue}>
      {children}
    </SongPlayContext.Provider>
  );
};

export { SongPlayContext, SongPlayContextProvider };