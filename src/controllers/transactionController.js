import { sql } from "../config/db.js";

export const getTransactions = async (req, res) => {
  const { user_id } = req.params;
  try {
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id = ${user_id} ORDER BY created_at DESC`;
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || !amount || !category) {
      return res.status(400).json({ error: "All fields are required" });
    }
    const transaction = await sql`
            INSERT INTO transactions (user_id, title, amount, category)
            VALUES (${user_id}, ${title}, ${amount}, ${category})
            RETURNING *
        `;
    res
      .status(201)
      .json({ message: "Transaction created successfully", transaction });
  } catch (error) {
    console.error("Error Creating transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    await sql`DELETE FROM transactions WHERE id = ${id}`;
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getTransactionSummary = async (req, res) => {
  const { user_id } = req.params;
  try {
    const balance =
      await sql`SELECT COALESCE(sum(amount),0) as balance FROM transactions WHERE user_id = ${user_id}`;
    const income =
      await sql`SELECT COALESCE(sum(amount),0) as income FROM transactions WHERE user_id = ${user_id} AND amount > 0`;
    const expense =
      await sql`SELECT COALESCE(sum(amount),0) as expense FROM transactions WHERE user_id = ${user_id} AND amount < 0`;
    res.status(200).json({
      balance: balance[0].balance,
      income: income[0].income,
      expense: expense[0].expense,
    });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
