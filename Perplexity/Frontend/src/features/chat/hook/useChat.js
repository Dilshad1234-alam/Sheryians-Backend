import { useDispatch, useSelector } from "react-redux";
import {
  addMessageToChat,
  removeChat,
  setChatMessages,
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  upsertChat,
} from "../chat.slice";
import {
  deleteChat as deleteChatApi,
  getChats as getChatsApi,
  getMessages as getMessagesApi,
  sendMessage as sendMessageApi,
} from "../api/chat.api";
import {
  getSocket,
  initializeSocketConnection,
  joinChatRoom,
  leaveChatRoom,
} from "../socket/chat.socket";

export const useChat = () => {
  const dispatch = useDispatch();
  const currentChatId = useSelector((state) => state.chat.currentChatId);
  const chats = useSelector((state) => state.chat.chats);

  const handleGetChats = async () => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = await getChatsApi();
      dispatch(setChats(data.chats || {}));

      const firstChatId = Object.keys(data.chats || {})[0];
      if (firstChatId && !currentChatId) {
        dispatch(setCurrentChatId(firstChatId));
      }
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to load chats"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleOpenChat = async (chatId) => {
    try {
      if (!chatId) return;

      if (currentChatId && currentChatId !== chatId) {
        leaveChatRoom(currentChatId);
      }

      dispatch(setCurrentChatId(chatId));
      joinChatRoom(chatId);

      if (chats[chatId]?.messages?.length) return;

      dispatch(setLoading(true));
      const data = await getMessagesApi(chatId);

      dispatch(
        upsertChat({
          ...data.chat,
          messages: data.chat.messages || [],
        })
      );

      dispatch(
        setChatMessages({
          chatId,
          messages: data.chat.messages || [],
        })
      );
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to load messages"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleSendMessage = async ({ message, chatId }) => {
    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const data = await sendMessageApi({ message, chatId });

      const activeChatId = data.chat.id;

      dispatch(
        upsertChat({
          ...data.chat,
          title: data.title || data.chat.title,
        })
      );

      dispatch(setCurrentChatId(activeChatId));
      joinChatRoom(activeChatId);

      dispatch(
        addMessageToChat({
          chatId: activeChatId,
          message: data.userMessage,
          title: data.chat.title,
        })
      );

      dispatch(
        addMessageToChat({
          chatId: activeChatId,
          message: data.aiMessage,
          title: data.chat.title,
        })
      );
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to send message"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      dispatch(setLoading(true));
      await deleteChatApi(chatId);

      if (currentChatId === chatId) {
        leaveChatRoom(chatId);
      }

      dispatch(removeChat(chatId));
    } catch (error) {
      dispatch(setError(error.response?.data?.message || "Failed to delete chat"));
    } finally {
      dispatch(setLoading(false));
    }
  };

  const setupSocketListeners = () => {
    const socket = getSocket();
    if (!socket) return;

    socket.off("message-created");
    socket.on("message-created", ({ chatId, userMessage, aiMessage }) => {
      if (userMessage) {
        dispatch(addMessageToChat({ chatId, message: userMessage }));
      }

      if (aiMessage) {
        dispatch(addMessageToChat({ chatId, message: aiMessage }));
      }
    });
  };

  return {
    currentChatId,
    chats,
    initializeSocketConnection,
    setupSocketListeners,
    handleGetChats,
    handleOpenChat,
    handleSendMessage,
    handleDeleteChat,
  };
};



// import { useDispatch, useSelector } from "react-redux";
// import {
//   addMessageToChat,
//   removeChat,
//   setChatMessages,
//   setChats,
//   setCurrentChatId,
//   setError,
//   setLoading,
//   upsertChat,
// } from "../chat.slice";
// import {
//   deleteChat as deleteChatApi,
//   getChats as getChatsApi,
//   getMessages as getMessagesApi,
//   sendMessage as sendMessageApi,
// } from "../api/chat.api";
// import {
//   getSocket,
//   initializeSocketConnection,
//   joinChatRoom,
//   leaveChatRoom,
// } from "../socket/chat.socket";

// const normalizeChat = (chat) => ({
//   id: chat?.id || chat?._id,
//   title: chat?.title || "New Chat",
//   createdAt: chat?.createdAt || null,
//   updatedAt: chat?.updatedAt || null,
//   messages: chat?.messages || [],
// });

