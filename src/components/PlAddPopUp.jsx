import { useContext } from "react"
import { v4 as uuidv4 } from 'uuid';
import { PlaylistContext } from "../context/PlaylistContext";

const PlAddPopUp = ({song}) => {
    const {userPlaylists, handleAddToPlayList} = useContext(PlaylistContext)

    return <>
        <ul>
            {userPlaylists.map(item => {
                return <li key={uuidv4()} onClick={(event) => {
                    event.stopPropagation()
                    handleAddToPlayList(song, item)
                }}>{item.data.name}</li>
            })}
        </ul>
    </>
}

export {PlAddPopUp}