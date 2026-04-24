import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "New Chat",
      trim: true,
    },
  },
  { timestamps: true }
);

const chatModel = mongoose.model("Chat", chatSchema);

export default chatModel;









// import mongoose from "mongoose";

// const chatSchema = new mongoose.Schema(
//   {
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//     },
//     title: {
//       type: String,
//       default: "New Chat",
//       trim: true,
//     },
//   },
//   { timestamps: true }
// );

// chatSchema.set("toJSON", {
//   virtuals: true,
//   versionKey: false,
//   transform: (_, ret) => {
//     ret.id = ret._id.toString();
//     delete ret._id;
//   },
// });

// const chatModel = mongoose.model("Chat", chatSchema);

// export default chatModel;