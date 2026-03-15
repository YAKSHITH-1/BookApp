import express from "express";
import cors from "cors";
import "dotenv/config";
import job from "../lib/cron.js";


import authRoutes from "../routes/authroutes.js";
import bookRoutes from "../routes/bookroutes.js";

import { connectDB } from "../lib/db.js";

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI = process.env.MONGO_URI;

(async () => {
  try {
    await connectDB(mongoURI);
    job.start();

   
    app.use(express.json({ limit: '10mb' }));
    app.use(cors());

    app.use("/api/auth", authRoutes);
    app.use("/api/books", bookRoutes);
    //hello

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();