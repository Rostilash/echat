import { createContext, useState, useEffect } from "react";
import { collection, query, where, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  deleteUser as deleteAuthUser,
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { db, auth } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { mergeUserData } from "../utils/mergeUserData";
import { getMimeType } from "../utils/compress/getMimeType";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isUserInitialized, setIsUserInitialized] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const userData = { ...snapshot.docs[0].data(), id: snapshot.docs[0].id };
          setCurrentUser(userData);
          localStorage.setItem("currentUser", JSON.stringify(userData));
        }
      } else {
        setCurrentUser(null);
        localStorage.removeItem("currentUser");
      }

      setIsUserInitialized(true);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const q = query(collection(db, "users"), where("uid", "==", user.uid));
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const userData = { ...snapshot.docs[0].data(), id: snapshot.docs[0].id };
        userData.isLoggedIn = true;

        await updateDoc(snapshot.docs[0].ref, { isLoggedIn: true });

        setCurrentUser(userData);
        localStorage.setItem("currentUser", JSON.stringify(userData));
      }
      return true;
    } catch (error) {
      console.error("Login error:", error.code, error.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      if (currentUser?.id) {
        const userRef = doc(db, "users", currentUser.id);
        await updateDoc(userRef, { isLoggedIn: false });
      }
      await signOut(auth);

      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      navigate("/pre-page");
    } catch (err) {
      console.error("Logout error:", err.message);
    }
  };

  const generateUniqueNickname = async (baseName) => {
    const slug = baseName.trim().toLowerCase().replace(/\s+/g, "");

    const q = query(collection(db, "users"), where("nickname", "==", slug));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return slug;
    }

    const generateRandomSuffix = () => Math.random().toString(36).slice(-5);

    let nickname;
    let isUnique = false;

    while (!isUnique) {
      const suffix = generateRandomSuffix();
      nickname = `${slug}${suffix}`;
      const q = query(collection(db, "users"), where("nickname", "==", nickname));
      const snapshot = await getDocs(q);
      isUnique = snapshot.empty;
    }

    return nickname;
  };

  const register = async (userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = userCredential.user;
      const uid = user.uid;

      const nickname = await generateUniqueNickname(userData.name);
      const { password, ...userDataWithoutPassword } = userData;

      const newUser = {
        ...userDataWithoutPassword,
        id: uid,
        uid,
        isLoggedIn: true,
        nickname,
        profileImage: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png",
        headerImage:
          "https://images.unsplash.com/photo-1556251188-9b8adc7ef390?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTh8fGJsdWUlMjBoZWFkZXJ8ZW58MHx8MHx8fDA%3D",
        createdAt: serverTimestamp(),
        region: "",
        username: userData.name,
        bio: "",
        location: "",
        website: "",
        birthdate: "",
        followers: [],
        following: [],
        chatUsers: [],
        emailVerified: false,
        theme: "light",
        language: "uk",
        notifications: {
          mentions: true,
          follows: true,
          likes: true,
        },
        lastLogin: null,
        updatedAt: null,
      };

      await setDoc(doc(db, "users", uid), newUser);
      setCurrentUser(newUser);
      localStorage.setItem("currentUser", JSON.stringify(newUser));
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        throw new Error("Користувач з таким Email вже існує.");
      }
      throw new Error("Сталася помилка при реєстрації: " + error.message);
    }
  };

  const updateUserProfile = async (newUserData, setPosts = null) => {
    try {
      const q = query(collection(db, "users"), where("email", "==", newUserData.email));
      const snapshot = await getDocs(q);
      if (snapshot.empty) return false;

      const userDoc = snapshot.docs[0];
      const mergedUser = mergeUserData(userDoc.data(), newUserData);

      if (!mergedUser.password) {
        delete mergedUser.password;
      }

      await updateDoc(userDoc.ref, mergedUser);

      const updatedUser = { ...mergedUser, id: userDoc.id };
      setCurrentUser(updatedUser);
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      const postsQuery = query(collection(db, "posts"), where("author.email", "==", newUserData.email));
      const postsSnapshot = await getDocs(postsQuery);

      const updatedPosts = await Promise.all(
        postsSnapshot.docs.map(async (postDoc) => {
          const post = postDoc.data();
          const updatedPost = {
            ...post,
            author: {
              ...post.author,
              name: newUserData.name,
              nickname: newUserData.nickname,
              profileImage: newUserData.profileImage,
            },
          };
          await updateDoc(postDoc.ref, updatedPost);
          return { ...updatedPost, id: postDoc.id };
        })
      );

      if (typeof setPosts === "function") {
        setPosts(updatedPosts);
      }

      return updatedUser;
    } catch (error) {
      console.error("Profile update error:", error);
      return false;
    }
  };

  const updateUser = async (newUserData) => {
    try {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (!currentUser) {
        console.error("Користувач не авторизований");
        return;
      }

      const uid = currentUser.uid;
      const userRef = doc(db, "users", uid);

      await updateDoc(userRef, newUserData);

      if (typeof setCurrentUser === "function") {
        setCurrentUser((prev) => ({
          ...prev,
          ...newUserData,
        }));
      }
    } catch (error) {
      console.error("Помилка при оновленні користувача:", error);
    }
  };

  const verifyOldPassword = async (oldPassword) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      return { success: false, message: "Користувач не авторизований" };
    }

    try {
      const credential = EmailAuthProvider.credential(user.email, oldPassword.trim());
      await reauthenticateWithCredential(user, credential);

      return { success: true };
    } catch (error) {
      console.error("reauth error:", error.code, error.message);
      return { success: false, message: "Старий пароль невірний або сесія недійсна" };
    }
  };

  const changePassword = async (email, oldPassword, newPassword) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, oldPassword);
      const user = userCredential.user;

      await user.updatePassword(newPassword); // ⚠️ needs reauthentication sometimes
      return { success: true, message: "Пароль змінено успішно." };
    } catch (error) {
      return { success: false, message: "Помилка зміни паролю: " + error.message };
    }
  };

  const followUser = async (targetUserId) => {
    if (!currentUser || currentUser?.uid === targetUserId) return;
    if (currentUser.following?.includes(targetUserId)) return;

    const currentRef = doc(db, "users", currentUser?.uid);
    const targetRef = doc(db, "users", targetUserId);

    const targetSnap = await getDoc(targetRef);
    if (!targetSnap.exists()) return;

    const targetUser = targetSnap.data();

    const updatedFollowing = [...(currentUser?.following || []), targetUserId];
    const updatedFollowers = [...(targetUser.followers || []), currentUser?.uid];

    await Promise.all([updateDoc(currentRef, { following: updatedFollowing }), updateDoc(targetRef, { followers: updatedFollowers })]);

    const updatedUser = { ...currentUser, following: updatedFollowing };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  const unfollowUser = async (targetUserId) => {
    if (!currentUser || currentUser.uid === targetUserId) return;

    const currentRef = doc(db, "users", currentUser.uid);
    const targetRef = doc(db, "users", targetUserId);

    const targetSnap = await getDoc(targetRef);
    if (!targetSnap.exists()) return;

    const targetUser = targetSnap.data();

    const updatedFollowing = (currentUser.following || []).filter((uid) => uid !== targetUserId);
    const updatedFollowers = (targetUser.followers || []).filter((uid) => uid !== currentUser.uid);

    await Promise.all([updateDoc(currentRef, { following: updatedFollowing }), updateDoc(targetRef, { followers: updatedFollowers })]);

    const updatedUser = { ...currentUser, following: updatedFollowing };
    setCurrentUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
  };

  const findUserByUid = async (uid) => {
    if (!uid) return null;
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].data();
  };

  const deleteCurrentUser = async (emailConfirmation) => {
    if (!currentUser) return { success: false, message: "Користувача не знайдено." };
    if (currentUser.email.toLowerCase() !== emailConfirmation.trim().toLowerCase()) {
      return { success: false, message: "E-mail не збігається." };
    }

    const uid = currentUser.uid;

    try {
      // 1. Delate all user chats by id
      const chatsRef = collection(db, "chats");
      const chatsQuery = query(chatsRef, where("participants", "array-contains", uid));
      const chatsSnap = await getDocs(chatsQuery);

      for (const chatDoc of chatsSnap.docs) {
        const chatId = chatDoc.id;

        // Delate all chat messages
        const messagesRef = collection(db, "chats", chatId, "messages");
        const messagesSnap = await getDocs(messagesRef);
        await Promise.all(messagesSnap.docs.map((msg) => deleteDoc(doc(db, "chats", chatId, "messages", msg.id))));

        // Видалити сам чат
        await deleteDoc(doc(db, "chats", chatId));
      }

      // 2. Delate all posts
      const postsRef = collection(db, "posts");
      const postsQuery = query(postsRef, where("authorId", "==", uid));
      const postsSnap = await getDocs(postsQuery);
      await Promise.all(postsSnap.docs.map((postDoc) => deleteDoc(doc(db, "posts", postDoc.id))));

      // 3. Delate all comments
      const commentsRef = collection(db, "postComments");
      const commentsQuery = query(commentsRef, where("authorId", "==", uid));
      const commentsSnap = await getDocs(commentsQuery);
      await Promise.all(commentsSnap.docs.map((commentDoc) => deleteDoc(doc(db, "postComments", commentDoc.id))));

      // 4. Delate all likes
      const likesRef = collection(db, "postLikes");
      const likesQuery = query(likesRef, where("userId", "==", uid));
      const likesSnap = await getDocs(likesQuery);
      await Promise.all(likesSnap.docs.map((likeDoc) => deleteDoc(doc(db, "postLikes", likeDoc.id))));

      // 5. Delate all reposts
      const repostsRef = collection(db, "postReposts");
      const repostsQuery = query(repostsRef, where("userId", "==", uid));
      const repostsSnap = await getDocs(repostsQuery);
      await Promise.all(repostsSnap.docs.map((repostDoc) => deleteDoc(doc(db, "postReposts", repostDoc.id))));

      // 6. Delate all bookmarks
      const bookmarksRef = collection(db, "postBookmarks");
      const bookmarksQuery = query(bookmarksRef, where("userId", "==", uid));
      const bookmarksSnap = await getDocs(bookmarksQuery);
      await Promise.all(bookmarksSnap.docs.map((bookmarkDoc) => deleteDoc(doc(db, "postBookmarks", bookmarkDoc.id))));

      // 7. Delate current user
      await deleteDoc(doc(db, "users", uid));

      // 8. Delate from auth user
      if (auth.currentUser) {
        await deleteAuthUser(auth.currentUser);
      }

      // 9. Quit and fill the localStorage
      await signOut(auth);
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      navigate("/register/me");

      return { success: true };
    } catch (error) {
      console.error("Помилка видалення користувача:", error);
      return { success: false, message: "Не вдалося видалити користувача та всі пов'язані дані." };
    }
  };

  const signInWithGoogleDrive = async () => {
    const provider = new GoogleAuthProvider();

    provider.addScope("https://www.googleapis.com/auth/drive.file");
    provider.setCustomParameters({
      prompt: "consent", // Force re-authentication of access
      access_type: "offline",
    });

    try {
      await signOut(auth);

      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      console.log("Успішний вхід у Google Drive");
      return { success: true, user, accessToken: token };
    } catch (err) {
      if (err.code === "auth/popup-closed-by-user") {
        console.warn("Користувач закрив вікно входу.");
      } else {
        console.error("Інша помилка при авторизації:", err);
      }
      return { success: false, error: err };
    }
  };

  const uploadFileToDrive = async (file, accessToken, filename) => {
    try {
      const name = filename || file.name;

      // Приклад, якщо getMimeType може бути невизначеним
      const mimeType = filename && filename.endsWith(".zip") ? "application/zip" : getMimeType ? getMimeType(file) : "application/octet-stream";

      const metadata = {
        name,
        mimeType,
      };

      const form = new FormData();
      form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
      form.append("file", file);

      const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: form,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error.message);
      }

      const data = await res.json();
      return { success: true, data };
    } catch (error) {
      console.error("Upload to Drive error:", error);
      return { success: false, error };
    }
  };

  const ownerNickName = currentUser?.nickname;
  const ownerUid = currentUser?.uid;

  const isOwner = (id) => currentUser?.uid === id;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        ownerNickName,
        ownerUid,
        login,
        logout,
        register,
        updateUserProfile,
        verifyOldPassword,
        updateUser,
        changePassword,
        setCurrentUser,
        followUser,
        unfollowUser,
        isOwner,
        findUserByUid,
        deleteCurrentUser,
        isUserInitialized,
        signInWithGoogleDrive,
        uploadFileToDrive,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
