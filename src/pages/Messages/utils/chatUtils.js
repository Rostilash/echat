// Функція для отримання поточних чатів з localStorage
export const getChats = () => {
  const chats = JSON.parse(localStorage.getItem("messages"));
  return chats || [];
};

// Функція для збереження чатів в localStorage
export const saveChats = (chats) => {
  try {
    const pureChats = JSON.parse(JSON.stringify(chats)); // фільтрує все циклічне
    localStorage.setItem("messages", JSON.stringify(pureChats));
  } catch (err) {
    console.error("❌ Failed to save chats:", err, chats);
  }
};

// Генератор унікального chatId
export const generateChatId = (user1, user2) => {
  const sortedUsers = [user1, user2].sort();
  return `chat_${sortedUsers[0]}_${sortedUsers[1]}`;
};

// Функція для надсилання повідомлення в чат
export const sendMessage = (from, to, content) => {
  const chatId = generateChatId(from, to);
  const chats = getChats();

  // Знаходимо чи є вже такий чат
  let chat = chats.find((chat) => chat.id === chatId);

  // Якщо чату не існує, створюємо новий
  if (!chat) {
    chat = {
      id: chatId,
      participants: [from, to],
      messages: [],
    };
    chats.push(chat);
  }

  // Додаємо нове повідомлення
  const newMessage = {
    from,
    to,
    content,
    isRead: false,
    timestamp: new Date().toISOString(),
    type: "text", // тут можна додавати типи повідомлень: "text", "image", "gif"
  };

  chat.messages.push(newMessage);
  saveChats(chats);
};

// Функція для отримання всіх повідомлень для конкретного чату
export const getMessages = (chatId) => {
  const chats = getChats();
  const chat = chats.find((chat) => chat.id === chatId);
  return chat ? chat.messages : [];
};

// Функція для позначення повідомлень як прочитаних
export const markMessagesAsRead = (chatId, user) => {
  const chats = getChats();
  const chat = chats.find((chat) => chat.id === chatId);
  if (chat) {
    chat.messages = chat.messages.map((msg) => {
      if (msg.to === user && !msg.isRead) {
        msg.isRead = true;
      }
      return msg;
    });
    saveChats(chats);
  }
};
