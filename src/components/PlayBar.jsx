import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import UploadSongs from './UploadSongs';
import { SongPlayContext } from '../context/SongPlayContext';

const formatTime = (seconds) => {
	const minutes = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const PlayBar = () => {
	const { 
		handleNextSong, 
		handlePreviousSong, 
		song, 
		currentTime, 
		handleProgressClick, 
		progress, 
		duration, 
		togglePlay, 
		isPlaying
	} = useContext(SongPlayContext)


	return (
		<div className="barra">
		<img src={song.data.img} alt="Current Song" className="img-barra" />
		<h2>{song.data.name}</h2>
		<span className="current-time">{formatTime(currentTime)}</span>
		<div className="progress-bar" onClick={handleProgressClick}>
			<div className="progress" style={{ width: `${progress}%` }}></div>
		</div>
		<span className="total-duration">{formatTime(duration)}</span>
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