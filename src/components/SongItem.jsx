import { useContext, useState, useEffect, useRef } from "react";
import { SongPlayContext } from "../context/SongPlayContext";
import { PlAddPopUp } from "./PlAddPopUp";

const SongItem = ({ song, index }) => {
    const { handleSongSelect } = useContext(SongPlayContext);
    const [isAdding, setIsAdding] = useState(false);
    const popupRef = useRef(null); // Referencia al contenedor del popup

    // Manejar clics fuera del componente
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (popupRef.current && !popupRef.current.contains(event.target)) {
                setIsAdding(false); // Cerrar el popup
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <li className="song" onClick={() => handleSongSelect(index)}>
            <figure>
                <img src={song.data.img} alt={song.data.name} />
            </figure>
            <h3>{song.data.name}</h3>
            <button
                onClick={(e) => {
                    e.stopPropagation(); // Evitar que el clic cierre el popup
                    setIsAdding((prev) => !prev);
                }}
            >
                +
            </button>
            {isAdding && (
                <div ref={popupRef}>
                    <PlAddPopUp song={song} />
                </div>
            )}
        </li>
    );
};

export { SongItem };