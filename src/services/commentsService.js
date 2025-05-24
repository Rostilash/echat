import {
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  query,
  where,
  orderBy,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase/config";

const commentsCol = collection(db, "postComments");
// CRUD
export const createComment = async ({ postId, authorId, authorName, authorNickname, authorImg, text }) => {
  const newComment = {
    postId,
    authorId,
    authorName,
    authorNickname,
    authorImg,
    text,
    createdAt: serverTimestamp(),
    likes: [],
    replies: [],
  };
  const docRef = await addDoc(commentsCol, newComment);
  return docRef.id;
};

export const fetchCommentsByPostId = async (postId) => {
  const q = query(commentsCol, where("postId", "==", postId));
  const snapshot = await getDocs(q);
  const comments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return comments.filter((comment) => comment.text && comment.authorId);
};

export const updateComment = async (commentId, newText) => {
  const commentRef = doc(db, "postComments", commentId);
  await updateDoc(commentRef, {
    text: newText,
    updatedAt: serverTimestamp(),
  });
};

export const deleteComment = async (commentId) => {
  const commentRef = doc(db, "postComments", commentId);
  await deleteDoc(commentRef);
};
// end CRUD

// Actions
export const addReplyToComment = async (commentId, reply) => {
  const commentRef = doc(db, "postComments", commentId);

  // Перевірка на undefined
  const cleanReply = Object.fromEntries(Object.entries(reply).filter(([_, val]) => val !== undefined));

  await updateDoc(commentRef, {
    replies: arrayUnion({
      ...cleanReply,
      id: Date.now(),
      createdAt: new Date().toISOString(),
    }),
  });
};

export const likeComment = async (commentId, userId) => {
  const commentRef = doc(db, "postComments", commentId);
  await updateDoc(commentRef, {
    likes: arrayUnion(userId),
  });
};

export const unlikeComment = async (commentId, userId) => {
  const commentRef = doc(db, "postComments", commentId);
  await updateDoc(commentRef, {
    likes: arrayRemove(userId),
  });
};

export const hasUserLikedComment = async (commentId, userId) => {
  const commentRef = doc(db, "postComments", commentId);
  const snap = await getDoc(commentRef);
  if (!snap.exists()) return false;
  const data = snap.data();
  return data.likes?.includes(userId);
};
// 3 function before in 1 function.
export const toggleLikeComment = async (commentId, userId) => {
  const commentRef = doc(db, "postComments", commentId);
  const snap = await getDoc(commentRef);

  if (!snap.exists()) return;

  const data = snap.data();
  const alreadyLiked = data.likes?.includes(userId);

  await updateDoc(commentRef, {
    likes: alreadyLiked ? arrayRemove(userId) : arrayUnion(userId),
  });

  return !alreadyLiked; // true — added like, false — take off
};
