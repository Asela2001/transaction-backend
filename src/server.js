import express from "express";
import dotenv from "dotenv";
import { initDB, sql } from "./config/db.js";
import transactionRoute from "./routes/transactionRoute.js";
import rateLimiter from "./midleware/rateLimiter.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware setup section
app.use(rateLimiter);
app.use(express.json());


// API helth check
app.get("/", (req, res) => {
  res.send("Hello, World!");
});


// api connecting point
app.use("/api/transactions", transactionRoute);


// After initializing the database, start the server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
