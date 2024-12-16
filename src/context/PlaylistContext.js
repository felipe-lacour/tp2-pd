import { createContext, useState, useRef, useEffect, useContext } from "react"
import { usePlaylists } from "../customHooks/usePlaylists";
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, arrayUnion, query, where, getDocs } from "firebase/firestore";
import { UserContext } from "./UserContext";
import { SharedContext } from "./SharedContext";

const PlaylistContext = createContext();

const PlaylistContextProvider = ({children}) => {
  const { user } = useContext(UserContext);

  const { setCurrentSongIndex, audioRef, currentSongIndex, setActivePopup} = useContext(SharedContext);
  const {selectedPlaylist, setSelectedPlaylist} = useContext(SharedContext)
  const [userPlaylists, setUserPlaylists] = useState(null);
  const [isLoadingPlaylists, setIsLoadingPlaylist] = useState(true);
  const [playlistName, setPlaylistName] = useState(null)
  const newUserPlaylists = usePlaylists(user?.id);

  useEffect(() => {
    if (newUserPlaylists === null) {
      setIsLoadingPlaylist(true);
    } else {
      setUserPlaylists(newUserPlaylists);
      setIsLoadingPlaylist(false);
    }
  }, [newUserPlaylists, userPlaylists]);

  const createPlaylist = async (name) => {
    if (!user || !name) return;

    const db = getFirestore();
    const refCollection = collection(db, "playlists");

    try {
        // Añadir un nuevo documento a la colección "playlists"
        const docRef = await addDoc(refCollection, {
            user_id: user.id,
            name: name,
            songs: []
        });

        // Obtener todas las playlists del usuario
        const q = query(refCollection, where("user_id", "==", user.id));
        const snapshot = await getDocs(q);

        // Crear un array con todas las playlists y agregar la nueva manualmente
        const playlistsAux = snapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data()
        }));

        // Añadir la nueva playlist manualmente si no se refleja aún
        const newPlaylist = {
            id: docRef.id,
            data: { user_id: user.id, name: name, songs: [] }
        };
        playlistsAux.push(newPlaylist);

        setUserPlaylists(playlistsAux);
    } catch (error) {
        console.error('Error al crear la playlist o actualizar las playlists: ', error);
    }
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

    const currentPlaylist = {
      data: playlistSnap.data(),
      id: playlistSnap.id
    };
    const songs = currentPlaylist.data.songs || [];

    if (songs.length === 0) {
      console.warn(`Playlist with ID ${playlist.id} has no songs.`);
      setSelectedPlaylist(currentPlaylist);
      return;
    }
    setSelectedPlaylist(currentPlaylist);
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
      setActivePopup(null)
      alert('Canción agregada a la playlist con éxito.');
    } catch (error) {
      console.error('Error al agregar la canción a la playlist:', error);
    }
  } else {
    alert('La canción ya está en la playlist.');
  }
};

const handleDeleteFromPlaylist = async (songId) => {
  if (userPlaylists === null) {
      console.error('No hay ninguna playlist.');
      return;
  }

  if (selectedPlaylist !== null) {
      // Verificar si la canción está en la playlist
      const songExists = selectedPlaylist.data.songs.some(s => s.id === songId.id);
      if (!songExists) {
          console.error('La canción no existe en la playlist.');
          return;
      }

      const indexDeletedSong = selectedPlaylist.data.songs.indexOf(s => s.id === songId.id);
      
      const songIsPlaying = currentSongIndex !== null 
          ? selectedPlaylist.data.songs[currentSongIndex]?.id === songId.id
          : false;

      if (songIsPlaying) {
          alert('No puedes eliminar la canción que está sonando actualmente.');
          return;
      }

      // Obtener referencia a la base de datos y documento de la playlist
      const db = getFirestore();
      const docRef = doc(db, 'playlists', selectedPlaylist.id);

      try {
          // Filtrar las canciones eliminando la que coincida con songId
          const updatedSongs = selectedPlaylist.data.songs.filter(s => s.id !== songId.id);

          // Actualizar la playlist en Firestore
          await updateDoc(docRef, {
              'songs': updatedSongs // Actualizamos solo las canciones
          }).then(() => {
            if((currentSongIndex !== null) && (indexDeletedSong < currentSongIndex)){
              setCurrentSongIndex(prev => prev - 1)
            }
            setSelectedPlaylist((prev) => ({
                ...prev,
                data: {
                    ...prev.data,
                    songs: updatedSongs
                }
            }));
          })
          alert(`${songId.data.name} eliminado de ${selectedPlaylist.data.name}`);
      } catch (error) {
          console.error('Error al eliminar la canción de la playlist: ', error);
      }
  } else {
      console.error('No se ha seleccionado ninguna playlist.');
  }
};

const value = {
  // Estados
  userPlaylists,
  isLoadingPlaylists,
  selectedPlaylist,
  playlistName,

  // Funciones
  createPlaylist,
  handlePlaylistSelect,
  handleAddToPlayList,
  handleDeleteFromPlaylist,
};

  return (
    <PlaylistContext.Provider value={value}>
      {children}
    </PlaylistContext.Provider>
  )
}

export { PlaylistContext, PlaylistContextProvider };