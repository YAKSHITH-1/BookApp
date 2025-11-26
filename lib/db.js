import mongoose from "mongoose";


export const connectDB = async (mongoURI) => { 
    

    try {
        const conn = await mongoose.connect(mongoURI);
        console.log("Database connected:", conn.connection?.host || "(unknown host)");
        return conn;
    } catch (err) {
        console.error("Database connection error:", err);
        throw err;
    }
};