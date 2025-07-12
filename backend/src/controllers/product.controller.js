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
        const { category , status , user, size, condition, tags,search,} = req.query;

        const filter = {};

        if (category) {
            const cats = category.split(',');
            filter.category = cats.length > 1 ? { $in: cats } : cats[0];
        }

        if (status) filter.status = status;
        if (user) filter.user_id = user;
        if (size) filter.size = size;
        if (condition) filter.condition = condition;

        if (tags) {
            const tagArr = tags.split(',');
            filter.tags = { $in: tagArr };
        }

        if (search) {
            filter.$text = { $search: search };
        }

        const page = parseInt(req.query.page ?? '1', 10);
        const limit = parseInt(req.query.limit ?? '20', 10);
        const skip = (page - 1) * limit;

        const sortBy = req.query.sortBy || '-createdAt';

        const products = await Product.find(filter)
            .populate('user_id', 'name profile_image')
            .sort(sortBy)
            .skip(skip)
            .limit(limit);

        const total = await Product.countDocuments(filter);

        res.json({ total, page, limit, products });
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
