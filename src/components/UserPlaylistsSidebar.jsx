// components/UserPlaylistsSidebar.js
import React, { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { SongPlayContext } from '../context/SongPlayContext';

const UserPlaylistsSidebar = () => {
  const { user } = useContext(UserContext);
  const { userPlaylists, createPlaylist, isLoadingPlaylists, handlePlaylistSelect } = useContext(SongPlayContext);

  const [showPopup, setShowPopup] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  if (!user) {
    return null;
  }

  const handleCreatePlaylistClick = () => {
    setShowPopup(true);
  };

  const handleCreate = async () => {
    if (newPlaylistName.trim()) {
      await createPlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
      setShowPopup(false);
    }
  };

  const handleCancel = () => {
    setNewPlaylistName("");
    setShowPopup(false);
  };

  return (
    <aside className="sidebar">
      <h3>Tus Playlists</h3>

      {isLoadingPlaylists ? (
        <p>Cargando...</p>
      ) : userPlaylists && userPlaylists.length > 0 ? (
        <ul>
          <li onClick={() => handlePlaylistSelect(null)}>Home</li>
          {userPlaylists.map((pl) => (
            <li key={pl.id} onClick={() => handlePlaylistSelect(pl)}>{pl.data.name}</li>
          ))}
        </ul>
      ) : (
        <div>
          <p>No tienes ninguna playlist aún.</p>
        </div>
      )}
      <button onClick={handleCreatePlaylistClick}>Crear una nueva playlist</button>
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h4>Crea una nueva playlist</h4>
            <input
              type="text"
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Nombre de la playlist"
            />
            <div className="popup-actions">
              <button onClick={handleCreate}>Crear</button>
              <button onClick={handleCancel}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default UserPlaylistsSidebar;