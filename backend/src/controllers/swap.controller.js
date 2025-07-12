import Swap from '../models/swap.js';

const isParticipant = (user, swap) => {
    return swap.requester_id.toString() === user._id.toString() || swap.owner_id.toString() === user._id.toString();
};

export const createSwap = async (req, res) => {
    try {
        const { item_requested, offered_item, is_point_swap, points_used } = req.body;

        if (!item_requested) return res.status(400).json({ message: 'item_requested is required' });

        const requestedProduct = await Product.findById(item_requested);
        if (!requestedProduct || requestedProduct.status !== 'available') {
            return res.status(400).json({ message: 'Requested item not available' });
        }

        if (requestedProduct.user_id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot request your own item' });
        }

        let offeredProduct = null;
        if (!is_point_swap) {
            if (!offered_item) return res.status(400).json({ message: 'offered_item required for direct swap' });
            offeredProduct = await Product.findById(offered_item);
            if (!offeredProduct || offeredProduct.status !== 'available') {
                return res.status(400).json({ message: 'Offered item not available' });
            }
        }

        if (is_point_swap && req.user.points < points_used) {
            return res.status(400).json({ message: 'Insufficient points' });
        }

        const swap = await Swap.create({
            item_requested,
            offered_item: offered_item || null,
            requester_id: req.user._id,
            owner_id: requestedProduct.user_id,
            is_point_swap: !!is_point_swap,
            points_used: is_point_swap ? points_used : 0,
        });

        if (is_point_swap) {
            req.user.points -= points_used;
            await req.user.save();
            await PointHistory.create({ user_id: req.user._id, change: -points_used, reason: `Requested item ${item_requested}` });
        }

        res.status(201).json({ swap });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserSwaps = async (req, res) => {
    try {
        const swaps = await Swap.find({
            $or: [{ requester_id: req.user._id }, { owner_id: req.user._id }],
        }).populate('item_requested offered_item');
        res.json({ swaps });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getSwapById = async (req, res) => {
    try {
        const swap = await Swap.findById(req.params.id).populate('item_requested offered_item');
        if (!swap) return res.status(404).json({ message: 'Swap not found' });
        if (!isParticipant(req.user, swap)) return res.status(403).json({ message: 'Unauthorized' });
        res.json({ swap });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const acceptSwap = async (req, res) => {
    try {
        const swap = await Swap.findById(req.params.id);
        if (!swap) return res.status(404).json({ message: 'Swap not found' });
        if (swap.owner_id.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Only owner can accept' });
        if (swap.status !== 'pending') return res.status(400).json({ message: 'Swap not in pending state' });

        swap.status = 'accepted';
        await swap.save();

        res.json({ swap });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const declineSwap = async (req, res) => {
    try {
        const swap = await Swap.findById(req.params.id);
        if (!swap) return res.status(404).json({ message: 'Swap not found' });
        if (swap.owner_id.toString() !== req.user._id.toString()) return res.status(403).json({ message: 'Only owner can decline' });
        if (swap.status !== 'pending') return res.status(400).json({ message: 'Swap not in pending state' });

        swap.status = 'declined';
        await swap.save();

        if (swap.is_point_swap) {
            const user = await User.findById(swap.requester_id);
            user.points += swap.points_used;
            await user.save();
            await PointHistory.create({ user_id: user._id, change: swap.points_used, reason: `Refund from declined swap ${swap._id}` });
        }

        res.json({ swap });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const completeSwap = async (req, res) => {
    try {
        const swap = await Swap.findById(req.params.id);
        if (!swap) return res.status(404).json({ message: 'Swap not found' });
        if (!isParticipant(req.user, swap)) return res.status(403).json({ message: 'Unauthorized' });
        if (swap.status !== 'accepted') return res.status(400).json({ message: 'Swap must be accepted first' });

        const requestedProduct = await Product.findById(swap.item_requested);
        requestedProduct.status = 'swapped';
        await requestedProduct.save();

        if (swap.offered_item) {
            const offeredProduct = await Product.findById(swap.offered_item);
            offeredProduct.status = 'swapped';
            await offeredProduct.save();
        }

        swap.status = 'completed';
        await swap.save();

        res.json({ swap });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};