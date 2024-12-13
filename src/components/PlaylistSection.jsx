// components/PlaylistSection.js
import React, { useContext } from 'react';
import { SongPlayContext } from '../context/SongPlayContext';
import PlayBar from './PlayBar';
import UserPlaylistsSidebar from './UserPlaylistsSidebar';
import { SongItem } from './SongItem';

const PlaylistSection = () => {
    const { playlist, searchTerm, currentSongIndex, selectedPlaylist } = useContext(SongPlayContext);
    const filteredPlaylist = playlist.filter(song =>
        song.data.name && song.data.name.toLowerCase().includes(searchTerm || "")
    );

    return (
        <div className="playlist-container" style={{ display: 'flex' }}>
            <UserPlaylistsSidebar />
            
            {playlist.length > 0 && (
                <section className="playlist">
                    <h2>Player</h2>
                    <ul className="song-ul">
                        {selectedPlaylist? (
                            selectedPlaylist.map((song, index) => <SongItem song={song} index={index} key={song.id}/>)
                        ) : 
                        (
                            filteredPlaylist.map((song, index) => (<SongItem song={song} index={index} key={song.id}/>
                        )))}
                    </ul>
                    {currentSongIndex !== null && <PlayBar />}
                </section>
            )}
        </div>
    );
};

export default PlaylistSection;

