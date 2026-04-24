import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

export async function generateResponse(messages) {
  const llmMessages = [
    new SystemMessage(`
You are a helpful AI assistant.
Answer in markdown.
Keep answers clear and practical.
If coding is asked, give clean examples.
At the end, suggest 3 short follow-up questions.
Return plain text only.
`),
    ...messages.map((msg) => {
      if (msg.role === "user") return new HumanMessage(msg.content);
      return new AIMessage(msg.content);
    }),
  ];

  const response = await geminiModel.invoke(llmMessages);
  const text = response?.content?.toString?.() || response?.text || "Sorry, I could not generate a response.";

  const suggestions = extractSuggestions(text);

  return {
    content: text,
    sources: [],
    suggestions,
    status: "done",
  };
}

export async function generateChatTitle(message) {
  const response = await mistralModel.invoke([
    new SystemMessage(`
You generate concise chat titles.
Rules:
- 2 to 4 words
- No quotes
- No punctuation at the end
- Clear and relevant
`),
    new HumanMessage(`First message: ${message}`),
  ]);

  return cleanTitle(response?.content?.toString?.() || response?.text || "New Chat");
}

function cleanTitle(title) {
  return title.replace(/["'\n]/g, "").trim().slice(0, 60) || "New Chat";
}

function extractSuggestions(text) {
  const defaults = [
    "Explain with example",
    "Make it simpler",
    "Give production code",
  ];

  const lines = text
    .split("\n")
    .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
    .filter(Boolean);

  const guessed = lines
    .filter((line) => line.length > 8 && line.length < 60 && /\?$/.test(line))
    .slice(0, 3);

  return guessed.length ? guessed : defaults;
}



// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// import { ChatMistralAI } from '@langchain/mistralai'
// import { HumanMessage, SystemMessage, AIMessage } from 'langchain'

// // Gemini AI
// const geminiModel = new ChatGoogleGenerativeAI({
//   model: "gemini-2.5-flash-lite",
//   apiKey: process.env.GEMINI_API_KEY
// });


// // Mistral AI
// const mistralModel = new ChatMistralAI({
//     model: "mistral-small-latest",
//     apiKey: process.env.MISTRAL_API_KEY
// });

// export async function generateResponse(messages) {
//     const llmMessages = [
//         new SystemMessage(`
//     You are a helpful AI assistant.
//     Answer in markdown.
//     Keep answers clear and practical.
//     If coding is asked, give clean examples.
//     At the end, suggest 3 short follow-up questions.
//     Return plain text only.
//     `),
//     ...messages.map((msg) => {
//         if (msg.role === "user") return new HumanMessage(msg.content);
//         return new AIMessage(msg.content);
//     }),
//     ];

//   const response = await geminiModel.invoke(llmMessages);
//   const text = response?.content?.toString?.() || response?.text || "Sorry, I could not generate a response.";

//   const suggestions = extractSuggestions(text);

//   return {
//     content: text,
//     sources: [],
//     suggestions,
//     status: "done",
//   };
// }

// export async function generateChatTitle(message) {
//     const response = await mistralModel.invoke([
//         new SystemMessage(`
//     You generate concise chat titles.
//     Rules:
//     - 2 to 4 words
//     - No quotes
//     - No punctuation at the end
//     - Clear and relevant
//     `),
//         new HumanMessage(`First message: ${message}`),
//     ]);

//     return cleanTitle(response?.content?.toString?.() || response?.text || "New Chat");
// }

// function cleanTitle(title) {
//   return title.replace(/["'\n]/g, "").trim().slice(0, 60) || "New Chat";
// }

// function extractSuggestions(text) {
//   const defaults = [
//     "Explain with example",
//     "Make it simpler",
//     "Give production code",
//   ];

//   const lines = text
//     .split("\n")
//     .map((line) => line.replace(/^[-*\d.\s]+/, "").trim())
//     .filter(Boolean);

//   const guessed = lines
//     .filter((line) => line.length > 8 && line.length < 60 && /\?$/.test(line))
//     .slice(0, 3);

//   return guessed.length ? guessed : defaults;
// }














// // export async function generateResponse(messages) {
    
// //     const response = await geminiModel.invoke(messages.map(msg => {
// //         if (msg.role == "user") {
// //             return new HumanMessage(msg.content)
// //         }else if (msg.role == "ai") {
// //             return new AIMessage(msg.content)
// //         }
// //     }));

// //     return response.text;
// // }

// // export async function generateChatTitle(message) {
     
// //     const response = await mistralModel.invoke([
// //         new SystemMessage(`  
// //             You are a helpful assistant that generates concise and descriptive titles for chat conversations.  
// //             User will provide you with the first message of a chat conversation, and you will generate a title that captures the essence of the conversation in 2-4 words. The title should be clear, relevant, and engaging, 
// //             giving users a quick understanding of the chat's topic.   
// //             `),

// //         new HumanMessage(`
// //             Generate a title for a chat conversation based on the following first message:
// //             "${message}"
// //             `)
// //     ])

// //     return response.text;
// // }


