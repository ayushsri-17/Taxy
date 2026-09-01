import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/calculator.module.css";

export default function GSTCalculator() {
  const [amount, setAmount] = useState("");
  const [gstRate, setGstRate] = useState("18");
  const [calcType, setCalcType] = useState("exclusive"); // exclusive (add GST) vs inclusive (remove GST)
  const [taxType, setTaxType] = useState("intra"); // intra (CGST+SGST) vs inter (IGST)

  const inputAmount = parseFloat(amount) || 0;
  const rate = parseFloat(gstRate) || 0;

  let netPrice = 0;
  let totalGst = 0;
  let grossPrice = 0;

  if (calcType === "exclusive") {
    netPrice = inputAmount;
    totalGst = (inputAmount * rate) / 100;
    grossPrice = netPrice + totalGst;
  } else {
    // Inclusive: inputAmount is the gross price
    grossPrice = inputAmount;
    netPrice = inputAmount / (1 + rate / 100);
    totalGst = grossPrice - netPrice;
  }

  const cgst = totalGst / 2;
  const sgst = totalGst / 2;
  const igst = totalGst;

  const resetForm = () => {
    setAmount("");
    setGstRate("18");
    setCalcType("exclusive");
    setTaxType("intra");
  };

  return (
    <div className={styles.calcPageWrapper}>
      <Link href="/calc-holder" className={styles.backLink}>
        ← Back to Calculators
      </Link>

      <div className={styles.calcHeader}>
        <div className={styles.calcBadge}>Goods & Services Tax</div>
        <h1 className={styles.calcTitle}>GST Calculator</h1>
        <p className={styles.calcSubtitle}>
          Calculate GST Inclusive or Exclusive amounts with CGST, SGST, and IGST breakdowns.
        </p>
      </div>

      <div className={styles.calcGrid}>
        {/* Input Card */}
        <div className={styles.glassCard}>
          <div className={styles.cardTitle}>
            <span>🧾</span> GST Calculation Inputs
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Calculation Mode</label>
            <div className={styles.toggleGroup}>
              <button
                type="button"
                className={calcType === "exclusive" ? styles.activeToggleBtn : styles.toggleBtn}
                onClick={() => setCalcType("exclusive")}
              >
                GST Exclusive (+ Add GST)
              </button>
              <button
                type="button"
                className={calcType === "inclusive" ? styles.activeToggleBtn : styles.toggleBtn}
                onClick={() => setCalcType("inclusive")}
              >
                GST Inclusive (Extract GST)
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              {calcType === "exclusive" ? "Net / Base Amount (₹)" : "Total MRP / Invoice Amount (₹)"}
            </label>
            <input
              className={styles.input}
              type="number"
              placeholder="e.g. 10000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>GST Rate Slab</label>
            <select
              className={styles.input}
              value={gstRate}
              onChange={(e) => setGstRate(e.target.value)}
            >
              <option value="0">0% (Essential goods & services)</option>
              <option value="5">5% (Household necessities)</option>
              <option value="12">12% (Processed food, computers)</option>
              <option value="18">18% (Standard rate, services, IT)</option>
              <option value="28">28% (Luxury & sin goods, automobiles)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Supply Type</label>
            <div className={styles.toggleGroup}>
              <button
                type="button"
                className={taxType === "intra" ? styles.activeToggleBtn : styles.toggleBtn}
                onClick={() => setTaxType("intra")}
              >
                Intra-State (CGST + SGST)
              </button>
              <button
                type="button"
                className={taxType === "inter" ? styles.activeToggleBtn : styles.toggleBtn}
                onClick={() => setTaxType("inter")}
              >
                Inter-State (IGST)
              </button>
            </div>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.calcBtn} type="button" onClick={() => {}}>
              Calculate GST
            </button>
            <button className={styles.resetBtn} type="button" onClick={resetForm}>
              Reset
            </button>
          </div>
        </div>

        {/* Results Card */}
        <div className={styles.glassCard}>
          <div className={styles.cardTitle}>
            <span>📊</span> GST Computation Breakdown
          </div>

          <div className={styles.resultHighlight}>
            <div className={styles.resultLabel}>Total GST Tax Amount</div>
            <div className={styles.resultAmount}>
              ₹{totalGst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>

          <div className={styles.resultRows}>
            <div className={styles.resultRow}>
              <span className="rowLabel">Net Base Price:</span>
              <span className="rowValue">
                ₹{netPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>

            <div className={styles.resultRow}>
              <span className="rowLabel">Applicable GST Slab:</span>
              <span className="rowValue">{rate}%</span>
            </div>

            {taxType === "intra" ? (
              <>
                <div className={styles.resultRow}>
                  <span className="rowLabel">Central GST (CGST @ {rate / 2}%):</span>
                  <span className="rowValue">
                    ₹{cgst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className={styles.resultRow}>
                  <span className="rowLabel">State GST (SGST @ {rate / 2}%):</span>
                  <span className="rowValue">
                    ₹{sgst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </>
            ) : (
              <div className={styles.resultRow}>
                <span className="rowLabel">Integrated GST (IGST @ {rate}%):</span>
                <span className="rowValue">
                  ₹{igst.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )}

            <div className={styles.resultRow}>
              <span className="rowLabel">Total Final Gross Price:</span>
              <span className="rowValue" style={{ color: "#1C3F3A", fontSize: "16px" }}>
                ₹{grossPrice.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className={styles.recommendationBanner}>
            💡 {calcType === "exclusive" ? `Adding ${rate}% GST to ₹${inputAmount.toLocaleString("en-IN")}` : `Extracted ${rate}% GST from ₹${inputAmount.toLocaleString("en-IN")}`}
          </div>
        </div>
      </div>
    </div>
  );
}

