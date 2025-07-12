import Product from "../models/Product.js";
import AdminLog from "../models/AdminLog.js";

export const listPendingItems = async (req, res) => {
    try {
        const items = await Product.find({ approved: false });
        res.json({ items });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const approveItem = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.approved = true;
        product.status = 'available';
        await product.save();

        await AdminLog.create({ admin_id: req.user._id, action: 'approved', product: product._id, reason: 'Approved via admin panel' });

        res.json({ product });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const rejectItem = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        product.approved = false;
        product.status = 'inreview';
        await product.save();

        const { reason } = req.body;
        await AdminLog.create({ admin_id: req.user._id, action: 'rejected', product: product._id, reason: reason || 'No reason provided' });

        res.json({ product });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const removeProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });
        await product.deleteOne();

        await AdminLog.create({ admin_id: req.user._id, action: 'deleted', product: product._id, reason: 'Removed by admin' });

        res.json({ message: 'Product removed' });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const viewAdminLogs = async (req, res) => {
    try {
        const logs = await AdminLog.find().populate('product', 'title').populate('admin_id', 'name');
        res.json({ logs });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};