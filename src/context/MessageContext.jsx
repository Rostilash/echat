import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, getDocs, where } from "firebase/firestore";
import { db } from "../firebase/config.js";
import { generateChatId } from "../pages/Messages/utils/chatUtils.js";

const MessageContext = createContext();

// hook for use this Context
export const useMessages = () => useContext(MessageContext);

const CACHE_KEY = "chatUsersCache";
const CACHE_TTL = 1000 * 60 * 60; // 1 hour hash
const fetchUsersByIdsWithCache = async (uids) => {
  if (!uids || uids.length === 0) return [];

  const cachedRaw = localStorage.getItem(CACHE_KEY);
  if (cachedRaw) {
    try {
      const cached = JSON.parse(cachedRaw);
      const now = Date.now();
      if (now - cached.timestamp < CACHE_TTL) {
        // Filter users by UIDs
        const filteredUsers = cached.users.filter((user) => uids.includes(user.uid));
        return filteredUsers;
      }
    } catch {
      // if hash incorect ignore it
    }
  }

  // show only 7 users (FireBase Cors to 10users)
  const uidsLimited = uids.slice(0, 7);
  if (uids.length > 7) {
    console.warn("⚠️ Підвантажуються лише перші 7 користувачів із chatUsers");
  }

  const usersRef = collection(db, "users");
  const q = query(usersRef, where("uid", "in", uidsLimited));
  const snapshot = await getDocs(q);

  const users = [];
  snapshot.forEach((doc) => {
    users.push({ uid: doc.id, ...doc.data() });
  });

  localStorage.setItem(CACHE_KEY, JSON.stringify({ users, timestamp: Date.now() }));

  return users;
};

export const MessageProvider = ({ children, chatId, currentUser }) => {
  const userId = currentUser?.id || currentUser?.uid || null;
  const userA_userB = useMemo(() => {
    if (!chatId || !userId) return null;
    return generateChatId(userId, chatId);
  }, [chatId, userId]);

  const [messages, setMessages] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load chat Users
  useEffect(() => {
    if (!chatId || !currentUser?.chatUsers?.length || allUsers.length > 0) return;

    const loadUsers = async () => {
      try {
        localStorage.removeItem("chatUsersCache");

        const usersFromCache = await fetchUsersByIdsWithCache(currentUser.chatUsers);
        setAllUsers(usersFromCache);
        const partner = usersFromCache.find((u) => u.uid === chatId) || null;
      } catch (error) {
        console.error("Error loading users:", error);
      }
    };

    loadUsers();
  }, [chatId, currentUser?.chatUsers]);

  // Get messages of current chat
  useEffect(() => {
    if (!userA_userB || !userId) return;

    setLoading(true);
    const messagesRef = collection(db, "chats", userA_userB, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setLoading(false);

      // Знаходимо непрочитані повідомлення в цьому чаті (адресовані поточному користувачу)
      const unreadDocs = snapshot.docs.filter((doc) => doc.data().to === userId && doc.data().isRead === false);

      // Ставимо тільки їх як прочитані
      const updatePromises = unreadDocs.map((docSnap) => updateDoc(doc(db, "chats", userA_userB, "messages", docSnap.id), { isRead: true }));

      await Promise.all(updatePromises);
    });

    return () => unsubscribe();
  }, [userA_userB, userId]);

  useEffect(() => {
    if (!currentUser?.chatUsers?.length || !userId) return;

    const unsubscribes = [];

    currentUser.chatUsers.forEach((partnerId) => {
      const chatId = generateChatId(userId, partnerId);
      const messagesRef = collection(db, "chats", chatId, "messages");
      const q = query(messagesRef, orderBy("timestamp", "asc"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAllMessages((prev) => ({
          ...prev,
          [partnerId]: messages,
        }));
      });

      unsubscribes.push(unsubscribe);
    });

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [currentUser, userId]);

  //Send message
  const sendMessage = async ({ content, from, to, type = "text" }) => {
    try {
      const messagesRef = collection(db, "chats", userA_userB, "messages");
      await addDoc(messagesRef, {
        content,
        from,
        to,
        isRead: false,
        timestamp: serverTimestamp(),
        type,
      });
    } catch (error) {
      console.error("Помилка додавання повідомлення:", error);
    }
  };

  // Edit
  const editMessage = async (messageId, newText) => {
    try {
      const messageRef = doc(db, "chats", userA_userB, "messages", messageId);
      await updateDoc(messageRef, {
        content: newText,
        editedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Помилка редагування повідомлення:", error);
    }
  };

  // Delete
  const deleteMessage = async (messageId) => {
    console.log(messageId);
    try {
      const messageRef = doc(db, "chats", userA_userB, "messages", messageId);
      await deleteDoc(messageRef);
    } catch (error) {
      console.error("Помилка видалення повідомлення:", error);
    }
  };

  // Delete current chat.
  const deleteChatWithMessages = async (chatId) => {
    try {
      // 1. Get all chats
      const messagesRef = collection(db, "chats", chatId, "messages");
      const snapshot = await getDocs(messagesRef);

      // 2. delete all messages
      const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(doc(db, "chats", chatId, "messages", docSnap.id)));
      await Promise.all(deletePromises);

      // 3. delete current chat
      await deleteDoc(doc(db, "chats", chatId));

      console.log(`Чат ${chatId} і всі його повідомлення видалено`);
    } catch (error) {
      console.error("Помилка при видаленні чату:", error);
    }
  };

  // delete all messages (for testing)
  const deleteAllMessages = async () => {
    try {
      const messagesRef = collection(db, "messages");
      const snapshot = await getDocs(messagesRef);

      const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(doc(db, "messages", docSnap.id)));

      await Promise.all(deletePromises);
      console.log("✅ Всі повідомлення видалені з колекції messages");
    } catch (error) {
      console.error("❌ Помилка при видаленні повідомлень:", error);
    }
  };

  const deleteAllUserChats = async () => {
    if (!currentUser || !currentUser.chatUsers?.length) return;

    try {
      const currentUserId = currentUser.id || currentUser.uid;
      const userDocRef = doc(db, "users", currentUserId);

      // Видаляємо всі чати
      const deletePromises = currentUser.chatUsers.map(async (partnerId) => {
        const chatPath = generateChatId(currentUserId, partnerId);
        const messagesRef = collection(db, "chats", chatPath, "messages");
        const messagesSnap = await getDocs(messagesRef);

        const messageDeletes = messagesSnap.docs.map((docSnap) => deleteDoc(doc(db, "chats", chatPath, "messages", docSnap.id)));

        await Promise.all(messageDeletes);
        await deleteDoc(doc(db, "chats", chatPath));
      });

      await Promise.all(deletePromises);

      // Очищаємо chatUsers у поточного користувача
      await updateDoc(userDocRef, { chatUsers: [] });

      // Оновлюємо локального юзера (локально і в useState)
      const updatedUser = { ...currentUser, chatUsers: [] };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      // Також видаляємо кешовані користувачі чату
      localStorage.removeItem(CACHE_KEY);

      console.log("✅ Усі чати користувача видалені");
    } catch (error) {
      console.error("❌ Помилка при видаленні всіх чатів:", error);
    }
  };
  if (!userA_userB) {
    return null;
  }

  return (
    <MessageContext.Provider
      value={{
        messages,
        loading,
        allUsers,
        allMessages,
        sendMessage,
        editMessage,
        deleteMessage,
        deleteChatWithMessages,
        deleteAllUserChats,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
