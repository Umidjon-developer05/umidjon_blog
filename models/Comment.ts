// models/Comment.ts
import mongoose, { Schema, model, models } from "mongoose";

const commentSchema = new Schema(
  {
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    postId: { type: String, required: true },
  },
  { timestamps: true }
);

// ⚠️ Dev muhitida eski noto'g'ri schema qolib ketganda, majburan yangilaymiz:
if (mongoose.models.Comment) {
  delete mongoose.models.Comment;
}

const Comment = models.Comment || model("Comment", commentSchema);

export default Comment;
