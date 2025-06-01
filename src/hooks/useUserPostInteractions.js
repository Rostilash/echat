import { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

export const useUserPostInteractions = ({ collectionName, userId }) => {
  const [postIds, setPostIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserPostIds = async () => {
      if (!userId || !collectionName) return;
      setLoading(true);

      try {
        const ref = collection(db, collectionName);
        const q = query(ref, where("userId", "==", userId));
        const snapshot = await getDocs(q);
        const ids = snapshot.docs.map((doc) => doc.data().postId);
        setPostIds(ids);
      } catch (error) {
        console.error(`Помилка при завантаженні з ${collectionName}:`, error);
        setPostIds([]);
      } finally {
        setLoading(false);
      }
    };

    loadUserPostIds();
  }, [userId, collectionName]);

  return { postIds, loading };
};
