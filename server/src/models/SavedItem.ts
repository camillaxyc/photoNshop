import mongoose from "mongoose";

const SavedItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  link: String,
  price: String,
  thumbnail: String,
  createdAt: { type: Date, default: Date.now },
});

SavedItemSchema.index({ userId: 1, title: 1 });

export default mongoose.model("SavedItem", SavedItemSchema);
