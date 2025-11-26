import express from "express";
import "dotenv/config";
import cors from "cors";

import authroutes from "../routes/authroutes.js";
import { connectDB } from "../lib/db.js";
import bookroutes from "../routes/bookroutes.js";

const app = express();

app.use(express.json());

app.use(cors());

app.use("/api/auth", authroutes);

app.use("/api/books", bookroutes);

const Port = process.env.Port || 3000;
const mongoURI = process.env.MONGO_URI;

(async () => {
    try {
        await connectDB(mongoURI);
        app.listen(Port, () => console.log(`Server is running on port ${Port}`));
    } catch (err) {
        console.error("Failed to start server:", err);
        process.exit(1);
    }
})();
 
