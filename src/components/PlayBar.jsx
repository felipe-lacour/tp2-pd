import React, { useContext } from 'react';
import { SongPlayContext } from '../context/SongPlayContext';
import ProgressBar from './ProgressBar';


const PlayBar = () => {
	const { 
		handleNextSong, 
		handlePreviousSong, 
		song, 
		togglePlay, 
		isPlaying
	} = useContext(SongPlayContext)


	return (
		<div className="barra">
		<img src={song.data.img} alt="Current Song" className="img-barra" />
		<h2>{song.data.name}</h2>
		<ProgressBar/>
		<div className="barra-buttons">
			<button className="control-button" onClick={handlePreviousSong}>
				<img src="/res/img/prev.svg" alt="Previous" className="icon" />
			</button>
			
			<button className="control-button" onClick={togglePlay}>
				<img src={isPlaying ? "/res/img/pause.svg" : "/res/img/play.svg"} alt="Play/Pause" className="icon" />
			</button>
			
			<button className="control-button" onClick={handleNextSong}>
				<img src="/res/img/next.svg" alt="Next" className="icon" />
			</button>
		</div>
		</div>
	);
};

export default PlayBar;