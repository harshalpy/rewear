import mongoose from 'mongoose';

const ConnectMongodb = async () => {
    const MongoUrl = process.env.MONGODB_URI;
    try {
        await mongoose.connect(MongoUrl);
        console.log('Connected to MongoDB');
    } 
    catch (error) {
        console.error('Failed to connect to MongoDB:', error);
    }
};

export default ConnectMongodb;