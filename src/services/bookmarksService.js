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
  try {
    const response = await fetch(`https://yts.mx/api/v2/movie_details.json?movie_id=${movieId}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();

    if (!text) {
      throw new Error("Empty response from server");
    }

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      throw new Error("Failed to parse JSON: " + e.message);
    }

    if (!data || !data.data || !data.data.movie) {
      throw new Error("Unexpected response structure");
    }

    return data.data.movie;
  } catch (error) {
    console.error("fetchMovieDetails error:", error);
    // Можна тут повернути null або кинути далі
    throw error;
  }
};
