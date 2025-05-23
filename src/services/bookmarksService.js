import { db } from "../firebase/config";
import { collection, doc, setDoc, deleteDoc, getDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

const bookmarksCollection = collection(db, "postBookmarks");

export const addBookmark = async (postId, userId) => {
  const bookmarkRef = doc(bookmarksCollection, `${postId}_${userId}`);
  await setDoc(bookmarkRef, {
    postId,
    userId,
    createdAt: serverTimestamp(),
  });
};

export const removeBookmark = async (postId, userId) => {
  const bookmarkRef = doc(bookmarksCollection, `${postId}_${userId}`);
  await deleteDoc(bookmarkRef);
};

export const hasUserBookmarked = async (postId, userId) => {
  const bookmarkRef = doc(bookmarksCollection, `${postId}_${userId}`);
  const docSnap = await getDoc(bookmarkRef);
  return docSnap.exists();
};

export const getBookmarksCount = async (postId) => {
  const q = query(bookmarksCollection, where("postId", "==", postId));
  const snapshot = await getDocs(q);
  return snapshot.size;
};
