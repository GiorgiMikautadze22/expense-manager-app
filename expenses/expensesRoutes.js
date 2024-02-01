const { Router } = require("express");
const fs = require("fs/promises");

const expensesRouter = Router();

async function readExpenseManager() {
  try {
    const data = await fs.readFile("./data.json", "utf-8");
    const expenseManager = JSON.parse(data);
    return expenseManager;
  } catch (error) {
    console.error("Error reading file:", error);
    throw error;
  }
}

expensesRouter.get("/:id", async (req, res) => {
  try {
    const expenseManager = await readExpenseManager();
    const id = parseInt(req.params.id);
    const index = expenseManager.findIndex((expense) => expense.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: "Expense not found" });
    }

    const expense = expenseManager[index];

    res.render("script", { expense });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
});

module.exports = expensesRouter;
