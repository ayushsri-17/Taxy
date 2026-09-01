import React, { useState, useEffect } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import styles from "../styles/income-expense.module.css";

// Chart.js setup
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

// SSR-safe Doughnut import
const Doughnut = dynamic(
  () => import("react-chartjs-2").then((mod) => mod.Doughnut),
  { ssr: false }
);

const CATEGORIES = {
  income: [
    { label: "Salary / CTC", defaultTag: "taxable" },
    { label: "Freelancing & Consulting", defaultTag: "taxable" },
    { label: "Investments & Dividends", defaultTag: "taxable" },
    { label: "Rental Income", defaultTag: "taxable" },
    { label: "Gifts / Inheritances", defaultTag: "exempt" },
    { label: "Other Income", defaultTag: "taxable" },
  ],
  expense: [
    { label: "Software & Tech Subscriptions", defaultTag: "deductible" },
    { label: "Office Supplies & Equipment", defaultTag: "deductible" },
    { label: "Client Meetings & Travel", defaultTag: "deductible" },
    { label: "80C ELSS / PPF / LIC", defaultTag: "tax_saving" },
    { label: "80D Health Insurance", defaultTag: "tax_saving" },
    { label: "House Rent & Maintenance", defaultTag: "personal" },
    { label: "Food & Groceries", defaultTag: "personal" },
    { label: "Transport & Fuel", defaultTag: "personal" },
    { label: "Utilities & Bills", defaultTag: "personal" },
    { label: "Entertainment & Leisure", defaultTag: "personal" },
    { label: "Other Expense", defaultTag: "personal" },
  ],
};

const INITIAL_TRANSACTIONS = [];

