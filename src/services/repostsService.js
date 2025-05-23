import { db } from "../firebase/config";
import { collection, doc, setDoc, deleteDoc, getDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

const repostsCollection = collection(db, "postReposts");

export const addRepost = async (postId, userId) => {
  const repostRef = doc(repostsCollection, `${postId}_${userId}`);
  await setDoc(repostRef, {
    postId,
    userId,
    createdAt: serverTimestamp(),
  });
};

export const removeRepost = async (postId, userId) => {
  const repostRef = doc(repostsCollection, `${postId}_${userId}`);
  await deleteDoc(repostRef);
};

export const hasUserReposted = async (postId, userId) => {
  const repostRef = doc(repostsCollection, `${postId}_${userId}`);
  const docSnap = await getDoc(repostRef);
  return docSnap.exists();
};

export const getRepostsCount = async (postId) => {
  const q = query(repostsCollection, where("postId", "==", postId));
  const snapshot = await getDocs(q);
  return snapshot.size;
};
