import { createContext, useState, useEffect } from "react";
import { collection, query, where, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import { mergeUserData } from "../utils/mergeUserData";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("currentUser"));
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const login = async (email, password) => {
    const q = query(collection(db, "users"), where("email", "==", email), where("password", "==", password));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const userDoc = snapshot.docs[0];
      const userData = { ...userDoc.data(), id: userDoc.id };
      userData.isLoggedIn = true;

      localStorage.setItem("currentUser", JSON.stringify(userData));
      setCurrentUser(userData);
      return true;
    }

    return false;
  };

  const logout = async () => {
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await updateDoc(userRef, {
        isLoggedIn: false,
        lastLogin: serverTimestamp(),
      });
    } catch (err) {
      console.error("Не вдалося оновити lastLogin:", err);
    }

    localStorage.removeItem("currentUser");
    setCurrentUser(null);

    navigate("/echat/register/me");
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
      const uid = crypto.randomUUID();

      const nickname = await generateUniqueNickname(userData.name);

      const newUser = {
        ...userData,
        uid,
        isLoggedIn: true,
        profileImage: "https://cdn-icons-png.flaticon.com/128/3177/3177440.png" || "https://cdn-icons-png.flaticon.com/128/456/456141.png",
        headerImage:
          "https://images.unsplash.com/photo-1556251188-9b8adc7ef390?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTh8fGJsdWUlMjBoZWFkZXJ8ZW58MHx8MHx8fDA%3D" ||
          "https://images.unsplash.com/photo-1747629382448-fde8a1fc8391?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHw1MHx8fGVufDB8fHx8fA%3D%3D",
        createdAt: serverTimestamp(),
        region: "",

        username: userData.name,
        nickname,

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
    } catch (error) {
      console.error("Помилка при реєстрації:", error.message);
    }
  };

  const updateUserProfile = async (newUserData, setPosts = null) => {
    try {
      const usersRef = collection(db, "users");
      const userQuery = query(usersRef, where("email", "==", newUserData.email));
      const userSnapshot = await getDocs(userQuery);

      if (userSnapshot.empty) {
        console.error("Користувача не знайдено");
        return false;
      }

      const userDoc = userSnapshot.docs[0];

      // save values that if we dont use them in progress
      const mergedUser = mergeUserData(userDoc.data(), newUserData);

      await updateDoc(userDoc.ref, mergedUser);

      if (setCurrentUser) {
        setCurrentUser({ ...mergedUser, id: userDoc.id });
        localStorage.setItem("currentUser", JSON.stringify({ ...mergedUser, id: userDoc.id }));
      }

      const postsRef = collection(db, "posts");
      const postsQuery = query(postsRef, where("author.email", "==", newUserData.email));
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

      return mergedUser;
    } catch (error) {
      console.error("Помилка оновлення профілю:", error);
      return false;
    }
  };

  const updateUser = async (newUserData) => {
    try {
      const usersRef = collection(db, "users");

      // foun user by email
      const userQuery = query(usersRef, where("email", "==", newUserData.email));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        console.error("Користувача не знайдено");
        return;
      }

      const userDoc = querySnapshot.docs[0];

      //Gey user doc
      await updateDoc(doc(db, "users", userDoc.id), newUserData);

      // refresh current user в React Context
      if (typeof setCurrentUser === "function") {
        setCurrentUser({ ...newUserData, id: userDoc.id });
      }
    } catch (error) {
      console.error("Помилка при оновленні користувача:", error);
    }
  };

  const verifyOldPassword = async (email, oldPassword) => {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, message: "Користувача не знайдено" };
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (userData.password !== oldPassword) {
      return { success: false, message: "Старий пароль невірний" };
    }

    return { success: true };
  };

  const changePassword = async (email, oldPassword, newPassword, currentUser, setCurrentUser) => {
    if (newPassword.length < 6) {
      return { success: false, message: "Пароль надто короткий" };
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      return { success: false, message: "Користувача не знайдено" };
    }

    const userDoc = snapshot.docs[0];
    const userData = userDoc.data();

    if (userData.password !== oldPassword) {
      return { success: false, message: "Старий пароль невірний" };
    }

    // Update users Firestore
    await updateDoc(doc(db, "users", userDoc.id), { password: newPassword });

    // update local user if it == current user
    if (currentUser?.email === email) {
      const updatedUser = { ...currentUser, password: newPassword };
      setCurrentUser(updatedUser);
    }

    return { success: true, message: "Пароль успішно змінено" };
  };

  const followUser = async (targetUserId) => {
    if (!currentUser || currentUser?.uid === targetUserId) return;
    if (currentUser.following?.includes(targetUserId)) return;

    const currentRef = doc(db, "users", currentUser?.uid);
    const targetRef = doc(db, "users", targetUserId);

    const targetSnap = await getDoc(targetRef);
    if (!targetSnap.exists()) return;

    const targetUser = targetSnap.data();

    // Update
    const updatedFollowing = [...(currentUser?.following || []), targetUserId];
    const updatedFollowers = [...(targetUser.followers || []), currentUser?.uid];

    await Promise.all([updateDoc(currentRef, { following: updatedFollowing }), updateDoc(targetRef, { followers: updatedFollowers })]);

    const updatedUser = { ...currentUser, following: updatedFollowing };
    updateUser(updatedUser);
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    // refresh current user в React Context
    if (typeof setCurrentUser === "function") {
      setCurrentUser({ ...updatedUser, id: currentUser?.id });
    }
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
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));

    if (typeof setCurrentUser === "function") {
      setCurrentUser({ ...updatedUser, id: currentUser.uid });
    }
  };

  const findUserByUid = async (uid) => {
    if (!uid) return null;
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const snapshot = await getDocs(q);
    return snapshot.empty ? null : snapshot.docs[0].data();
  };

  const deleteCurrentUser = async (emailConfirmation) => {
    if (!currentUser) return { success: false, message: "Користувача не знайдено." };

    // 1️⃣ local validation
    if (currentUser.email.toLowerCase() !== emailConfirmation.trim().toLowerCase()) return { success: false, message: "E-mail не збігається." };

    try {
      // 2️⃣ Firestore
      const userRef = doc(db, "users", currentUser.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) return { success: false, message: "Документ користувача не знайдено." };

      const firestoreEmail = userSnap.data().email;
      if (firestoreEmail.toLowerCase() !== emailConfirmation.trim().toLowerCase())
        return { success: false, message: "E-mail у Firestore не збігається." };

      // 3️⃣ Delete document
      await deleteDoc(userRef);

      // 4️⃣ Remove local state
      localStorage.removeItem("currentUser");
      setCurrentUser(null);
      navigate("/echat/register/me");

      return { success: true };
    } catch (error) {
      console.error("Помилка при видаленні користувача:", error);
      return { success: false, message: "Не вдалося видалити користувача." };
    }
  };

  const ownerNickName = currentUser?.nickname;
  const ownerUid = currentUser?.id;

  const isOwner = (id) => currentUser?.id === id;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        ownerNickName,
        ownerUid,
        login,
        logout,
        verifyOldPassword,
        register,
        updateUserProfile,
        updateUser,
        setCurrentUser,
        changePassword,
        followUser,
        unfollowUser,
        isOwner,
        findUserByUid,
        deleteCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
