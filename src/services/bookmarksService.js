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

// For movies pages
export const toggleMovieBookmark = async (movieId, userId) => {
  const bookmarkRef = doc(bookmarksCollection, `${movieId}_${userId}`);
  const docSnap = await getDoc(bookmarkRef);

  if (docSnap.exists()) {
    await deleteDoc(bookmarkRef);
    return false;
  } else {
    await setDoc(bookmarkRef, {
      movieId,
      userId,
      createdAt: serverTimestamp(),
    });
    return true;
  }
};

export const hasUserBookmarkedMovie = async (movieId, userId) => {
  const bookmarkRef = doc(bookmarksCollection, `${movieId}_${userId}`);
  const docSnap = await getDoc(bookmarkRef);
  return docSnap.exists();
};

export const getBookmarkedMovieIds = async (userId) => {
  const q = query(bookmarksCollection, where("userId", "==", userId));

  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data().movieId);
};

export const fetchMovieDetails = async (movieId) => {
  const response = await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${movieId}`);
  const data = await response.json();
  return data.data.movie;
};