// const normalizeMessage = (message) => ({
//   id: message?.id || message?._id,
//   content: message?.content || "",
//   role: message?.role || "user",
//   createdAt: message?.createdAt || null,
//   updatedAt: message?.updatedAt || null,
// });

// export const useChat = () => {
//   const dispatch = useDispatch();
//   const currentChatId = useSelector((state) => state.chat.currentChatId);
//   const chats = useSelector((state) => state.chat.chats);

//   const handleGetChats = async () => {
//     try {
//       dispatch(setLoading(true));
//       dispatch(setError(null));

//       const data = await getChatsApi();
//       dispatch(setChats(data.chats || {}));

//       const firstChatId = Object.keys(data.chats || {})[0];
//       if (firstChatId && !currentChatId) {
//         dispatch(setCurrentChatId(firstChatId));
//       }
//     } catch (error) {
//       dispatch(setError(error.response?.data?.message || "Failed to load chats"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   const handleOpenChat = async (chatId) => {
//     try {
//       if (!chatId) return;

//       if (currentChatId && currentChatId !== chatId) {
//         leaveChatRoom(currentChatId);
//       }

//       dispatch(setCurrentChatId(chatId));
//       joinChatRoom(chatId);

//       if (chats[chatId]?.messages?.length) return;

//       dispatch(setLoading(true));
//       dispatch(setError(null));

//       const data = await getMessagesApi(chatId);

//       dispatch(
//         upsertChat({
//           ...normalizeChat(data.chat),
//           messages: (data.messages || []).map(normalizeMessage),
//         })
//       );

//       dispatch(
//         setChatMessages({
//           chatId,
//           messages: (data.messages || []).map(normalizeMessage),
//         })
//       );
//     } catch (error) {
//       dispatch(setError(error.response?.data?.message || "Failed to load messages"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   const handleSendMessage = async ({ message, chatId }) => {
//     try {
//       dispatch(setLoading(true));
//       dispatch(setError(null));

//       const data = await sendMessageApi({ message, chatId });

//       const normalizedChat = normalizeChat(data.chat);
//       const activeChatId = normalizedChat.id;

//       dispatch(
//         upsertChat({
//           ...normalizedChat,
//           title: data.title || normalizedChat.title,
//         })
//       );

//       dispatch(setCurrentChatId(activeChatId));
//       joinChatRoom(activeChatId);

//       if (data.userMessage) {
//         dispatch(
//           addMessageToChat({
//             chatId: activeChatId,
//             message: normalizeMessage(data.userMessage),
//             title: normalizedChat.title,
//           })
//         );
//       }

//       if (data.aiMessage) {
//         dispatch(
//           addMessageToChat({
//             chatId: activeChatId,
//             message: normalizeMessage(data.aiMessage),
//             title: normalizedChat.title,
//           })
//         );
//       }
//     } catch (error) {
//       dispatch(setError(error.response?.data?.message || "Failed to send message"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   const handleDeleteChat = async (chatId) => {
//     try {
//       dispatch(setLoading(true));
//       dispatch(setError(null));

//       await deleteChatApi(chatId);

//       if (currentChatId === chatId) {
//         leaveChatRoom(chatId);
//       }

//       dispatch(removeChat(chatId));
//     } catch (error) {
//       dispatch(setError(error.response?.data?.message || "Failed to delete chat"));
//     } finally {
//       dispatch(setLoading(false));
//     }
//   };

//   const setupSocketListeners = () => {
//     const socket = getSocket();
//     if (!socket) return;

//     socket.off("message-created");

//     socket.on("message-created", ({ chatId, userMessage, aiMessage }) => {
//       if (userMessage) {
//         dispatch(
//           addMessageToChat({
//             chatId,
//             message: normalizeMessage(userMessage),
//           })
//         );
//       }

//       if (aiMessage) {
//         dispatch(
//           addMessageToChat({
//             chatId,
//             message: normalizeMessage(aiMessage),
//           })
//         );
//       }
//     });
//   };

//   const handleStartNewChat = () => {
//     if (currentChatId) {
//       leaveChatRoom(currentChatId);
//     }
//     dispatch(setCurrentChatId(null));
//     dispatch(setError(null));
//   };

//   return {
//     currentChatId,
//     chats,
//     initializeSocketConnection,
//     setupSocketListeners,
//     handleGetChats,
//     handleOpenChat,
//     handleSendMessage,
//     handleDeleteChat,
//     handleStartNewChat,
//   };
// };