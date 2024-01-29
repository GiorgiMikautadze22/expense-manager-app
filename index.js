/*
შევქმნათ expense-manager აპლიკაციის ენდფოინთები express-ის დახმარებით.
დამატება, განახლება, წაკითხვა, წაშლა (ვგულისხმობთ REST API endpoint_ებს). 
ხარჯის ობიექტს უნდა ქონდეს შემდეგი ველები:
id, name, cost, createdAt
expense-manager აპლიკაციაში დავამატოთ დინამიური გვერდი, 
სადაც სერვერი დააბრუნებს ხარჯს id-ის დახმარებით (იგულისხმება html გვერდი)
*/

const express = require("express");
const fs = require("fs").promises;

const app = express();

let expenseManager = [
  {
    id: 1,
    name: "Groceries",
    cost: 200,
    createdAt: "2021-01-01",
  },
  {
    id: 2,
    name: "Rent",
    cost: 1000,
    createdAt: "2021-01-01",
  },
];

app.use(express.json());

app.get("/api/expenses", (req, res) => {
  res.json({ success: true, data: expenseManager });
});

app.get("/api/expenses/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = expenseManager.findIndex(
    (expense) => expense.id === parseInt(id)
  );

  if (index === -1) {
    res.status(404);
    res.json({ success: false, message: "Expense not found" });
  }

  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body>
      <p>${JSON.stringify(expenseManager[index])}</p>
    </body>
  </html>`;

  res.setHeader("Content-Type", "text/html");

  res.send(htmlContent);
});

app.post("/api/expenses", (req, res) => {
  const expense = req.body;
  const lastId = expenseManager[expenseManager.length - 1]?.id;
  expense.id = lastId ? lastId + 1 : 1;
  expenseManager.push(expense);
  res.send({ success: true, data: expenseManager, message: "expense added" });
});

app.delete("/api/expenses/:id", (req, res) => {
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
});

app.put("/api/expenses/:id", (req, res) => {
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
  res.json({ success: true, data: expense, message: "expense changed" });
});

app.listen(3000, () => {
  console.log("Server is running on port: http://localhost:3000");
});

//1. შევქმნა GET endpoint, რომელოც /api/expenses -დან წამოიღებს json-ს -----
//2. /expenses/:id გადასვლისას გამოიტანოს ხმოლოდ შესაბამისი id-ის ობიექტი html ფაილი, GET მეთოდით.-----
//3. შევქმნა POST endpoint, რომელიც /expenses url-ზე შექმნის ახალ ობიექტს.-------
//4. შევქმნა DELETE endpoint, რომელიც /expenses/:id-ზე წაშლის შესაბამისი id-ის ობიექტს.-----
//5. შევქმნა PUT endpoint, რომელიც /expenses/:id-ზე გაანახლებს შესაბამისი id-ის ობიექტს. ----
