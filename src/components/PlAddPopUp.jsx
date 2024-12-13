import { useContext } from "react"
import { SongPlayContext } from "../context/SongPlayContext"

const PlAddPopUp = ({song}) => {
    const {userPlaylists, handleAddToPlayList} = useContext(SongPlayContext)

    return <>
        <ul>
            {userPlaylists.map(item => {
                return <li key={item.id} onClick={(event) => {
                    event.stopPropagation()
                    handleAddToPlayList(song, item)
                }}>{item.data.name}</li>
            })}
        </ul>
    </>
}

export {PlAddPopUp}