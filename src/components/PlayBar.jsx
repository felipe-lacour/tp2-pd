import React, { useState, useRef, useEffect, useCallback, useContext } from 'react';
import UploadSongs from './UploadSongs';
import { SongPlayContext } from '../context/SongPlayContext';

const formatTime = (seconds) => {
	const minutes = Math.floor(seconds / 60);
	const secs = Math.floor(seconds % 60);
	return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
};

const PlayBar = () => {
	
	const { handleNextSong, handlePreviousSong, playlist, currentSongIndex} = useContext(SongPlayContext)
	let song = currentSongIndex !== null ? playlist[currentSongIndex] : null;
	const [isPlaying, setIsPlaying] = useState(true);
	const [progress, setProgress] = useState(0);
	const audioRef = useRef(new Audio(song.song));
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
console.log(currentSongIndex)
	const handleSongEnd = useCallback(() => {
		handleNextSong();
	}, [handleNextSong]);

	useEffect(() => {
		const audioElement = audioRef.current;

		audioElement.src = song.data.song;
		audioElement.load();
	
		const handlePlay = async () => {
			await audioElement.play();
			setIsPlaying(true);
		};
	
		const handleLoadedData = () => {
			handlePlay();
			setDuration(audioRef.current.duration);
		};

		audioElement.addEventListener('loadeddata', handleLoadedData);

		return () => {
			audioElement.removeEventListener('loadeddata', handleLoadedData);
			audioElement.pause();
		};
	}, [song]);

	useEffect(() => {
		const audioElement = audioRef.current;

		const handleTimeUpdate = () => {
			setCurrentTime(audioElement.currentTime);
			setProgress((audioElement.currentTime / audioElement.duration) * 100);
		};

		audioElement.addEventListener('timeupdate', handleTimeUpdate);
		audioElement.addEventListener('ended', handleSongEnd);

		return () => {
			audioElement.removeEventListener('timeupdate', handleTimeUpdate);
			audioElement.removeEventListener('ended', handleSongEnd);
		};
	}, [handleSongEnd]);

	const togglePlay = () => {
		const audioElement = audioRef.current;
		if (isPlaying) {
		audioElement.pause();
		} else {
		audioElement.play().catch((error) => {
			console.error("Error playing the audio:", error);
		});
		}
		setIsPlaying(!isPlaying);
	};

	const handleProgressClick = (event) => {
		const progressBar = event.currentTarget;
		const clickPosition = event.nativeEvent.offsetX;
		const progressWidth = progressBar.offsetWidth;
		const newTime = (clickPosition / progressWidth) * audioRef.current.duration;
		audioRef.current.currentTime = newTime;
	};

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