import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chats: {},
  currentChatId: null,
  isLoading: false,
  error: null,
};

const ensureChat = (state, chatId, title = "New Chat") => {
  if (!state.chats[chatId]) {
    state.chats[chatId] = {
      id: chatId,
      title,
      messages: [],
      createdAt: null,
      updatedAt: null,
    };
  }
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload || {};
    },

    setCurrentChatId: (state, action) => {
      state.currentChatId = action.payload;
    },

    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    upsertChat: (state, action) => {
      const chat = action.payload;
      ensureChat(state, chat.id, chat.title);

      state.chats[chat.id] = {
        ...state.chats[chat.id],
        ...chat,
        messages: chat.messages || state.chats[chat.id].messages || [],
      };
    },

    setChatMessages: (state, action) => {
      const { chatId, messages } = action.payload;
      ensureChat(state, chatId);
      state.chats[chatId].messages = messages;
    },

    addMessageToChat: (state, action) => {
      const { chatId, message, title } = action.payload;
      ensureChat(state, chatId, title);

      const exists = state.chats[chatId].messages.some((msg) => msg.id === message.id);
      if (!exists) {
        state.chats[chatId].messages.push(message);
      }

      state.chats[chatId].updatedAt = new Date().toISOString();
    },

    addManyMessagesToChat: (state, action) => {
      const { chatId, messages, title } = action.payload;
      ensureChat(state, chatId, title);

      const existingIds = new Set(state.chats[chatId].messages.map((msg) => msg.id));
      const filtered = messages.filter((msg) => !existingIds.has(msg.id));
      state.chats[chatId].messages.push(...filtered);
    },

    removeChat: (state, action) => {
      const chatId = action.payload;
      delete state.chats[chatId];

      if (state.currentChatId === chatId) {
        const remaining = Object.keys(state.chats);
        state.currentChatId = remaining.length ? remaining[0] : null;
      }
    },

    resetCurrentChat: (state) => {
      state.currentChatId = null;
      state.error = null;
    },
  },
});

export const {
  setChats,
  setCurrentChatId,
  setLoading,
  setError,
  upsertChat,
  setChatMessages,
  addMessageToChat,
  addManyMessagesToChat,
  removeChat,
  resetCurrentChat,
} = chatSlice.actions;

export default chatSlice.reducer;

