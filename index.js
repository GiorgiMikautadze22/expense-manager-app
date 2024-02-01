/*
შევქმნათ expense-manager აპლიკაციის ენდფოინთები express-ის დახმარებით.
დამატება, განახლება, წაკითხვა, წაშლა (ვგულისხმობთ REST API endpoint_ებს). 
ხარჯის ობიექტს უნდა ქონდეს შემდეგი ველები:
id, name, cost, createdAt
expense-manager აპლიკაციაში დავამატოთ დინამიური გვერდი, 
სადაც სერვერი დააბრუნებს ხარჯს id-ის დახმარებით (იგულისხმება html გვერდი)
*/

// 1.დავწეროთ middleware, რომელიც ყოველ რიქვესთზე დალოგავს მომხმარებლის user agent-ს.

// 2.მსმენელი აწყობს დინამიურ გვერდს, რომელიც id-ით წამოიღებს კონკრეტული ხარჯის ობიექტს.

// 3.მსმენელი აწყობს view გვერდს, რომელიც დაარენდერებს ყველა დამატებულ ხარჯს.

const express = require("express");
const fs = require("fs").promises;

const useAgentMiddleware = require("./middlewares/useAgent");
const expensesRoutes = require("./expenses/expensesRoutes");
const app = express();

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

app.use(express.json());
app.set("view engine", "ejs");
app.use("/expenses", expensesRoutes);
app.use(useAgentMiddleware);

app.get("/api/expenses", async (req, res) => {
  try {
    const expenseManager = await readExpenseManager();

    res.render("index", { expenseManager });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
});

app.get("/expenses/:id", async (req, res) => {
  try {
    const expenseManager = await readExpenseManager();
    const id = parseInt(req.params.id);
    const index = expenseManager.findIndex((expense) => expense.id === id);

    if (index === -1) {
      res.status(404).json({ success: false, message: "Expense not found" });
    }

    const expense = expenseManager[index];

    res.json({ success: true, data: expense });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
});

app.post("/api/expenses", async (req, res) => {
  try {
    const expenseManager = await readExpenseManager();
    const expense = req.body;
    const lastId = expenseManager[expenseManager.length - 1]?.id;
    expense.id = lastId ? lastId + 1 : 1;
    expenseManager.push(expense);

    res.send({ success: true, data: expenseManager, message: "expense added" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
});

app.delete("/api/expenses/:id", async (req, res) => {
  try {
    const expenseManager = await readExpenseManager();
    const { id } = req.params;
    console.log(id);

    const index = expenseManager.findIndex(
      (expense) => expense.id === parseInt(id)
    );

    if (index === -1) {
      res.status(404);
      res.json({ success: false, message: "Expense doesn't exists" });
    }
    const expense = expenseManager[index];
    expenseManager = expenseManager.filter(
      (expense) => expense.id !== parseInt(id)
    );

    res.json({ success: true, data: expense, message: "expense deleted" });
    console.log(expenseManager);
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
});

app.put("/api/expenses/:id", async (req, res) => {
  try {
    const expenseManager = await readExpenseManager();
    const changeExpense = req.body;
    const { id } = req.params;
    const index = expenseManager.findIndex((exp) => exp.id === parseInt(id));
    if (index === -1) {
      res.status(404);
      res.json({ success: false, message: "Expense not found" });
    }
    let expense = expenseManager[index];
    expense = {
      ...expense,
      ...changeExpense,
    };
    expenseManager[index] = expense;
    res.json({ success: true, data: expense, message: "expense deleted" });
  } catch (error) {
    res.json({ success: false, message: "Error" });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port: http://localhost:3000");
});

//1. შევქმნა GET endpoint, რომელოც /api/expenses -დან წამოიღებს json-ს -----
//2. /expenses/:id გადასვლისას გამოიტანოს ხმოლოდ შესაბამისი id-ის ობიექტი html ფაილი, GET მეთოდით.-----
//3. შევქმნა POST endpoint, რომელიც /expenses url-ზე შექმნის ახალ ობიექტს.-------
//4. შევქმნა DELETE endpoint, რომელიც /expenses/:id-ზე წაშლის შესაბამისი id-ის ობიექტს.-----
//5. შევქმნა PUT endpoint, რომელიც /expenses/:id-ზე გაანახლებს შესაბამისი id-ის ობიექტს. ----
