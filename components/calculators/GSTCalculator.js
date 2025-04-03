import { useState } from "react";
import styles from '@/styles/calculator.module.css';

export default function GSTCalculator() {
  const [amount, setAmount] = useState("");
  const [gst, setGst] = useState("5");
  const [totalAmount, setTotalAmount] = useState("");

  const calcTotalAmount = () => {
    const amt = parseFloat(amount) || 0;
    const gstRate = parseFloat(gst) || 0;
    const calculatedAmount = amt + (amt * gstRate) / 100;
    setTotalAmount(calculatedAmount.toFixed(2));
  };

  return (
    <>
    <h2 className={styles.calcTitle}>G.S.T Calculator</h2>
    <div className={styles.calcContainer}>
      <div className={styles.calc}>
      <input className={styles.input}
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Amount"
      />
         <select className={styles.input}
          value={gst}
          onChange={(e) => setGst(e.target.value)}
          placeholder="GST Rate"
          >
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="12">12%</option>
              <option value="18">18%</option>
         </select>

      <button className={styles.calcBtn} onClick={calcTotalAmount}>Calculate</button>
      <h2>Total Amount = {totalAmount}</h2>
    </div>
    </div>
    </>
  );
}
