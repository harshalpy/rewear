import User from "../Models/user.js";
import PointHistory from "../Models/pointHistory.js";

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password_hash');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUser = async (req, res) => {
    try {
        if (req.user._id.toString() !== req.params.id && !req.user.is_admin) {
            return res.status(403).json({ message: 'Unauthorized to update user' });
        }

        const updates = req.body;

        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password_hash');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUserPoints = async (req, res) => {
    try {
        if (req.user._id.toString() !== req.params.id && !req.user.is_admin) {
            return res.status(403).json({ message: 'Unauthorized to view point history' });
        }

        const history = await PointHistory.find({ user_id: req.params.id }).sort({ timestamp: -1 });
        res.json({ history });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        if (!req.user.is_admin) {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const users = await User.find().select('-password_hash');
        res.json({ users });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


export const uploadProfileImage = async (req, res) => {
    try {
        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: 'No image uploaded' });
        }

        if (req.user._id.toString() !== req.params.id && !req.user.is_admin) {
            return res.status(403).json({ message: 'Unauthorized' });
        }

        const user = await User.findByIdAndUpdate(
            req.params.id,
            { profile_image: req.file.path },
            { new: true }
        ).select('-password_hash');

        res.json({ user, message: 'Profile image updated' });
    } catch (err) {
        console.error("Error in uploadProfileImage:", err);
        res.status(500).json({ message: 'Server error' });
    }
};
