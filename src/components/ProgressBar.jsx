import { useContext } from "react"
import { SongPlayContext } from "../context/SongPlayContext";
import { PlayerContext } from "../context/PlayerContext";

const ProgressBar = () => {
    const {
        currentTime, 
		handleProgressClick, 
		progress, 
		duration,
        formatTime
    } = useContext(PlayerContext)

    return(
        <>
            <span className="current-time">{formatTime(currentTime)}</span>
            <div className="progress-bar" onClick={handleProgressClick}>
                <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="total-duration">{formatTime(duration)}</span>
        </>
    )
}

export default ProgressBar;