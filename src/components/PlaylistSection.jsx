import React, { useContext } from 'react';
import { SongPlayContext } from '../context/SongPlayContext';
import PlayBar from './PlayBar';

const PlaylistSection = () => {
    const {playlist, handleSongSelect, searchTerm, currentSongIndex} = useContext(SongPlayContext);
    const filteredPlaylist = playlist.filter(song =>
        song.name && song.name.toLowerCase().includes(searchTerm || "")
    );
    return (
        playlist.length ? (
            <section className="playlist">
            <h2>Player</h2>
            <ul className="song-ul">
                {playlist.map((song, index) => (
                    <li key={song.id} className="song" onClick={() => handleSongSelect(index)}>
                        <figure>
                            <img src={song.data.img} alt={song.data.name} />
                        </figure>
                        <h3>{song.data.name}</h3>
                    </li>
                ))}
            </ul>
            {currentSongIndex !== null ? <PlayBar/> : ''}
            
        </section>
        ) : ('')

    );
};

export default PlaylistSection;

