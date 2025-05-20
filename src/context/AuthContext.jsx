import { createContext, useState, useEffect } from "react";
import { collection, query, where, getFirestore, doc, setDoc, getDocs, serverTimestamp, updateDoc } from "firebase/firestore";
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

  const logout = () => {
    const updatedUser = { ...currentUser, isLoggedIn: false };
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setCurrentUser(null);

    // setTimeout(() => {
    navigate("/echat/register/me");
    // }, 1000);
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
        profileImage: userData.profileImage || "https://cdn-icons-png.flaticon.com/128/1837/1837645.png",
        headerImage: "",
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

        posts: [],
        likes: [],
        bookmarks: [],
        repostedBy: [],
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

  const updateUser = async (newUserData, setCurrentUser) => {
    try {
      const usersRef = collection(db, "users");

      // Знаходимо користувача по email
      const userQuery = query(usersRef, where("email", "==", newUserData.email));
      const querySnapshot = await getDocs(userQuery);

      if (querySnapshot.empty) {
        console.error("Користувача не знайдено");
        return;
      }

      const userDoc = querySnapshot.docs[0];

      // Оновлюємо документ користувача
      await updateDoc(doc(db, "users", userDoc.id), newUserData);

      // Оновлюємо поточного користувача в React Context
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

    // Оновлення пароля в Firestore
    await updateDoc(doc(db, "users", userDoc.id), { password: newPassword });

    // Оновлення локального користувача, якщо це він
    if (currentUser?.email === email) {
      const updatedUser = { ...currentUser, password: newPassword };
      setCurrentUser(updatedUser);
    }

    return { success: true, message: "Пароль успішно змінено" };
  };

  const followUser = async (nicknameToFollow, currentUser, setCurrentUser) => {
    if (!currentUser || !nicknameToFollow || nicknameToFollow === currentUser.nickname) return;

    const usersRef = collection(db, "users");

    // Завантажуємо користувачів, що беруть участь
    const q = query(usersRef, where("nickname", "in", [currentUser.nickname, nicknameToFollow]));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return;

    const users = {};
    snapshot.docs.forEach((doc) => {
      users[doc.data().nickname] = { id: doc.id, data: doc.data() };
    });

    // Оновлюємо currentUser.following
    const currentUserData = users[currentUser.nickname].data;
    if (!currentUserData.following.includes(nicknameToFollow)) {
      currentUserData.following.push(nicknameToFollow);
      await updateDoc(doc(db, "users", users[currentUser.nickname].id), { following: currentUserData.following });
    }

    // Оновлюємо користувача, якого підписуються followers
    const followedUserData = users[nicknameToFollow].data;
    if (!followedUserData.followers.includes(currentUser.nickname)) {
      followedUserData.followers.push(currentUser.nickname);
      await updateDoc(doc(db, "users", users[nicknameToFollow].id), { followers: followedUserData.followers });
    }

    // Оновлюємо локальний стан currentUser
    setCurrentUser({ ...currentUser, following: currentUserData.following });
  };

  const unfollowUser = async (nicknameToUnfollow, currentUser, setCurrentUser) => {
    if (!currentUser || nicknameToUnfollow === currentUser.nickname) return;

    const usersRef = collection(db, "users");

    // Завантажуємо користувачів, що беруть участь
    const q = query(usersRef, where("nickname", "in", [currentUser.nickname, nicknameToUnfollow]));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return;

    const users = {};
    snapshot.docs.forEach((doc) => {
      users[doc.data().nickname] = { id: doc.id, data: doc.data() };
    });

    // Оновлюємо currentUser.following
    const currentUserData = users[currentUser.nickname].data;
    currentUserData.following = currentUserData.following.filter((n) => n !== nicknameToUnfollow);
    await updateDoc(doc(db, "users", users[currentUser.nickname].id), { following: currentUserData.following });

    // Оновлюємо користувача, якого відписуємо followers
    const unfollowedUserData = users[nicknameToUnfollow].data;
    unfollowedUserData.followers = unfollowedUserData.followers.filter((n) => n !== currentUser.nickname);
    await updateDoc(doc(db, "users", users[nicknameToUnfollow].id), { followers: unfollowedUserData.followers });

    // Оновлюємо локальний стан currentUser
    setCurrentUser({ ...currentUser, following: currentUserData.following });
  };

  const findUserByNickname = async (nickname) => {
    const q = query(collection(db, "users"), where("nickname", "==", nickname));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty ? null : querySnapshot.docs[0].data();
  };

  const isOwner = (nickname) => currentUser?.nickname === nickname;

  const ownerNickName = currentUser?.nickname;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
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
        ownerNickName,
        findUserByNickname,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
