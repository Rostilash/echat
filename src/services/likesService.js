import { db } from "../firebase/config";
import { collection, query, where, setDoc, deleteDoc, getDoc, getDocs, serverTimestamp, doc } from "firebase/firestore";

// post like actions
const likesCollection = collection(db, "postLikes");

export const addLike = async (postId, userId) => {
  const likeRef = doc(db, "postLikes", `${postId}_${userId}`);
  await setDoc(likeRef, {
    postId,
    userId,
    createdAt: serverTimestamp(),
  });
};

export const removeLike = async (postId, userId) => {
  const likeRef = doc(db, "postLikes", `${postId}_${userId}`);
  await deleteDoc(likeRef);
};

export const hasUserLiked = async (postId, userId) => {
  const likeRef = doc(db, "postLikes", `${postId}_${userId}`);
  const docSnap = await getDoc(likeRef);
  return docSnap.exists();
};

export const getLikesCount = async (postId) => {
  const q = query(collection(db, "postLikes"), where("postId", "==", postId));
  const snapshot = await getDocs(q);
  return snapshot.size;
};
