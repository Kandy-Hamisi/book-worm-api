import express from "express";
import cors from "cors";
import "dotenv/config";

import { connectToDatabase } from "./config/db.js";

// routes imports
import userRoutes from "./routes/user.routes.js";

const app = express();

const PORT = process.env.PORT || 5000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1/users", userRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectToDatabase();
});
