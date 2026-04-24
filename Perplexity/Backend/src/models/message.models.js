import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema(
  {
    title: { type: String, trim: true },
    url: { type: String, trim: true },
    snippet: { type: String, trim: true },
  },
  { _id: false }
);

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "ai"],
      required: true,
    },
    sources: {
      type: [sourceSchema],
      default: [],
    },
    suggestions: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["pending", "streaming", "done", "error"],
      default: "done",
    },
  },
  { timestamps: true }
);

const messageModel = mongoose.model("Message", messageSchema);

export default messageModel;




// import mongoose from "mongoose";

// const messageSchema = new mongoose.Schema(
//   {
//     chat: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Chat",
//       required: true,
//     },
//     content: {
//       type: String,
//       required: true,
//     },
//     role: {
//       type: String,
//       enum: ["user", "ai"],
//       required: true,
//     },
//     sources: [
//       {
//         title: { type: String, default: "" },
//         url: { type: String, default: "" },
//         snippet: { type: String, default: "" },
//       },
//     ],
//     suggestions: [
//       {
//         type: String,
//       },
//     ],
//     status: {
//       type: String,
//       enum: ["pending", "done", "error"],
//       default: "done",
//     },
//   },
//   { timestamps: true }
// );

// messageSchema.set("toJSON", {
//   virtuals: true,
//   versionKey: false,
//   transform: (_, ret) => {
//     ret.id = ret._id.toString();
//     delete ret._id;
//   },
// });

// const messageModel = mongoose.model("Message", messageSchema);

// export default messageModel;