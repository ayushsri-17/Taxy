import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/calculator.module.css";

const CATEGORIES = {
  electronics: { name: "Electronics & Tech Gadgets", bcd: 10, igst: 18 },
  smartphones: { name: "Mobile Phones & Accessories", bcd: 15, igst: 18 },
  automobiles: { name: "Automobiles / CBU Vehicles", bcd: 70, igst: 28 },
  apparel: { name: "Garments & Textiles", bcd: 20, igst: 12 },
  gold_jewellery: { name: "Gold & Precious Jewellery", bcd: 15, igst: 3 },
  cosmetics: { name: "Cosmetics & Perfumes", bcd: 20, igst: 28 },
  custom: { name: "Custom Product / Manual Entry", bcd: 10, igst: 18 }
};

export default function ExciseImportsTaxCalculator() {
  const [cifValue, setCifValue] = useState("");
  const [category, setCategory] = useState("electronics");
  const [customBcd, setCustomBcd] = useState("10");
  const [customIgst, setCustomIgst] = useState("18");

  const assessableValue = parseFloat(cifValue) || 0;
  const activeCategory = CATEGORIES[category] || CATEGORIES.custom;

  const bcdRate = category === "custom" ? (parseFloat(customBcd) || 0) : activeCategory.bcd;
  const igstRate = category === "custom" ? (parseFloat(customIgst) || 0) : activeCategory.igst;

  // Basic Customs Duty (BCD)
  const bcdAmount = (assessableValue * bcdRate) / 100;

  // Social Welfare Surcharge (SWS) = 10% of BCD
  const swsAmount = bcdAmount * 0.10;

  // Value for IGST = Assessable Value + BCD + SWS
  const valueForIgst = assessableValue + bcdAmount + swsAmount;

  // IGST Amount
  const igstAmount = (valueForIgst * igstRate) / 100;

  // Total Customs Duty & Total Landed Cost
  const totalDuty = bcdAmount + swsAmount + igstAmount;
  const totalLandedCost = assessableValue + totalDuty;
  const effectiveDutyRate = assessableValue > 0 ? ((totalDuty / assessableValue) * 100).toFixed(2) : 0;

  const resetForm = () => {
    setCifValue("");
    setCategory("electronics");
    setCustomBcd("10");
    setCustomIgst("18");
  };

  return (
    <div className={styles.calcPageWrapper}>
      <Link href="/calc-holder" className={styles.backLink}>
        ← Back to Calculators
      </Link>

      <div className={styles.calcHeader}>
        <div className={styles.calcBadge}>International Trade & Import Duty</div>
        <h1 className={styles.calcTitle}>Customs & Import Duty Calculator</h1>
        <p className={styles.calcSubtitle}>
          Compute Basic Customs Duty (BCD), Social Welfare Surcharge (SWS), and IGST on imported goods.
        </p>
      </div>

      <div className={styles.calcGrid}>
        {/* Form Inputs */}
        <div className={styles.glassCard}>
          <div className={styles.cardTitle}>
            <span>🚢</span> Import Shipment Details
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Product Category</label>
            <select
              className={styles.input}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="electronics">Electronics & Tech Gadgets (BCD 10%, IGST 18%)</option>
              <option value="smartphones">Mobile Phones & Parts (BCD 15%, IGST 18%)</option>
              <option value="automobiles">Automobiles / CBU (BCD 70%, IGST 28%)</option>
              <option value="apparel">Garments & Apparel (BCD 20%, IGST 12%)</option>
              <option value="gold_jewellery">Gold & Jewellery (BCD 15%, IGST 3%)</option>
              <option value="cosmetics">Cosmetics & Luxury (BCD 20%, IGST 28%)</option>
              <option value="custom">Custom Duty Rates (Manual)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Assessable Value / CIF in INR (Cost + Freight + Insurance)</label>
            <input
              className={styles.input}
              type="number"
              placeholder="e.g. 100000"
              value={cifValue}
              onChange={(e) => setCifValue(e.target.value)}
              min="0"
            />
          </div>

          {category === "custom" && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Basic Customs Duty (BCD %)</label>
                <input
                  className={styles.input}
                  type="number"
                  placeholder="e.g. 10"
                  value={customBcd}
                  onChange={(e) => setCustomBcd(e.target.value)}
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>IGST Rate (%)</label>
                <select
                  className={styles.input}
                  value={customIgst}
                  onChange={(e) => setCustomIgst(e.target.value)}
                >
                  <option value="0">0%</option>
                  <option value="3">3%</option>
                  <option value="5">5%</option>
                  <option value="12">12%</option>
                  <option value="18">18%</option>
                  <option value="28">28%</option>
                </select>
              </div>
            </>
          )}

          <div className={styles.buttonGroup}>
            <button className={styles.calcBtn} type="button" onClick={() => {}}>
              Calculate Landed Cost
            </button>
            <button className={styles.resetBtn} type="button" onClick={resetForm}>
              Reset
            </button>
          </div>
        </div>

        {/* Results Card */}
        <div className={styles.glassCard}>
          <div className={styles.cardTitle}>
            <span>📑</span> Duty & Landed Cost Breakdown
          </div>

          <div className={styles.resultHighlight}>
            <div className={styles.resultLabel}>Total Customs Duty Payable</div>
            <div className={styles.resultAmount}>₹{totalDuty.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</div>
          </div>

          <div className={styles.resultRows}>
            <div className={styles.resultRow}>
              <span className="rowLabel">CIF Assessable Value:</span>
              <span className="rowValue">₹{assessableValue.toLocaleString("en-IN")}</span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">Basic Customs Duty (BCD @ {bcdRate}%):</span>
              <span className="rowValue">₹{bcdAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">Social Welfare Surcharge (SWS @ 10% of BCD):</span>
              <span className="rowValue">₹{swsAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">Subtotal for IGST Assessment:</span>
              <span className="rowValue">₹{valueForIgst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">Integrated GST (IGST @ {igstRate}%):</span>
              <span className="rowValue">₹{igstAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">Total Landed Cost (CIF + Duties):</span>
              <span className="rowValue" style={{ color: "#1C3F3A", fontSize: "16px" }}>
                ₹{totalLandedCost.toLocaleString("en-IN", { maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className={styles.recommendationBanner}>
            📦 Effective Import Tax Rate: <strong>{effectiveDutyRate}%</strong> on CIF value.
          </div>
        </div>
      </div>
    </div>
  );
}