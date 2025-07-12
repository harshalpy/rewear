import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    category: { type: String, enum: ["men", "women", "unisex", "kids", "winter", "summer", "spring", "autumn", "formal", "casual", "party", "ethnic", "activewear", "workwear", "sleepwear", "accessories", "footwear", "maternity", "outerwear", "vintage"], required: true },
    size: { type: String, required: true },
    condition: { type: String, enum: ["new", "like_new", "used", "worn"], required: true },
    images: [{ type: String }],
    status: { type: String, enum: ["available", "swapped", "inreview"], default: "inreview" },
    approved: { type: Boolean, default: false },
}, { timestamps: true });

const Product = mongoose.model("Product", productSchema);
export default Product;