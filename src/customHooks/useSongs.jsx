import { useState, useEffect } from "react"
import { getFirestore, collection, getDocs } from 'firebase/firestore';

export function useSongs (){
  const [songs, setSongs] = useState([]);
  useEffect(() => {
    const db = getFirestore();

    const refCollection = collection(db, 'songs');
    getDocs(refCollection).then(snapshot => {
      if (snapshot.size === 0) console.log('No songs found');
      else {
        const newSongs = snapshot.docs.map(doc => {
          return { id: doc.id, data: doc.data()};
        })
        setSongs(newSongs);
      }
    })
  }, []);
  return songs;
}