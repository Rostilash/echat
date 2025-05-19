import { createContext, useContext, useEffect, useState, useMemo } from "react";
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "../firebase/config.js";
import { generateChatId } from "../pages/Messages/utils/chatUtils.js";

const MessageContext = createContext();

// hook for use this Context
export const useMessages = () => useContext(MessageContext);

export const MessageProvider = ({ children, chatId, currentUser }) => {
  const userA_userB = useMemo(() => {
    if (!chatId || !currentUser?.nickname) return null;
    return generateChatId(currentUser.nickname, chatId);
  }, [chatId, currentUser?.nickname]);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get messages of current chat
  useEffect(() => {
    if (!userA_userB) return;

    setLoading(true);
    const messagesRef = collection(db, "chats", userA_userB, "messages");
    const q = query(messagesRef, orderBy("timestamp", "asc")); //

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userA_userB]);

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

  if (!userA_userB) {
    return null;
  }
  return (
    <MessageContext.Provider
      value={{
        messages,
        loading,
        sendMessage,
        editMessage,
        deleteMessage,
        deleteChatWithMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
