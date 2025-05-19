// Function to get current chats from localStorage
export const getChats = () => {
  const chats = JSON.parse(localStorage.getItem("messages"));
  return chats || [];
};

// Gets all user chats
export const getUserChats = (nickname) => {
  const chats = getChats();
  return chats.filter((chat) => chat.participants.includes(nickname));
};

// Function to save chats to localStorage
export const saveChats = (chats) => {
  try {
    const pureChats = JSON.parse(JSON.stringify(chats));
    localStorage.setItem("messages", JSON.stringify(pureChats));
  } catch (err) {
    console.error("❌ Failed to save chats:", err, chats);
  }
};

// Unique chatId generator
export const generateChatId = (user1, user2) => {
  const sortedUsers = [user1, user2].sort();
  return `chat_${sortedUsers[0]}_${sortedUsers[1]}`;
};

// Function to send a message to the chat
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

// Function to get all messages for a specific chat
export const getMessages = (chatId) => {
  const chats = getChats();
  const chat = chats.find((chat) => chat.id === chatId);
  return chat ? chat.messages : [];
};

// Function to mark messages as read
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

// Add user to another's chat list
export const addUserToChatList = (userNickname, chatWithNickname) => {
  const users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find((u) => u.nickname === userNickname);
  if (user && !user.chatUsers.includes(chatWithNickname)) {
    user.chatUsers.push(chatWithNickname);
    localStorage.setItem("users", JSON.stringify(users));
  }
};

// for deleting the chatUsers
export const clearChatUsers = () => {
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  if (!currentUser) return;

  // Очистити chatUsers
  currentUser.chatUsers = [];

  // Оновити користувача в users
  const updatedUsers = users.map((user) => (user.email === currentUser.email ? { ...user, chatUsers: [] } : user));

  // Зберегти назад
  localStorage.setItem("currentUser", JSON.stringify(currentUser));
  localStorage.setItem("users", JSON.stringify(updatedUsers));
};
