import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const ConnectDb = async () => {
    try {
        const uri = process.env.CONNECTION_STRING;
        if (!uri) {
            throw new Error('CONNECTION_STRING environment variable is not set');
        }
        const connect = await mongoose.connect(uri, {
        });
        console.log("Database connected successfully", connect.connection.name);
    } catch (error) {
        console.log("Error in connecting to database", error);
        process.exit(1);
    }
};