import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/calculator.module.css";

const STATE_RULES = {
  maharashtra: {
    name: "Maharashtra",
    calc: (salary, gender) => {
      if (gender === "female" && salary <= 25000) return { monthly: 0, annual: 0, note: "Women exempt up to ₹25,000/month" };
      if (salary <= 7500) return { monthly: 0, annual: 0, note: "Below ₹7,500/month threshold" };
      if (salary <= 10000) return { monthly: 175, annual: 2100, note: "₹175/month" };
      return { monthly: 200, annual: 2500, note: "₹200/mo (₹300 in Feb, max ₹2,500/yr)" };
    }
  },
  karnataka: {
    name: "Karnataka",
    calc: (salary) => {
      if (salary <= 25000) return { monthly: 0, annual: 0, note: "Exempt up to ₹25,000/month (Budget 2024 update)" };
      return { monthly: 200, annual: 2400, note: "₹200/month (₹2,400/yr)" };
    }
  },
  west_bengal: {
    name: "West Bengal",
    calc: (salary) => {
      if (salary <= 10000) return { monthly: 0, annual: 0, note: "Exempt up to ₹10,000/month" };
      if (salary <= 15000) return { monthly: 110, annual: 1320, note: "₹110/month" };
      if (salary <= 20000) return { monthly: 130, annual: 1560, note: "₹130/month" };
      if (salary <= 40000) return { monthly: 150, annual: 1800, note: "₹150/month" };
      return { monthly: 200, annual: 2500, note: "₹200/month (₹2,500/yr)" };
    }
  },
  tamil_nadu: {
    name: "Tamil Nadu",
    calc: (salary) => {
      const halfYearly = salary * 6;
      if (halfYearly <= 21000) return { monthly: 0, annual: 0, note: "Exempt up to ₹21,000/half-year" };
      if (halfYearly <= 30000) return { monthly: 20, annual: 240, note: "₹120 half-yearly" };
      if (halfYearly <= 45000) return { monthly: 50, annual: 600, note: "₹300 half-yearly" };
      if (halfYearly <= 60000) return { monthly: 100, annual: 1200, note: "₹600 half-yearly" };
      if (halfYearly <= 75000) return { monthly: 170, annual: 2040, note: "₹1,020 half-yearly" };
      return { monthly: 208, annual: 2500, note: "₹1,250 half-yearly (₹2,500/yr)" };
    }
  },
  telangana: {
    name: "Telangana / Andhra Pradesh",
    calc: (salary) => {
      if (salary <= 15000) return { monthly: 0, annual: 0, note: "Exempt up to ₹15,000/month" };
      if (salary <= 20000) return { monthly: 150, annual: 1800, note: "₹150/month" };
      return { monthly: 200, annual: 2500, note: "₹200/month (₹2,500/yr)" };
    }
  },
  gujarat: {
    name: "Gujarat",
    calc: (salary) => {
      if (salary <= 12000) return { monthly: 0, annual: 0, note: "Exempt up to ₹12,000/month" };
      return { monthly: 200, annual: 2400, note: "₹200/month (₹2,400/yr)" };
    }
  },
  exempt_states: {
    name: "Delhi / Haryana / Rajasthan / UP",
    calc: () => {
      return { monthly: 0, annual: 0, note: "No Professional Tax levied in this state/UT." };
    }
  }
};

export default function ProfessionalTaxCalculator() {
  const [monthlySalary, setMonthlySalary] = useState("");
  const [selectedState, setSelectedState] = useState("maharashtra");
  const [gender, setGender] = useState("male");

  const salaryNum = parseFloat(monthlySalary) || 0;
  const stateConfig = STATE_RULES[selectedState] || STATE_RULES.maharashtra;
  const result = stateConfig.calc(salaryNum, gender);

  const resetForm = () => {
    setMonthlySalary("");
    setSelectedState("maharashtra");
    setGender("male");
  };

  return (
    <div className={styles.calcPageWrapper}>
      <Link href="/calc-holder" className={styles.backLink}>
        ← Back to Calculators
      </Link>

      <div className={styles.calcHeader}>
        <div className={styles.calcBadge}>State Tax Compliance</div>
        <h1 className={styles.calcTitle}>Professional Tax Calculator</h1>
        <p className={styles.calcSubtitle}>
          Calculate state-specific professional tax deduction under Article 276 of the Indian Constitution.
        </p>
      </div>

      <div className={styles.calcGrid}>
        {/* Form Input Card */}
        <div className={styles.glassCard}>
          <div className={styles.cardTitle}>
            <span>⚙️</span> Salary & State Details
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Select State / Union Territory</label>
            <select
              className={styles.input}
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="maharashtra">Maharashtra</option>
              <option value="karnataka">Karnataka</option>
              <option value="west_bengal">West Bengal</option>
              <option value="tamil_nadu">Tamil Nadu</option>
              <option value="telangana">Telangana / Andhra Pradesh</option>
              <option value="gujarat">Gujarat</option>
              <option value="exempt_states">Delhi / Haryana / UP / Rajasthan (Exempt)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Monthly Gross Salary (₹)</label>
            <input
              className={styles.input}
              type="number"
              placeholder="e.g. 50000"
              value={monthlySalary}
              onChange={(e) => setMonthlySalary(e.target.value)}
              min="0"
            />
          </div>

          {selectedState === "maharashtra" && (
            <div className={styles.formGroup}>
              <label className={styles.label}>Gender</label>
              <div className={styles.toggleGroup}>
                <button
                  type="button"
                  className={gender === "male" ? styles.activeToggleBtn : styles.toggleBtn}
                  onClick={() => setGender("male")}
                >
                  Male
                </button>
                <button
                  type="button"
                  className={gender === "female" ? styles.activeToggleBtn : styles.toggleBtn}
                  onClick={() => setGender("female")}
                >
                  Female (Exempt ≤ ₹25k)
                </button>
              </div>
            </div>
          )}

          <div className={styles.buttonGroup}>
            <button
              className={styles.calcBtn}
              type="button"
              onClick={() => {}}
            >
              Compute Deduction
            </button>
            <button className={styles.resetBtn} type="button" onClick={resetForm}>
              Reset
            </button>
          </div>
        </div>

        {/* Results Card */}
        <div className={styles.glassCard}>
          <div className={styles.cardTitle}>
            <span>📊</span> Professional Tax Breakdown
          </div>

          <div className={styles.resultHighlight}>
            <div className={styles.resultLabel}>Monthly Professional Tax</div>
            <div className={styles.resultAmount}>₹{result.monthly}</div>
          </div>

          <div className={styles.resultRows}>
            <div className={styles.resultRow}>
              <span className="rowLabel">Selected State:</span>
              <span className="rowValue">{stateConfig.name}</span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">Gross Monthly Salary:</span>
              <span className="rowValue">₹{salaryNum.toLocaleString("en-IN")}</span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">Annual Gross Income:</span>
              <span className="rowValue">₹{(salaryNum * 12).toLocaleString("en-IN")}</span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">Total Annual Professional Tax:</span>
              <span className="rowValue" style={{ color: "#1C3F3A", fontSize: "16px" }}>
                ₹{result.annual.toLocaleString("en-IN")} / year
              </span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">Income Tax Section 16(iii) Benefit:</span>
              <span className="rowValue" style={{ color: "#2E7D32" }}>
                Eligible for ₹{result.annual} full deduction
              </span>
            </div>
          </div>

          <div className={styles.recommendationBanner}>
            ℹ️ {result.note}
          </div>
        </div>
      </div>
    </div>
  );
}