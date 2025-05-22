import { db } from "../firebase/config";
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy, arrayUnion, arrayRemove } from "firebase/firestore";

const postsCol = collection(db, "posts");

export const fetchPosts = async () => {
  const q = query(postsCol, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const createPost = async (post) => {
  const postData = {
    ...post,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
  const docRef = await addDoc(postsCol, postData);
  return docRef.id;
};

export const updatePost = async (postId, updatedFields) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    ...updatedFields,
    updatedAt: serverTimestamp(),
  });
};

export const deletePost = async (postId) => {
  const postRef = doc(db, "posts", postId);
  await deleteDoc(postRef);
};

export const likePost = async (postId, userId) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likedBy: arrayUnion(userId),
    likesCount: serverTimestamp(),
  });
};

export const unlikePost = async (postId, userId) => {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likedBy: arrayRemove(userId),
    likesCount: serverTimestamp(),
  });
};
