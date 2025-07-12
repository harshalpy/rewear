import mongoose from "mongoose";

const pointHistorySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    change: { type: Number, required: true },
    reason: { type: String },
    timestamp: { type: Date, default: Date.now }
});

const PointHistory = mongoose.model("PointHistory", pointHistorySchema);
export default PointHistory;