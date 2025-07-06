// hooks/useLobbyGames.js
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../../../../../firebase/config";

export const useLobbyGames = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "monogames"), where("status", "==", "waiting"));

    const unsub = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setGames(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  return { games, loading };
};
