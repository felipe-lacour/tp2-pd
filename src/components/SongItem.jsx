import { useContext, useEffect, useRef } from "react";
import { SongPlayContext } from "../context/SongPlayContext";
import { PlAddPopUp } from "./PlAddPopUp";
import {AddRemoveButton } from "./AddRemoveButton";
import { PlaylistContext } from "../context/PlaylistContext";
import { PlayerContext } from "../context/PlayerContext";
import { SharedContext } from "../context/SharedContext";
import { UserContext } from "../context/UserContext";

const SongItem = ({ song, index }) => {
    const {user} = useContext(UserContext)
    const {selectedPlaylist} = useContext(SharedContext)
    const { handleDeleteFromPlaylist,} = useContext(PlaylistContext)
    const {  setActivePopup, activePopup } = useContext(SongPlayContext);
    const { handleSongSelect, } = useContext(PlayerContext)
    const popupRef = useRef(null);

    // Manejar clics fuera del componente
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setActivePopup(null); // Cerrar el popup
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [setActivePopup]);

    const togglePopup = () => {
        if (activePopup === song.id) {
            setActivePopup(null); // Cierra el popup si está abierto
        } else {
            setActivePopup(song.id); // Abre el popup actual
        }
    };

    return (
        <li className="song" onClick={() => handleSongSelect(index)}>
            <figure>
                <img src={song.data.img} alt={song.data.name} />
            </figure>
            <h3>{song.data.name}</h3>
            <div className="song-buttons">
                {user ? !selectedPlaylist ? (
                    <AddRemoveButton handle={togglePopup} interior="+" />
                ) : (
                    <>
                        <AddRemoveButton handle={togglePopup} interior="+" />
                        <AddRemoveButton handle={() => handleDeleteFromPlaylist(song)} interior="-" />
                    </>
                ) : "" }

            </div>
            {activePopup === song.id && (
                <div ref={popupRef} className="song-popup">
                    <PlAddPopUp song={song} />
                </div>
            )}
        </li>
    );
};

export { SongItem };