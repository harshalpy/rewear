import mongoose from "mongoose";

const adminLogSchema = new mongoose.Schema({
    admin_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, enum: ["approved", "rejected"], required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    reason: { type: String },
    timestamp: { type: Date, default: Date.now }
});

const AdminLog = mongoose.model("AdminLog", adminLogSchema);
export default AdminLog;