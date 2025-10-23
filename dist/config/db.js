import mongoose from 'mongoose';
const MONGO_URI = process.env.DATABASE_URL;
export const connectToDatabase = async () => {
    if (!MONGO_URI)
        throw new Error('MONGO_URI is not defined');
    try {
        const conn = await mongoose.connect(MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
};
//# sourceMappingURL=db.js.map