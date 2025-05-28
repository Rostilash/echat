import { doc, updateDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";

export const createMutualChatConnection = async (currentUser, targetUserId) => {
  if (!currentUser || !targetUserId) return;

  console.log(currentUser);
  const currentUid = currentUser.uid;

  const usersRef = collection(db, "users");
  const targetQuery = query(usersRef, where("uid", "==", targetUserId));
  const targetSnapshot = await getDocs(targetQuery);

  if (targetSnapshot.empty) {
    console.error("Користувача не знайдено");
    return;
  }

  const targetDoc = targetSnapshot.docs[0];
  const targetUserData = targetDoc.data();

  const updatedCurrentUser = {
    ...currentUser,
    chatUsers: [...new Set([...(currentUser.chatUsers || []), targetUserId])],
  };

  const updatedTargetUser = {
    ...targetUserData,
    chatUsers: [...new Set([...(targetUserData.chatUsers || []), currentUid])],
  };

  await Promise.all([updateDoc(doc(db, "users", currentUser.uid), updatedCurrentUser), updateDoc(doc(db, "users", targetDoc.id), updatedTargetUser)]);

  localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));

  return updatedCurrentUser;
};
