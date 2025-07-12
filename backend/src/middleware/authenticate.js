import jwt from 'jsonwebtoken';
import User from '../Models/user.js';

export const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password_hash');
        if (!user) return res.status(401).json({ message: 'User not found' });

        req.user = user;
        next();
    }
    catch (err) {
        console.error(err);
        res.status(401).json({ message: 'Invalid token' });
    }
};

export const adminMiddleware = (req, res, next) => {
    if (!req.user || !req.user.is_admin) {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};