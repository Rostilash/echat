// Функція для отримання поточних чатів з localStorage
export const getChats = () => {
  const chats = JSON.parse(localStorage.getItem("messages"));
  return chats || [];
};

// Отримує всі чати користувача
export const getUserChats = (nickname) => {
  const chats = getChats();
  return chats.filter((chat) => chat.participants.includes(nickname));
};

// Функція для збереження чатів в localStorage
export const saveChats = (chats) => {
  try {
    const pureChats = JSON.parse(JSON.stringify(chats));
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

  let chat = chats.find((chat) => chat.id === chatId);

  if (!chat) {
    chat = {
      id: chatId,
      participants: [from, to],
      messages: [],
    };
    chats.push(chat);
  }

  const newMessage = {
    from,
    to,
    content,
    isRead: false,
    timestamp: new Date().toISOString(),
    type: "text",
  };

  chat.messages.push(newMessage);
  saveChats(chats);

  // ДОДАЄМО співрозмовника до списку chatUsers
  addUserToChatList(from, to);
  addUserToChatList(to, from);
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

// Додати користувача до списку чатів іншого
export const addUserToChatList = (userNickname, chatWithNickname) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find((u) => u.nickname === userNickname);
  if (user && !user.chatUsers.includes(chatWithNickname)) {
    user.chatUsers.push(chatWithNickname);
    localStorage.setItem("users", JSON.stringify(users));
  }
};