export default function IncomeExpenseManager() {
  const [transactions, setTransactions] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Form State
  const [txType, setTxType] = useState("expense"); // "income" | "expense"
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Software & Tech Subscriptions");
  const [taxTag, setTaxTag] = useState("deductible");
  const [txDate, setTxDate] = useState(new Date().toISOString().split("T")[0]);

  // Filter State
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Load from localStorage on mount
  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem("taxy_transactions");
      if (saved && JSON.parse(saved).length > 0) {
        setTransactions(JSON.parse(saved));
      } else {
        setTransactions(INITIAL_TRANSACTIONS);
      }
    } catch (e) {
      console.error(e);
      setTransactions(INITIAL_TRANSACTIONS);
    }
  }, []);

  // Save to localStorage when transactions change
  useEffect(() => {
    if (mounted) {
      try {
        localStorage.setItem("taxy_transactions", JSON.stringify(transactions));
      } catch (e) {
        console.error(e);
      }
    }
  }, [transactions, mounted]);

  // Update default tag when category changes
  const handleCategoryChange = (catName) => {
    setCategory(catName);
    const catList = txType === "income" ? CATEGORIES.income : CATEGORIES.expense;
    const match = catList.find((c) => c.label === catName);
    if (match) {
      setTaxTag(match.defaultTag);
    }
  };

  const handleTypeToggle = (type) => {
    setTxType(type);
    if (type === "income") {
      setCategory("Salary / CTC");
      setTaxTag("taxable");
    } else {
      setCategory("Software & Tech Subscriptions");
      setTaxTag("deductible");
    }
  };

  // Add Transaction
  const handleAddTransaction = (e) => {
    e.preventDefault();
    if (!desc || !amount || parseFloat(amount) <= 0) return;

    const newTx = {
      id: Date.now(),
      type: txType,
      description: desc.trim(),
      amount: parseFloat(amount),
      category,
      taxTag,
      date: txDate,
    };

    setTransactions([newTx, ...transactions]);
    setDesc("");
    setAmount("");
  };

  // Delete Transaction
  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((tx) => tx.id !== id));
  };

  // Filtered Transactions
  const filteredTransactions = transactions.filter((tx) => {
    // Month filter
    if (selectedMonth !== "all") {
      if (!tx.date.startsWith(selectedMonth)) return false;
    }
    // Type filter
    if (filterType === "income" && tx.type !== "income") return false;
    if (filterType === "expense" && tx.type !== "expense") return false;
    if (filterType === "deductible" && tx.taxTag !== "deductible" && tx.taxTag !== "tax_saving") return false;

    // Search query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return tx.description.toLowerCase().includes(q) || tx.category.toLowerCase().includes(q);
    }

    return true;
  });

  // Calculate Metrics based on current month/filter
  const totalIncome = filteredTransactions
    .filter((tx) => tx.type === "income")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const totalExpense = filteredTransactions
    .filter((tx) => tx.type === "expense")
    .reduce((acc, tx) => acc + tx.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const totalDeductible = filteredTransactions
    .filter((tx) => tx.type === "expense" && (tx.taxTag === "deductible" || tx.taxTag === "tax_saving"))
    .reduce((acc, tx) => acc + tx.amount, 0);

  const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : 0;

  // Chart Data Preparation: Category Breakdown
  const expenseByCategory = {};
  filteredTransactions
    .filter((tx) => tx.type === "expense")
    .forEach((tx) => {
      expenseByCategory[tx.category] = (expenseByCategory[tx.category] || 0) + tx.amount;
    });

  const chartLabels = Object.keys(expenseByCategory);
  const chartDataValues = Object.values(expenseByCategory);

  const chartColors = [
    "#1C3F3A",
    "#2E7D32",
    "#D4A017",
    "#0A0C29",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#E65100",
    "#00897B",
    "#6D1720",
  ];

  const doughnutData = {
    labels: chartLabels.length > 0 ? chartLabels : ["No Expenses"],
    datasets: [
      {
        data: chartDataValues.length > 0 ? chartDataValues : [1],
        backgroundColor: chartLabels.length > 0 ? chartColors.slice(0, chartLabels.length) : ["#E0E0E0"],
        borderWidth: 2,
        borderColor: "#ffffff",
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          font: { size: 11 },
        },
      },
    },
    cutout: "70%",
  };

  // Export CSV Function
  const exportToCSV = () => {
    const headers = ["Date", "Type", "Description", "Category", "Tax Tag", "Amount (INR)"];
    const rows = filteredTransactions.map((tx) => [
      tx.date,
      tx.type.toUpperCase(),
      `"${tx.description.replace(/"/g, '""')}"`,
      `"${tx.category}"`,
      tx.taxTag,
      tx.amount,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TAXY_Income_Expense_${selectedMonth || "All"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.pageWrapper}>
      <Link href="/" className={styles.backLink}>
        ← Back to Home
      </Link>

      <div className={styles.headerSection}>
        <div className={styles.badge}>Tax-Smart Expense Tracker</div>
        <h1 className={styles.mainTitle}>Income & Expense Manager</h1>
        <p className={styles.subtitle}>
          Track daily earnings, categorize tax-deductible expenses, and monitor savings rates in real-time.
        </p>
      </div>

      {/* STATS TILES */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Total Income</span>
            <span className={styles.statIcon}>💰</span>
          </div>
          <div className={styles.statValue} style={{ color: "#2E7D32" }}>
            ₹{totalIncome.toLocaleString("en-IN")}
          </div>
          <div className={styles.statFooter}>Recorded this period</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Total Expenses</span>
            <span className={styles.statIcon}>💳</span>
          </div>
          <div className={styles.statValue} style={{ color: "#8B1E1E" }}>
            ₹{totalExpense.toLocaleString("en-IN")}
          </div>
          <div className={styles.statFooter}>Across all categories</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Net Balance</span>
            <span className={styles.statIcon}>🏦</span>
          </div>
          <div className={styles.statValue} style={{ color: netBalance >= 0 ? "#1C3F3A" : "#8B1E1E" }}>
            ₹{netBalance.toLocaleString("en-IN")}
          </div>
          <div className={styles.statFooter}>
            Savings Rate: <strong>{savingsRate}%</strong> {savingsRate >= 20 ? "🟢" : "🟡"}
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statHeader}>
            <span className={styles.statLabel}>Tax Deductions Claimable</span>
            <span className={styles.statIcon}>🛡️</span>
          </div>
          <div className={styles.statValue} style={{ color: "#1C3F3A" }}>
            ₹{totalDeductible.toLocaleString("en-IN")}
          </div>
          <div className={styles.statFooter}>Business & 80C/80D tags</div>
        </div>
      </div>

      {/* DASHBOARD SPLIT GRID */}
      <div className={styles.dashboardGrid}>
        {/* LEFT COLUMN: Add Entry + Chart */}
        <div>
          {/* Add Transaction Card */}
          <div className={styles.glassCard}>
            <div className={styles.cardTitle}>
              <span>📝 Add New Entry</span>
            </div>

            {/* Type Toggle */}
            <div className={styles.typeToggle}>
              <button
                type="button"
                className={txType === "income" ? styles.activeIncomeToggle : styles.toggleBtn}
                onClick={() => handleTypeToggle("income")}
              >
                + Income
              </button>
              <button
                type="button"
                className={txType === "expense" ? styles.activeExpenseToggle : styles.toggleBtn}
                onClick={() => handleTypeToggle("expense")}
              >
                - Expense
              </button>
            </div>

            <form onSubmit={handleAddTransaction}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Description</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="e.g. AWS Cloud / Client Retainer"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Amount (₹)</label>
                  <input
                    className={styles.input}
                    type="number"
                    placeholder="e.g. 5000"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="1"
                    required
                  />
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Date</label>
                  <input
                    className={styles.input}
                    type="date"
                    value={txDate}
                    onChange={(e) => setTxDate(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Category</label>
                  <select
                    className={styles.select}
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                  >
                    {(txType === "income" ? CATEGORIES.income : CATEGORIES.expense).map((cat, i) => (
                      <option key={i} value={cat.label}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={styles.formGroup}>
                  <label className={styles.label}>Tax Status Tag</label>
                  <select
                    className={styles.select}
                    value={taxTag}
                    onChange={(e) => setTaxTag(e.target.value)}
                  >
                    {txType === "expense" ? (
                      <>
                        <option value="deductible">💼 Business Deductible</option>
                        <option value="tax_saving">🛡️ 80C/80D Tax Saving</option>
                        <option value="personal">🏠 Personal (Non-Deductible)</option>
                      </>
                    ) : (
                      <>
                        <option value="taxable">💵 Taxable Income</option>
                        <option value="exempt">🕊️ Exempt Income</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <button type="submit" className={styles.submitBtn}>
                + Record {txType === "income" ? "Income" : "Expense"}
              </button>
            </form>
          </div>

          {/* Category Breakdown Chart Card */}
          <div className={styles.glassCard}>
            <div className={styles.cardTitle}>
              <span>📊 Expense Category Distribution</span>
            </div>
            {chartLabels.length > 0 ? (
              <div className={styles.chartWrapper}>
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            ) : (
              <div style={{ textAlign: "center", color: "#8A9C98", padding: "20px" }}>
                No expenses logged in this view.
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Filterable Transaction History */}
        <div className={styles.glassCard}>
          <div className={styles.cardTitle}>
            <span>📜 Transaction Ledger ({filteredTransactions.length})</span>
            <button type="button" onClick={exportToCSV} className={styles.csvBtn}>
              📥 Export CSV
            </button>
          </div>

          {/* Filter Bar */}
          <div className={styles.filterBar}>
            <div className={styles.filterControls}>
              <select
                className={styles.filterSelect}
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
              >
                <option value="all">All Dates</option>
                <option value="2025-02">Feb 2025</option>
                <option value="2025-01">Jan 2025</option>
                <option value="2024-12">Dec 2024</option>
              </select>

              <select
                className={styles.filterSelect}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="all">All Types</option>
                <option value="income">Income Only</option>
                <option value="expense">Expenses Only</option>
                <option value="deductible">Tax Deductible Only</option>
              </select>
            </div>

            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.filterSelect}
              style={{ minWidth: "160px" }}
            />
          </div>

          {/* List */}
          <div className={styles.transactionList}>
            {filteredTransactions.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px 20px", color: "#8A9C98" }}>
                No transactions match the selected filters.
              </div>
            ) : (
              filteredTransactions.map((tx) => (
                <div className={styles.transactionItem} key={tx.id}>
                  <div className={styles.txLeft}>
                    <div
                      className={`${styles.txIconBox} ${
                        tx.type === "income" ? styles.incomeIconBox : styles.expenseIconBox
                      }`}
                    >
                      {tx.type === "income" ? "↗" : "↘"}
                    </div>
                    <div>
                      <div className={styles.txTitle}>{tx.description}</div>
                      <div className={styles.txMeta}>
                        <span>{tx.date}</span>
                        <span>•</span>
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span
                          className={`${styles.txTagBadge} ${
                            tx.taxTag === "deductible" || tx.taxTag === "tax_saving" ? styles.deductibleBadge : ""
                          }`}
                        >
                          {tx.taxTag === "deductible"
                            ? "💼 Deductible"
                            : tx.taxTag === "tax_saving"
                            ? "🛡️ 80C/80D"
                            : tx.taxTag === "exempt"
                            ? "🕊️ Exempt"
                            : "Personal"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className={styles.txRight}>
                    <div
                      className={`${styles.txAmount} ${
                        tx.type === "income" ? styles.incomeAmount : styles.expenseAmount
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString("en-IN")}
                    </div>
                    <button
                      type="button"
                      className={styles.deleteBtn}
                      onClick={() => handleDeleteTransaction(tx.id)}
                      title="Delete Transaction"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

