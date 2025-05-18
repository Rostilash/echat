import { createContext, useContext, useEffect, useState } from "react";
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, orderBy, serverTimestamp, getDocs } from "firebase/firestore";
import { db } from "../firebase/config.js";

const MessageContext = createContext();

// hook for use
export const useMessages = () => useContext(MessageContext);

export const MessageProvider = ({ children, chatId }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get messages of current chat
  useEffect(() => {
    if (!chatId) return;

    setLoading(true);
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [chatId]);

  //Send message
  const sendMessage = async ({ content, from, to, type = "text" }) => {
    try {
      const messagesRef = collection(db, "chats", chatId, "messages");
      await addDoc(messagesRef, {
        content,
        from,
        to,
        isRead: false, // нове повідомлення ще не прочитане
        timestamp: serverTimestamp(), // час надсилання
        type,
      });
    } catch (error) {
      console.error("Помилка додавання повідомлення:", error);
    }
  };

  // Edit
  const editMessage = async (messageId, newText) => {
    try {
      const messageRef = doc(db, "chats", chatId, "messages", messageId);
      await updateDoc(messageRef, {
        text: newText,
        editedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error("Помилка редагування повідомлення:", error);
    }
  };

  // Delete
  const deleteMessage = async (messageId) => {
    try {
      const messageRef = doc(db, "chats", chatId, "messages", messageId);
      await deleteDoc(messageRef);
    } catch (error) {
      console.error("Помилка видалення повідомлення:", error);
    }
  };

  // Delete current chat.
  const deleteChatWithMessages = async (chatId) => {
    try {
      // 1. Отримати всі повідомлення
      const messagesRef = collection(db, "chats", chatId, "messages");
      const snapshot = await getDocs(messagesRef);

      // 2. Видалити кожне повідомлення
      const deletePromises = snapshot.docs.map((docSnap) => deleteDoc(doc(db, "chats", chatId, "messages", docSnap.id)));
      await Promise.all(deletePromises);

      // 3. Видалити сам чат
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
  // check messages
  const checkMessages = async () => {
    try {
      const messagesSnapshot = await getDocs(collection(db, "messages"));

      messagesSnapshot.forEach((doc) => {
        console.log("ID документа:", doc.id);
        console.log("Шлях:", `messages/${doc.id}`);
        console.log("Дані:", doc.data());
      });
    } catch (error) {
      console.error("Помилка при отриманні повідомлень:", error);
    }
  };

  console.log(messages);

  return (
    <MessageContext.Provider
      value={{
        messages,
        loading,
        sendMessage,
        editMessage,
        deleteMessage,
        deleteChatWithMessages,
        checkMessages,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};
