import chatModel from "../models/chat.models.js";
import messageModel from "../models/message.models.js";
import { generateChatTitle, generateResponse } from "../services/ai.service.js";
import { getIO } from "../socket.io/server.socket.js";
import asyncHandler from "../middlewares/asyncHandler.js";

const normalizeMessage = (messageDoc) => ({
  id: String(messageDoc._id),
  chatId: String(messageDoc.chat),
  content: messageDoc.content,
  role: messageDoc.role,
  sources: messageDoc.sources || [],
  suggestions: messageDoc.suggestions || [],
  status: messageDoc.status,
  createdAt: messageDoc.createdAt,
  updatedAt: messageDoc.updatedAt,
});

const normalizeChat = (chatDoc, messages = []) => ({
  id: String(chatDoc._id),
  title: chatDoc.title,
  messages,
  createdAt: chatDoc.createdAt,
  updatedAt: chatDoc.updatedAt,
});

export const sendMessage = asyncHandler(async (req, res) => {
  const { message, chatId } = req.body;

  if (!message?.trim()) {
    return res.status(400).json({
      message: "Message is required",
    });
  }

  let activeChat;
  let title = null;

  if (!chatId) {
    title = await generateChatTitle(message);

    activeChat = await chatModel.create({
      user: req.user.id,
      title,
    });
  } else {
    activeChat = await chatModel.findOne({
      _id: chatId,
      user: req.user.id,
    });

    if (!activeChat) {
      return res.status(404).json({
        message: "Chat not found",
      });
    }
  }

  const userMessageDoc = await messageModel.create({
    chat: activeChat._id,
    content: message.trim(),
    role: "user",
  });

  const history = await messageModel
    .find({ chat: activeChat._id })
    .sort({ createdAt: 1 });

  const result = await generateResponse(history);

  const aiMessageDoc = await messageModel.create({
    chat: activeChat._id,
    content: result.content,
    role: "ai",
    sources: result.sources || [],
    suggestions: result.suggestions || [],
    status: result.status || "done",
  });

  const userMessage = normalizeMessage(userMessageDoc);
  const aiMessage = normalizeMessage(aiMessageDoc);

  try {
    const io = getIO();
    io.to(String(activeChat._id)).emit("message-created", {
      chatId: String(activeChat._id),
      userMessage,
      aiMessage,
    });
  } catch (error) {
    console.log("Socket emit skipped:", error.message);
  }

  return res.status(201).json({
    message: "Message sent successfully",
    chat: normalizeChat(activeChat),
    title: activeChat.title,
    userMessage,
    aiMessage,
  });
});

export const getChats = asyncHandler(async (req, res) => {
  const chats = await chatModel
    .find({ user: req.user.id })
    .sort({ updatedAt: -1 });

  const formattedChats = {};

  chats.forEach((chat) => {
    formattedChats[String(chat._id)] = normalizeChat(chat, []);
  });

  return res.status(200).json({
    message: "Chats retrieved successfully",
    chats: formattedChats,
  });
});

export const getMessages = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const chat = await chatModel.findOne({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  const messages = await messageModel
    .find({ chat: chatId })
    .sort({ createdAt: 1 });

  return res.status(200).json({
    message: "Messages retrieved successfully",
    chat: normalizeChat(chat, messages.map(normalizeMessage)),
  });
});

export const deleteChat = asyncHandler(async (req, res) => {
  const { chatId } = req.params;

  const chat = await chatModel.findOneAndDelete({
    _id: chatId,
    user: req.user.id,
  });

  if (!chat) {
    return res.status(404).json({
      message: "Chat not found",
    });
  }

  await messageModel.deleteMany({
    chat: chatId,
  });

  return res.status(200).json({
    message: "Chat deleted successfully",
    chatId,
  });
});



// import { generateChatTitle, generateResponse } from "../services/ai.service.js";
// import chatModel from "../models/chat.models.js";
// import messageModel from "../models/message.models.js";

// const normalizeMessage = (messageDoc) => ({
//   id: messageDoc._id?.toString?.() || messageDoc.id,
//   content: messageDoc.content,
//   role: messageDoc.role,
//   createdAt: messageDoc.createdAt,
//   updatedAt: messageDoc.updatedAt,
// });

// const normalizeChat = (chatDoc) => ({
//   id: chatDoc._id?.toString?.() || chatDoc.id,
//   title: chatDoc.title,
//   createdAt: chatDoc.createdAt,
//   updatedAt: chatDoc.updatedAt,
// });

// export async function sendMessage(req, res, next) {
//   try {
//     const { message, chatId } = req.body;

//     if (!message?.trim()) {
//       return res.status(400).json({
//         message: "Message is required",
//       });
//     }

//     let activeChat = null;
//     let title = null;

//     if (!chatId) {
//       title = await generateChatTitle(message);

//       activeChat = await chatModel.create({
//         user: req.user.id,
//         title,
//       });
//     } else {
//       activeChat = await chatModel.findOne({
//         _id: chatId,
//         user: req.user.id,
//       });

//       if (!activeChat) {
//         return res.status(404).json({
//           message: "Chat not found",
//         });
//       }
//     }

//     const userMessage = await messageModel.create({
//       chat: activeChat._id,
//       content: message,
//       role: "user",
//     });

//     const messages = await messageModel
//       .find({ chat: activeChat._id })
//       .sort({ createdAt: 1 });

//     const result = await generateResponse(messages);

//     const aiMessage = await messageModel.create({
//       chat: activeChat._id,
//       content: result,
//       role: "ai",
//     });

//     return res.status(201).json({
//       message: "Message sent successfully",
//       title: activeChat.title,
//       chat: normalizeChat(activeChat),
//       userMessage: normalizeMessage(userMessage),
//       aiMessage: normalizeMessage(aiMessage),
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function getChats(req, res, next) {
//   try {
//     const chats = await chatModel
//       .find({ user: req.user.id })
//       .sort({ updatedAt: -1 });

//     const normalizedChats = {};

//     chats.forEach((chat) => {
//       const normalized = normalizeChat(chat);
//       normalizedChats[normalized.id] = {
//         ...normalized,
//         messages: [],
//       };
//     });

//     return res.status(200).json({
//       message: "Chats retrieved successfully",
//       chats: normalizedChats,
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function getMessages(req, res, next) {
//   try {
//     const { chatId } = req.params;

//     const chat = await chatModel.findOne({
//       _id: chatId,
//       user: req.user.id,
//     });

//     if (!chat) {
//       return res.status(404).json({
//         message: "Chat not found",
//       });
//     }

//     const messages = await messageModel
//       .find({ chat: chatId })
//       .sort({ createdAt: 1 });

//     return res.status(200).json({
//       message: "Messages retrieved successfully",
//       chat: normalizeChat(chat),
//       messages: messages.map(normalizeMessage),
//     });
//   } catch (error) {
//     next(error);
//   }
// }

// export async function deleteChat(req, res, next) {
//   try {
//     const { chatId } = req.params;

//     const chat = await chatModel.findOneAndDelete({
//       _id: chatId,
//       user: req.user.id,
//     });

//     if (!chat) {
//       return res.status(404).json({
//         message: "Chat not found",
//       });
//     }

//     await messageModel.deleteMany({
//       chat: chatId,
//     });

//     return res.status(200).json({
//       message: "Chat deleted successfully",
//     });
//   } catch (error) {
//     next(error);
//   }
// }