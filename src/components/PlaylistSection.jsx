// components/PlaylistSection.js
import React, { useContext } from 'react';
import { SongPlayContext } from '../context/SongPlayContext';
import PlayBar from './PlayBar';
import UserPlaylistsSidebar from './UserPlaylistsSidebar';
import { SongItem } from './SongItem';
import { PlaylistContext } from '../context/PlaylistContext';
import { SharedContext } from '../context/SharedContext';

const PlaylistSection = () => {
    const {currentSongIndex, selectedPlaylist, playlist} = useContext(SharedContext);
    const {searchTerm} = useContext(SongPlayContext);
    const {playlistName} = useContext(PlaylistContext)
    const filteredPlaylist = playlist?.filter(song =>
        song.data.name && song.data.name.toLowerCase().includes(searchTerm || "")
    );

    return (
        <div className="playlist-container">
            <UserPlaylistsSidebar />
            
            {playlist?.length > 0 && (
                <section className="playlist">
                    <h2>{playlistName !== null ? playlistName : "Home"}</h2>
                    <ul className="song-ul">
                        {selectedPlaylist? (
                            selectedPlaylist.data.songs.map((song, index) => {
                                return <SongItem
                                            key={song.id}
                                            song={song}
                                            index={index}
                                        />
                            })
                        ) : 
                        (
                            filteredPlaylist.map((song, index) => {
                                return  <SongItem
                                            key={song.id}
                                            song={song}
                                            index={index}
                                        />
                            }))}
                    </ul>
                    {currentSongIndex !== null && <PlayBar />}
                </section>
            )}
        </div>
    );
};

export default PlaylistSection;

