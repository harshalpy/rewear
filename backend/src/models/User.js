import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password_hash: { type: String, required: true },
    profile_image: { type: String },
    points: { type: Number, default: 0 },
    is_admin: { type: Boolean, default: false },
} , { timestamps: true });

const User = mongoose.model("User", userSchema);
export default User;