import express from "express";
import { sql } from "../config/db.js";
import {
  createTransaction,
  deleteTransaction,
  getTransactions,
  getTransactionSummary,
} from "../controllers/transactionController.js";

const router = express.Router();

router.get("/:user_id", getTransactions);

router.post("/", createTransaction);

router.delete("/:id", deleteTransaction);

router.get("/summary/:user_id", getTransactionSummary);

export default router;
