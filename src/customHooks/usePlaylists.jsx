import { useState, useEffect } from "react";
import { getFirestore, collection, getDocs, query, where } from 'firebase/firestore';

export function usePlaylists(user) {
  const [songs, setSongs] = useState(null);

  useEffect(() => {
    if (!user) return; // Si no hay usuario, no hacemos la consulta

    const db = getFirestore();
    const refCollection = collection(db, 'playlists');

    // Creamos la consulta filtrando por user_id
    const q = query(refCollection, where("user_id", "==", user));

    getDocs(q).then(snapshot => {
      if (snapshot.empty) {
        console.log('No playlists found for this user.');
        setSongs([]);
      } else {
        const newSongs = snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        }));
        setSongs(newSongs);
      }
    }).catch(error => {
      console.error('Error fetching playlists:', error);
    });
  }, [user]);

  return songs;
}