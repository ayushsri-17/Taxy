import React, { useState } from "react";
import dynamic from "next/dynamic";
import styles from "../styles/component-holder.module.css";
import incomeExpenseStyles from "../styles/income-expense.module.css";

// Chart.js setup
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// SSR-safe Pie import
const Pie = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Pie),
  { ssr: false }
);

export default function IncomeExpenseManager() {
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [incomeDesc, setIncomeDesc] = useState("");
  const [incomeAmt, setIncomeAmt] = useState("");
  const [incomeCategory, setIncomeCategory] = useState("");
  const [expenseDesc, setExpenseDesc] = useState("");
  const [expenseAmt, setExpenseAmt] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("");

  const categories = [
    "Salary",
    "Freelance",
    "Investment",
    "Gift",
    "Other Income",
    "Food",
    "Transport",
    "Housing",
    "Entertainment",
    "Utilities",
    "Other Expense",
  ];

  const addIncome = (e) => {
    e.preventDefault();
    if (!incomeDesc || !incomeAmt) return;

    setIncomeList([
      ...incomeList,
      {
        id: Date.now(),
        description: incomeDesc,
        amount: parseFloat(incomeAmt),
        category: incomeCategory || "Uncategorized Income",
      },
    ]);

    setIncomeDesc("");
    setIncomeAmt("");
    setIncomeCategory("");
  };

  const addExpense = (e) => {
    e.preventDefault();
    if (!expenseDesc || !expenseAmt) return;

    setExpenseList([
      ...expenseList,
      {
        id: Date.now(),
        description: expenseDesc,
        amount: parseFloat(expenseAmt),
        category: expenseCategory || "Uncategorized Expense",
      },
    ]);

    setExpenseDesc("");
    setExpenseAmt("");
    setExpenseCategory("");
  };

  const deleteIncome = (id) => {
    setIncomeList(incomeList.filter((item) => item.id !== id));
  };

  const deleteExpense = (id) => {
    setExpenseList(expenseList.filter((item) => item.id !== id));
  };

  const totalIncome = incomeList.reduce((acc, item) => acc + item.amount, 0);
  const totalExpense = expenseList.reduce((acc, item) => acc + item.amount, 0);
  const balance = totalIncome - totalExpense;

  // Pie chart data
  const pieData = {
    labels: ["Income", "Expense"],
    datasets: [
      {
        data: [totalIncome, totalExpense],
        backgroundColor: ["#1c3f3a", "#8b0000"],
        borderWidth: 1,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <>
      <h1 className={styles.componentTitle}>Income & Expense Manager</h1>

      <div className={incomeExpenseStyles.container}>
        <h2
          className={`${incomeExpenseStyles.balance} ${
            balance >= 0
              ? incomeExpenseStyles.positive
              : incomeExpenseStyles.negative
          }`}
        >
          Balance: ₹{balance.toFixed(2)}
        </h2>

        <div className={incomeExpenseStyles.summary}>
          <h4 className={incomeExpenseStyles.incomeSummary}>
            Total Income: ₹{totalIncome.toFixed(2)}
          </h4>
          <h4 className={incomeExpenseStyles.expenseSummary}>
            Total Expense: ₹{totalExpense.toFixed(2)}
          </h4>
        </div>

        {/* ✅ PIE CHART (added, nothing removed) */}
        {(totalIncome > 0 || totalExpense > 0) && (
          <div className={incomeExpenseStyles.chartWrapper}>
            <Pie data={pieData} options={pieOptions} />
          </div>
        )}

        {/* INCOME FORM */}
        <form onSubmit={addIncome} className={incomeExpenseStyles.form}>
          <h3 className={incomeExpenseStyles.formTitle}>Add Income</h3>
          <div className={incomeExpenseStyles.formGroup}>
            <input
              type="text"
              placeholder="Description"
              value={incomeDesc}
              onChange={(e) => setIncomeDesc(e.target.value)}
              required
              className={`${incomeExpenseStyles.input} ${incomeExpenseStyles.inputDescription}`}
            />
            <input
              type="number"
              placeholder="Amount"
              value={incomeAmt}
              onChange={(e) => setIncomeAmt(e.target.value)}
              required
              className={`${incomeExpenseStyles.input} ${incomeExpenseStyles.inputAmount}`}
            />
            <select
              value={incomeCategory}
              onChange={(e) => setIncomeCategory(e.target.value)}
              className={incomeExpenseStyles.select}
            >
              <option value="">Select Category</option>
              {categories
                .filter((c) => !c.includes("Expense"))
                .map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
            <button
              type="submit"
              className={`${incomeExpenseStyles.button} ${incomeExpenseStyles.incomeButton}`}
            >
              Add Income
            </button>
          </div>
        </form>

        {/* EXPENSE FORM */}
        <form onSubmit={addExpense} className={incomeExpenseStyles.form}>
          <h3 className={incomeExpenseStyles.formTitle}>Add Expense</h3>
          <div className={incomeExpenseStyles.formGroup}>
            <input
              type="text"
              placeholder="Description"
              value={expenseDesc}
              onChange={(e) => setExpenseDesc(e.target.value)}
              required
              className={`${incomeExpenseStyles.input} ${incomeExpenseStyles.inputDescription}`}
            />
            <input
              type="number"
              placeholder="Amount"
              value={expenseAmt}
              onChange={(e) => setExpenseAmt(e.target.value)}
              required
              className={`${incomeExpenseStyles.input} ${incomeExpenseStyles.inputAmount}`}
            />
            <select
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
              className={incomeExpenseStyles.select}
            >
              <option value="">Select Category</option>
              {categories
                .filter((c) => !c.includes("Income"))
                .map((cat, i) => (
                  <option key={i} value={cat}>
                    {cat}
                  </option>
                ))}
            </select>
            <button
              type="submit"
              className={`${incomeExpenseStyles.button} ${incomeExpenseStyles.expenseButton}`}
            >
              Add Expense
            </button>
          </div>
        </form>

        {/* ✅ TRANSACTIONS (unchanged, delete buttons intact) */}
        <div className={incomeExpenseStyles.transactions}>
          <div className={incomeExpenseStyles.transactionsContainer}>
            <div className={incomeExpenseStyles.transactionColumn}>
              <h3 className={incomeExpenseStyles.transactionTitle}>
                Income Transactions
              </h3>
              <ul className={incomeExpenseStyles.transactionList}>
                {incomeList.map((item) => (
                  <li
                    key={item.id}
                    className={`${incomeExpenseStyles.transactionItem} ${incomeExpenseStyles.incomeItem}`}
                  >
                    <div>
                      <strong>{item.description}</strong>
                      <br />
                      <small>
                        {item.category} – ₹{item.amount.toFixed(2)}
                      </small>
                    </div>
                    <button
                      onClick={() => deleteIncome(item.id)}
                      className={incomeExpenseStyles.deleteButton}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className={incomeExpenseStyles.transactionColumn}>
              <h3 className={incomeExpenseStyles.transactionTitle}>
                Expense Transactions
              </h3>
              <ul className={incomeExpenseStyles.transactionList}>
                {expenseList.map((item) => (
                  <li
                    key={item.id}
                    className={`${incomeExpenseStyles.transactionItem} ${incomeExpenseStyles.expenseItem}`}
                  >
                    <div>
                      <strong>{item.description}</strong>
                      <br />
                      <small>
                        {item.category} – ₹{item.amount.toFixed(2)}
                      </small>
                    </div>
                    <button
                      onClick={() => deleteExpense(item.id)}
                      className={incomeExpenseStyles.deleteButton}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
