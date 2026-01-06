import mongoose, { Schema } from "mongoose";

const noteSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    }
  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);
