import React, { useState } from 'react';
import styles from "../styles/component-holder.module.css";
import incomeExpenseStyles from "../styles/income-expense.module.css";

export default function IncomeExpenseManager() {
  const [incomeList, setIncomeList] = useState([]);
  const [expenseList, setExpenseList] = useState([]);
  const [incomeDesc, setIncomeDesc] = useState('');
  const [incomeAmt, setIncomeAmt] = useState('');
  const [incomeCategory, setIncomeCategory] = useState('');
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmt, setExpenseAmt] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');

  const categories = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income', 
                     'Food', 'Transport', 'Housing', 'Entertainment', 'Utilities', 'Other Expense'];

  const addIncome = (e) => {
    e.preventDefault();
    if (!incomeDesc || !incomeAmt) return;
    setIncomeList([...incomeList, { 
      description: incomeDesc, 
      amount: parseFloat(incomeAmt),
      category: incomeCategory || 'Uncategorized Income',
      id: Date.now()
    }]);
    setIncomeDesc('');
    setIncomeAmt('');
    setIncomeCategory('');
  };

  const addExpense = (e) => {
    e.preventDefault();
    if (!expenseDesc || !expenseAmt) return;
    setExpenseList([...expenseList, { 
      description: expenseDesc, 
      amount: parseFloat(expenseAmt),
      category: expenseCategory || 'Uncategorized Expense',
      id: Date.now()
    }]);
    setExpenseDesc('');
    setExpenseAmt('');
    setExpenseCategory('');
  };

  const deleteIncome = (id) => {
    setIncomeList(incomeList.filter(item => item.id !== id));
  };

  const deleteExpense = (id) => {
    setExpenseList(expenseList.filter(item => item.id !== id));
  };

  const totalIncome = incomeList.reduce((acc, item) => acc + item.amount, 0);
  const totalExpense = expenseList.reduce((acc, item) => acc + item.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <>
      <h1 className={styles.componentTitle}>Income & Expense Manager</h1>
      <div className={incomeExpenseStyles.container}>
        <h2 className={`${incomeExpenseStyles.balance} ${balance >= 0 ? incomeExpenseStyles.positive : incomeExpenseStyles.negative}`}>
          Balance: Rs.{balance.toFixed(2)}
        </h2>

        <div className={incomeExpenseStyles.summary}>
          <h4 className={incomeExpenseStyles.incomeSummary}>Total Income: Rs.{totalIncome.toFixed(2)}</h4>
          <h4 className={incomeExpenseStyles.expenseSummary}>Total Expense: Rs.{totalExpense.toFixed(2)}</h4>
        </div>

        {/* Income Form */}
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
              {categories.filter(cat => !cat.includes('Expense')).map((cat, i) => (
                <option key={`inc-${i}`} value={cat}>{cat}</option>
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

        {/* Expense Form */}
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
              {categories.filter(cat => !cat.includes('Income')).map((cat, i) => (
                <option key={`exp-${i}`} value={cat}>{cat}</option>
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

        {/* Transactions */}
        <div className={incomeExpenseStyles.transactions}>
          <div className={incomeExpenseStyles.transactionsContainer}>
            <div className={incomeExpenseStyles.transactionColumn}>
              <h3 className={incomeExpenseStyles.transactionTitle}>Income Transactions</h3>
              <ul className={incomeExpenseStyles.transactionList}>
                {incomeList.map((item) => (
                  <li 
                    key={item.id} 
                    className={`${incomeExpenseStyles.transactionItem} ${incomeExpenseStyles.incomeItem}`}
                  >
                    <div>
                      <strong>{item.description}</strong><br />
                      <small>{item.category} - ${item.amount.toFixed(2)}</small>
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
              <h3 className={incomeExpenseStyles.transactionTitle}>Expense Transactions</h3>
              <ul className={incomeExpenseStyles.transactionList}>
                {expenseList.map((item) => (
                  <li 
                    key={item.id} 
                    className={`${incomeExpenseStyles.transactionItem} ${incomeExpenseStyles.expenseItem}`}
                  >
                    <div>
                      <strong>{item.description}</strong><br />
                      <small>{item.category} - ${item.amount.toFixed(2)}</small>
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