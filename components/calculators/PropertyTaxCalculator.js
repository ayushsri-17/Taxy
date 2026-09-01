"use client";
import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/calculator.module.css";

const CITY_PRESETS = {
  bbmp: { name: "Bengaluru (BBMP)", baseRateSqFt: 2.5, cessPercent: 24, rentedFactor: 2 },
  bmc: { name: "Mumbai (BMC)", baseRateSqFt: 4.0, cessPercent: 18, rentedFactor: 1.6 },
  mcd: { name: "Delhi (MCD)", baseRateSqFt: 3.0, cessPercent: 15, rentedFactor: 1.5 },
  gcc: { name: "Chennai (GCC)", baseRateSqFt: 2.0, cessPercent: 10, rentedFactor: 1.8 },
  ghmc: { name: "Hyderabad (GHMC)", baseRateSqFt: 1.8, cessPercent: 12, rentedFactor: 1.5 },
  custom: { name: "Custom Municipality", baseRateSqFt: 2.0, cessPercent: 15, rentedFactor: 1.5 }
};

export default function PropertyTaxCalculator() {
  const [city, setCity] = useState("bbmp");
  const [propertyType, setPropertyType] = useState("residential");
  const [usage, setUsage] = useState("self");
  const [builtUpArea, setBuiltUpArea] = useState("");
  const [propertyAge, setPropertyAge] = useState("0_5");
  const [customRate, setCustomRate] = useState("2.0");
  const [earlyDiscount, setEarlyDiscount] = useState(true);

  const area = parseFloat(builtUpArea) || 0;
  const activeCity = CITY_PRESETS[city] || CITY_PRESETS.custom;

  let ratePerSqFtMonth = city === "custom" ? (parseFloat(customRate) || 0) : activeCity.baseRateSqFt;

  if (propertyType === "commercial") ratePerSqFtMonth *= 2.5;
  if (propertyType === "industrial") ratePerSqFtMonth *= 2.0;
  if (propertyType === "vacant") ratePerSqFtMonth *= 0.5;

  if (usage === "rented") ratePerSqFtMonth *= activeCity.rentedFactor;

  const annualGrossValue = area * ratePerSqFtMonth * 12;

  let depRate = 0.10;
  if (propertyAge === "0_5") depRate = 0.05;
  else if (propertyAge === "5_15") depRate = 0.15;
  else if (propertyAge === "15_25") depRate = 0.25;
  else if (propertyAge === "25_plus") depRate = 0.35;

  const depreciationAmount = annualGrossValue * depRate;
  const netAnnualValue = Math.max(annualGrossValue - depreciationAmount, 0);

  const basePropertyTax = netAnnualValue * 0.20;

  const cessAmount = (basePropertyTax * activeCity.cessPercent) / 100;
  const grossTax = basePropertyTax + cessAmount;

  const rebateAmount = earlyDiscount ? grossTax * 0.05 : 0;
  const netPropertyTax = Math.max(grossTax - rebateAmount, 0);

  const resetForm = () => {
    setCity("bbmp");
    setPropertyType("residential");
    setUsage("self");
    setBuiltUpArea("");
    setPropertyAge("0_5");
    setCustomRate("2.0");
    setEarlyDiscount(true);
  };

  return (
    <div className={styles.calcPageWrapper}>
      <Link href="/calc-holder" className={styles.backLink}>
        ← Back to Calculators
      </Link>

      <div className={styles.calcHeader}>
        <div className={styles.calcBadge}>Municipal & Urban Property Tax</div>
        <h1 className={styles.calcTitle}>Property Tax Calculator</h1>
        <p className={styles.calcSubtitle}>
          Estimate Annual Municipal Property Tax via the Unit Area Value (UAV) & Capital Value Methods.
        </p>
      </div>

      <div className={styles.calcGrid}>
        <div className={styles.glassCard}>
          <div className={styles.cardTitle}>
            <span>🏠</span> Property & Location Details
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Municipal Corporation / City</label>
            <select
              className={styles.input}
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="bbmp">Bengaluru (BBMP)</option>
              <option value="bmc">Mumbai (BMC)</option>
              <option value="mcd">Delhi (MCD)</option>
              <option value="gcc">Chennai (GCC)</option>
              <option value="ghmc">Hyderabad (GHMC)</option>
              <option value="custom">Custom Municipal Rates</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Built-up / Plinth Area (sq. ft.)</label>
            <input
              className={styles.input}
              type="number"
              placeholder="e.g. 1200"
              value={builtUpArea}
              onChange={(e) => setBuiltUpArea(e.target.value)}
              min="0"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Property Category</label>
            <select
              className={styles.input}
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
            >
              <option value="residential">Residential Apartment / House</option>
              <option value="commercial">Commercial / Office / Shop</option>
              <option value="industrial">Industrial Shed / Factory</option>
              <option value="vacant">Vacant Plot / Land</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Occupancy Status</label>
            <div className={styles.toggleGroup}>
              <button
                type="button"
                className={usage === "self" ? styles.activeToggleBtn : styles.toggleBtn}
                onClick={() => setUsage("self")}
              >
                Self Occupied
              </button>
              <button
                type="button"
                className={usage === "rented" ? styles.activeToggleBtn : styles.toggleBtn}
                onClick={() => setUsage("rented")}
              >
                Rented / Tenanted
              </button>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Age of Property</label>
            <select
              className={styles.input}
              value={propertyAge}
              onChange={(e) => setPropertyAge(e.target.value)}
            >
              <option value="0_5">Less than 5 years (5% depreciation)</option>
              <option value="5_15">5 to 15 years (15% depreciation)</option>
              <option value="15_25">15 to 25 years (25% depreciation)</option>
              <option value="25_plus">More than 25 years (35% depreciation)</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={earlyDiscount}
                onChange={(e) => setEarlyDiscount(e.target.checked)}
                style={{ width: "18px", height: "18px", accentColor: "#1C3F3A" }}
              />
              <span>Apply Early Bird 5% Payment Rebate</span>
            </label>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.calcBtn} type="button">
              Calculate Tax
            </button>
            <button className={styles.resetBtn} type="button" onClick={resetForm}>
              Reset
            </button>
          </div>
        </div>

        <div className={styles.glassCard}>
          <div className={styles.cardTitle}>
            <span>📑</span> Annual Property Tax Breakdown
          </div>

          <div className={styles.resultHighlight}>
            <div className={styles.resultLabel}>Net Annual Property Tax Payable</div>
            <div className={styles.resultAmount}>
              ₹{netPropertyTax.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
            </div>
          </div>

          <div className={styles.resultRows}>
            <div className={styles.resultRow}>
              <span className="rowLabel">Selected Municipality:</span>
              <span className="rowValue">{activeCity.name}</span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">Gross Annual Value (GAV):</span>
              <span className="rowValue">₹{annualGrossValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">Depreciation Deduction ({(depRate * 100).toFixed(0)}%):</span>
              <span className="rowValue" style={{ color: "#2E7D32" }}>
                -₹{depreciationAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
              </span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">Net Annual Value (NAV):</span>
              <span className="rowValue">₹{netAnnualValue.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">Base Property Tax (20% of NAV):</span>
              <span className="rowValue">₹{basePropertyTax.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
            </div>
            <div className={styles.resultRow}>
              <span className="rowLabel">Municipal Cesses ({activeCity.cessPercent}%):</span>
              <span className="rowValue">₹{cessAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}</span>
            </div>
            {earlyDiscount && (
              <div className={styles.resultRow}>
                <span className="rowLabel">Early Payment Rebate (5%):</span>
                <span className="rowValue" style={{ color: "#2E7D32" }}>
                  -₹{rebateAmount.toLocaleString("en-IN", { maximumFractionDigits: 0 })}
                </span>
              </div>
            )}
          </div>

          <div className={styles.recommendationBanner}>
            💡 Pay before the municipal deadline to retain your 5% early rebate benefit.
          </div>
        </div>
      </div>
    </div>
  );
}
