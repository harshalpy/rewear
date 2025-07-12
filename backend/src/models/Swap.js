import mongoose from "mongoose";

const swapSchema = new mongoose.Schema({
    item_requested: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    offered_item: { type: mongoose.Schema.Types.ObjectId, ref: "Item" },
    requester_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    owner_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted", "declined", "completed"], default: "pending" },
    is_point_swap: { type: Boolean, default: false },
    points_used: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
});

const Swap = mongoose.model("Swap", swapSchema);
export default Swap;