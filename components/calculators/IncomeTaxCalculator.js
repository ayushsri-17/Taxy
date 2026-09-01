import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/calculator.module.css";

export default function IncomeTaxCalculator() {
  const [salary, setSalary] = useState("");
  const [otherIncome, setOtherIncome] = useState("");
  const [hra, setHra] = useState("");
  const [sec80C, setSec80C] = useState("");
  const [sec80D, setSec80D] = useState("");
  const [homeLoanInterest, setHomeLoanInterest] = useState("");
  const [sec80CCD, setSec80CCD] = useState("");
  const [sec80E, setSec80E] = useState("");
  const [sec80G, setSec80G] = useState("");

  const grossSalary = parseFloat(salary) || 0;
  const extraIncome = parseFloat(otherIncome) || 0;
  const totalGrossIncome = grossSalary + extraIncome;

  // Deductions (Old Regime)
  const deduction80C = Math.min(parseFloat(sec80C) || 0, 150000); // capped at 1.5L
  const deduction80D = Math.min(parseFloat(sec80D) || 0, 100000);
  const deductionHRA = parseFloat(hra) || 0;
  const deductionHomeLoan = Math.min(parseFloat(homeLoanInterest) || 0, 200000); // capped at 2L
  const deductionNPS = Math.min(parseFloat(sec80CCD) || 0, 50000); // capped at 50k
  const deduction80E = parseFloat(sec80E) || 0;
  const deduction80G = parseFloat(sec80G) || 0;

  const totalOldDeductions =
    50000 + // Standard Deduction (Old)
    deduction80C +
    deduction80D +
    deductionHRA +
    deductionHomeLoan +
    deductionNPS +
    deduction80E +
    deduction80G;

  const oldTaxableIncome = Math.max(totalGrossIncome - totalOldDeductions, 0);

  // New Regime Standard Deduction = ₹75,000 (Budget update)
  const newStandardDeduction = totalGrossIncome > 0 ? 75000 : 0;
  const newTaxableIncome = Math.max(totalGrossIncome - newStandardDeduction, 0);

  // --- OLD REGIME CALCULATION ---
  let oldBaseTax = 0;
  if (oldTaxableIncome <= 250000) {
    oldBaseTax = 0;
  } else if (oldTaxableIncome <= 500000) {
    oldBaseTax = (oldTaxableIncome - 250000) * 0.05;
  } else if (oldTaxableIncome <= 1000000) {
    oldBaseTax = 12500 + (oldTaxableIncome - 500000) * 0.20;
  } else {
    oldBaseTax = 112500 + (oldTaxableIncome - 1000000) * 0.30;
  }

  // Section 87A Rebate (Old Regime: Taxable Income up to 5L -> Tax is 0)
  if (oldTaxableIncome <= 500000) {
    oldBaseTax = 0;
  }
  const oldCess = oldBaseTax * 0.04;
  const oldTotalTax = oldBaseTax + oldCess;

  // --- NEW REGIME CALCULATION (FY 2024-25 & FY 2025-26 Budget Slabs) ---
  // Slabs: 0-3L (0%), 3-7L (5%), 7-10L (10%), 10-12L (15%), 12-15L (20%), >15L (30%)
  let newBaseTax = 0;
  if (newTaxableIncome <= 300000) {
    newBaseTax = 0;
  } else if (newTaxableIncome <= 700000) {
    newBaseTax = (newTaxableIncome - 300000) * 0.05;
  } else if (newTaxableIncome <= 1000000) {
    newBaseTax = 20000 + (newTaxableIncome - 700000) * 0.10;
  } else if (newTaxableIncome <= 1200000) {
    newBaseTax = 50000 + (newTaxableIncome - 1000000) * 0.15;
  } else if (newTaxableIncome <= 1500000) {
    newBaseTax = 80000 + (newTaxableIncome - 1200000) * 0.20;
  } else {
    newBaseTax = 140000 + (newTaxableIncome - 1500000) * 0.30;
  }

  // Section 87A Rebate (New Regime: Taxable Income up to 7L -> Tax is 0)
  if (newTaxableIncome <= 700000) {
    newBaseTax = 0;
  }
  const newCess = newBaseTax * 0.04;
  const newTotalTax = newBaseTax + newCess;

  // Savings Analysis
  const savings = Math.abs(oldTotalTax - newTotalTax);
  const betterRegime = newTotalTax <= oldTotalTax ? "New Regime" : "Old Regime";

  const resetForm = () => {
    setSalary("");
    setOtherIncome("");
    setHra("");
    setSec80C("");
    setSec80D("");
    setHomeLoanInterest("");
    setSec80CCD("");
    setSec80E("");
    setSec80G("");
  };

  return (
    <div className={styles.calcPageWrapper}>
      <Link href="/calc-holder" className={styles.backLink}>
        ← Back to Calculators
      </Link>

      <div className={styles.calcHeader}>
        <div className={styles.calcBadge}>Income Tax FY 2024-25 & 2025-26</div>
        <h1 className={styles.calcTitle}>Income Tax Calculator</h1>
        <p className={styles.calcSubtitle}>
          Real-time comparative analysis between the Old and New Tax Regimes with latest budget deductions.
        </p>
      </div>

      <div className={styles.calcGrid}>
        {/* Income & Deductions Form */}
        <div className={styles.glassCard}>
          <div className={styles.cardTitle}>
            <span>💼</span> Income & Exemption Details
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Annual Gross Salary / CTC (₹)</label>
            <input
              className={styles.input}
              type="number"
              placeholder="e.g. 1200000"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              min="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Other Income (Interest, Freelance, Rental) (₹)</label>
            <input
              className={styles.input}
              type="number"
              placeholder="e.g. 50000"
              value={otherIncome}
              onChange={(e) => setOtherIncome(e.target.value)}
              min="0"
            />
          </div>

          <div style={{ marginTop: "24px", marginBottom: "12px", borderTop: "1px solid rgba(28,63,58,0.1)", paddingTop: "16px" }}>
            <span style={{ fontSize: "14px", fontWeight: "700", color: "#1C3F3A" }}>
              Old Regime Deductions (Optional)
            </span>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Section 80C (EPF, PPF, ELSS, LIC - max ₹1.5L)</label>
            <input
              className={styles.input}
              type="number"
              placeholder="e.g. 150000"
              value={sec80C}
              onChange={(e) => setSec80C(e.target.value)}
              min="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Section 80D (Health Insurance Premium)</label>
            <input
              className={styles.input}
              type="number"
              placeholder="e.g. 25000"
              value={sec80D}
              onChange={(e) => setSec80D(e.target.value)}
              min="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>House Rent Allowance (HRA) Exemption</label>
            <input
              className={styles.input}
              type="number"
              placeholder="e.g. 120000"
              value={hra}
              onChange={(e) => setHra(e.target.value)}
              min="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Home Loan Interest Section 24(b) (max ₹2L)</label>
            <input
              className={styles.input}
              type="number"
              placeholder="e.g. 200000"
              value={homeLoanInterest}
              onChange={(e) => setHomeLoanInterest(e.target.value)}
              min="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Section 80CCD(1B) NPS (max ₹50,000)</label>
            <input
              className={styles.input}
              type="number"
              placeholder="e.g. 50000"
              value={sec80CCD}
              onChange={(e) => setSec80CCD(e.target.value)}
              min="0"
            />
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.calcBtn} type="button" onClick={() => {}}>
              Recalculate Taxes
            </button>
            <button className={styles.resetBtn} type="button" onClick={resetForm}>
              Reset
            </button>
          </div>
        </div>

        {/* Side-by-Side Comparison Results */}
        <div className={styles.glassCard}>
          <div className={styles.cardTitle}>
            <span>⚖️</span> Old vs New Regime Comparison
          </div>

          {/* Recommendation Banner */}
          <div className={styles.recommendationBanner} style={{ marginTop: "0", marginBottom: "20px" }}>
            {totalGrossIncome === 0 ? (
              "Enter your income to see which regime saves you more!"
            ) : savings === 0 ? (
              "Both regimes result in the same tax liability."
            ) : (
              `🎉 ${betterRegime} is better for you! You save ₹${savings.toLocaleString("en-IN", { maximumFractionDigits: 0 })} in taxes.`
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
            {/* New Regime Card */}
            <div
              style={{
                background: betterRegime === "New Regime" ? "rgba(46, 125, 50, 0.08)" : "rgba(28, 63, 58, 0.04)",
                border: betterRegime === "New Regime" ? "2px solid #2E7D32" : "1px solid rgba(28,63,58,0.1)",
                borderRadius: "16px",
                padding: "16px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#1C3F3A", textTransform: "uppercase" }}>
                New Regime (Default)
              </div>
              <div style={{ fontSize: "26px", fontWeight: "800", color: "#1C3F3A", margin: "8px 0" }}>
                ₹{newTotalTax.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </div>
              <div style={{ fontSize: "12px", color: "#5F7773" }}>
                Std. Deduction: ₹75,000
              </div>
            </div>

            {/* Old Regime Card */}
            <div
              style={{
                background: betterRegime === "Old Regime" ? "rgba(46, 125, 50, 0.08)" : "rgba(28, 63, 58, 0.04)",
                border: betterRegime === "Old Regime" ? "2px solid #2E7D32" : "1px solid rgba(28,63,58,0.1)",
                borderRadius: "16px",
                padding: "16px",
                textAlign: "center"
              }}
            >
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#1C3F3A", textTransform: "uppercase" }}>
                Old Regime
              </div>
              <div style={{ fontSize: "26px", fontWeight: "800", color: "#1C3F3A", margin: "8px 0" }}>
                ₹{oldTotalTax.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </div>
              <div style={{ fontSize: "12px", color: "#5F7773" }}>
                Total Deductions: ₹{totalOldDeductions.toLocaleString("en-IN")}
              </div>
            </div>
          </div>

          {/* Breakdown Table */}
          <div className={styles.resultRows}>
            <div className={styles.resultRow}>
              <span className="rowLabel">Total Gross Income:</span>
              <span className="rowValue">₹{totalGrossIncome.toLocaleString("en-IN")}</span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">New Regime Taxable Income:</span>
              <span className="rowValue">₹{newTaxableIncome.toLocaleString("en-IN")}</span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">Old Regime Taxable Income:</span>
              <span className="rowValue">₹{oldTaxableIncome.toLocaleString("en-IN")}</span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">New Regime Base Tax:</span>
              <span className="rowValue">₹{newBaseTax.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">Old Regime Base Tax:</span>
              <span className="rowValue">₹{oldBaseTax.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">Health & Education Cess (4%):</span>
              <span className="rowValue">
                New: ₹{newCess.toLocaleString("en-IN", { maximumFractionDigits: 0 })} | Old: ₹{oldCess.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
  
