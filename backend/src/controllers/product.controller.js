import Product from '../models/Product.js';

const isOwnerOrAdmin = (user, product) => {
    return user.is_admin || product.user_id.toString() === user._id.toString();
};

export const createProduct = async (req, res) => {
    try {
        const data = {
            ...req.body,
            user_id: req.user._id,
            status: 'inreview',
            approved: false,
            images: req.body.images || [],
        };

        const product = await Product.create(data);
        res.status(201).json({ product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const filter = {};
        if (req.query.category) filter.category = req.query.category;
        if (req.query.status) filter.status = req.query.status;
        if (req.query.user) filter.user_id = req.query.user;

        const products = await Product.find(filter).populate('user_id', 'name profile_image');
        res.json({ products });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).populate('user_id', 'name profile_image');
        if (!product) return res.status(404).json({ message: 'Product not found' });
        res.json({ product });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (!isOwnerOrAdmin(req.user, product)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const updates = { ...req.body };
        delete updates.user_id;
        delete updates.approved;

        Object.assign(product, updates);
        await product.save();

        res.json({ product });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        if (!isOwnerOrAdmin(req.user, product)) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        await product.deleteOne();
        res.json({ message: 'Product deleted' });
    } 
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};
