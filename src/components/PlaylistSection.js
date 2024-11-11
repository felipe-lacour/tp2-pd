import React from 'react';

const PlaylistSection = ({ playlist, onSongSelect, searchTerm }) => {
    const filteredPlaylist = playlist.filter(song =>
        song.name.toLowerCase().includes(searchTerm)
    );

    return (
        <section className="playlist">
            <h2>Player</h2>
            <ul className="song-ul">
                {filteredPlaylist.map((song, index) => (
                    <li key={song.id} className="song" onClick={() => onSongSelect(index)}>
                        <figure>
                            <img src={song.img} alt={song.name} />
                        </figure>
                        <h3>{song.name}</h3>
                    </li>
                ))}
            </ul>
        </section>
    );
};

export default PlaylistSection;

