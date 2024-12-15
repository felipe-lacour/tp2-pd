import React from "react";
import { collection, addDoc, getFirestore } from "firebase/firestore";


const UploadSongs = () => {
  const data = {
    songs: [
      { id: 1, name: "For Whom the Bell Tolls", img: "/res/img/forwhom.png", song: "/res/audio/fwtbt.mp3" },
      { id: 2, name: "The Four Horsemen", img: "/res/img/killem.png", song: "/res/audio/tfhm.mp3" },
      { id: 3, name: "The Unforgiven", img: "/res/img/black.png", song: "/res/audio/unforgiven.mp3" },
      { id: 4, name: "Happy Together", img: "/res/img/happytogether.png", song: "/res/audio/happy.mp3" },
      { id: 5, name: "Knocking on Heaven's Door", img: "/res/img/knocking.png", song: "/res/audio/knock.mp3" },
      { id: 6, name: "Somewhere Over the Rainbow", img: "/res/img/somewhere.png", song: "/res/audio/rainbow.mp3" },
      { id: 7, name: "Billie Jean", img: "/res/img/billie.png", song: "/res/audio/billie.mp3" },
      { id: 8, name: "Money", img: "/res/img/money.png", song: "/res/audio/money.mp3" },
      { id: 9, name: "Forever Young", img: "/res/img/forever.png", song: "/res/audio/forever.mp3" },
      { id: 10, name: "Comfortably Numb", img: "/res/img/comfort.png", song: "/res/audio/comfort.mp3" },
      { id: 11, name: "Still Loving You", img: "/res/img/still.png", song: "/res/audio/still.mp3" },
      { id: 12, name: "Toxicity", img: "/res/img/toxi.png", song: "/res/audio/toxi.mp3" },
    ]
  };

  const uploadSongs = async () => {
    try {
      const db = getFirestore();
      const songsCollection = collection(db, "songs");
      const uploadPromises = data.songs.map(song => addDoc(songsCollection, song));
      await Promise.all(uploadPromises);
      alert("Canciones subidas exitosamente! 🎉");
    } catch (error) {
      console.error("Error subiendo canciones: ", error);
      alert("Hubo un error al subir las canciones.");
    }
  };

  return (
    <div>
      <button onClick={uploadSongs}>Subir Canciones</button>
    </div>
  );
};

export default UploadSongs;