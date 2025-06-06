import mongoose from "mongoose";
const ItemSchema = new mongoose.Schema({
    description: { type: String, required: true, text: true },
    createdAt: { type: Date, default: Date.now },
});
export default mongoose.model("Item", ItemSchema);
