import { useState } from "react";
import Link from "next/link";
import styles from "../styles/component-holder.module.css";
import { calculateTax } from "../components/taxFilingCalc";

export default function TaxFiling() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    pan: "",
    employmentType: "Salaried",
    salaryIncome: "",
    businessIncome: "",
    otherIncome: "",
    "80C": "",
    "80D": "",
    HRA: "",
    homeLoanInterest: "",
    regime: "New",
  });

  const [errors, setErrors] = useState({});
  const [taxResult, setTaxResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);

  async function getAISuggestions(data) {
    try {
      const response = await fetch("/api/tax-filing-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: data }),
      });

      const resJson = await response.json();

      if (!response.ok) {
        console.error("Backend API error:", resJson);
        return ["⚠️ Backend API error: " + (resJson.error?.message || "Unknown error occurred.")];
      }

      const text =
        resJson?.choices?.[0]?.message?.content?.[0]?.text ||
        resJson?.choices?.[0]?.message?.content ||
        "No AI suggestions generated.";

      return text
        .split(/\n(?=\d+\.|•|–|✅|💡|🏠|💰)/)
        .filter(Boolean);
    } catch (err) {
      console.error("AI suggestion error:", err);
      return ["⚠️ Error fetching AI suggestions. Please check connection."];
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.age || isNaN(formData.age) || formData.age <= 0)
      newErrors.age = "Valid age is required";

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (formData.pan && !panRegex.test(formData.pan.toUpperCase()))
      newErrors.pan = "Enter a valid 10-digit PAN (e.g. ABCDE1234F)";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    setFormData({
      name: "",
      age: "",
      pan: "",
      employmentType: "Salaried",
      salaryIncome: "",
      businessIncome: "",
      otherIncome: "",
      "80C": "",
      "80D": "",
      HRA: "",
      homeLoanInterest: "",
      regime: "New",
    });
    setTaxResult(null);
    setShowResults(false);
    setSuggestions([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const result = calculateTax(formData);
      setTaxResult(result);
      setShowResults(true);
    }
  };

  const handleAISuggestions = async () => {
    setLoadingAI(true);
    setSuggestions(["Analyzing tax profile and deductions..."]);

    const newSuggestions = await getAISuggestions(formData);
    setSuggestions(newSuggestions);
    setLoadingAI(false);
  };

  return (
    <div className={styles.glassPageWrapper}>
      <Link href="/" className={styles.backLink}>
        ← Back to Home
      </Link>

      <div className={styles.headerSection}>
        <div className={styles.badge}>📋 ITR Assistant & Deductions</div>
        <h1 className={styles.componentTitle}>AI Tax Filing Assistant</h1>
        <p className={styles.subtitle}>
          Step-by-step tax profile builder with automated computation and AI deduction recommendations.
        </p>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "16px" }}>
        <button className={styles.addBtn} type="button" onClick={handleReset}>
          Start a new filing ➕
        </button>
      </div>

      <div className={styles.formAndSuggestionsContainer}>
        {/* Left Column: Form & Computation */}
        <div className={styles.glassCard}>
          <form onSubmit={handleSubmit}>
            <div className={styles.cardTitle}>
              <span>👤 1. Personal Details</span>
            </div>

            <div className={styles.fieldGrid2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name</label>
                <input
                  className={styles.input}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                />
                {errors.name && <p className={styles.error}>{errors.name}</p>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Age</label>
                <input
                  className={styles.input}
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="e.g. 28"
                  min="18"
                />
                {errors.age && <p className={styles.error}>{errors.age}</p>}
              </div>
            </div>

            <div className={styles.fieldGrid2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>PAN (Optional)</label>
                <input
                  className={styles.input}
                  type="text"
                  name="pan"
                  value={formData.pan}
                  onChange={handleChange}
                  placeholder="ABCDE1234F"
                  maxLength={10}
                />
                {errors.pan && <p className={styles.error}>{errors.pan}</p>}
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Tax Regime</label>
                <select
                  className={styles.select}
                  name="regime"
                  value={formData.regime}
                  onChange={handleChange}
                >
                  <option value="New">New Tax Regime (Default)</option>
                  <option value="Old">Old Tax Regime</option>
                </select>
              </div>
            </div>

            <div className={styles.cardTitle} style={{ marginTop: "24px" }}>
              <span>💼 2. Annual Income Streams (₹)</span>
            </div>

            <div className={styles.fieldGrid2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Salary / CTC Income</label>
                <input
                  className={styles.input}
                  type="number"
                  name="salaryIncome"
                  value={formData.salaryIncome}
                  onChange={handleChange}
                  placeholder="e.g. 1200000"
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Business / Profession Income</label>
                <input
                  className={styles.input}
                  type="number"
                  name="businessIncome"
                  value={formData.businessIncome}
                  onChange={handleChange}
                  placeholder="e.g. 300000"
                  min="0"
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Other Income (Interest, Rental, Dividends)</label>
              <input
                className={styles.input}
                type="number"
                name="otherIncome"
                value={formData.otherIncome}
                onChange={handleChange}
                placeholder="e.g. 50000"
                min="0"
              />
            </div>

            <div className={styles.cardTitle} style={{ marginTop: "24px" }}>
              <span>🛡️ 3. Deductions & Exemptions (₹)</span>
            </div>

            <div className={styles.fieldGrid2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Section 80C (PPF, ELSS, EPF, LIC)</label>
                <input
                  className={styles.input}
                  type="number"
                  name="80C"
                  value={formData["80C"]}
                  onChange={handleChange}
                  placeholder="Max ₹1,50,000"
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Section 80D (Health Insurance)</label>
                <input
                  className={styles.input}
                  type="number"
                  name="80D"
                  value={formData["80D"]}
                  onChange={handleChange}
                  placeholder="e.g. 25000"
                  min="0"
                />
              </div>
            </div>

            <div className={styles.fieldGrid2}>
              <div className={styles.formGroup}>
                <label className={styles.label}>HRA Exemption</label>
                <input
                  className={styles.input}
                  type="number"
                  name="HRA"
                  value={formData.HRA}
                  onChange={handleChange}
                  placeholder="e.g. 120000"
                  min="0"
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Home Loan Interest Sec 24(b)</label>
                <input
                  className={styles.input}
                  type="number"
                  name="homeLoanInterest"
                  value={formData.homeLoanInterest}
                  onChange={handleChange}
                  placeholder="Max ₹2,00,000"
                  min="0"
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: "12px", marginTop: "20px" }}>
              <button type="submit" className={styles.submitBtn} style={{ flex: 1 }}>
                Calculate Estimated Tax
              </button>
              <button
                type="button"
                onClick={handleAISuggestions}
                disabled={loadingAI}
                className={styles.submitBtn}
                style={{
                  flex: 1,
                  background: "linear-gradient(135deg, #0A0C29 0%, #1C3F3A 100%)",
                }}
              >
                {loadingAI ? "AI Thinking..." : "✨ Get AI Advice"}
              </button>
            </div>
          </form>

          {/* Results Summary Box */}
          {showResults && taxResult && (
            <div className={styles.resultsContainer}>
              <div style={{ fontSize: "16px", fontWeight: "800", color: "#1C3F3A", marginBottom: "12px" }}>
                📊 Tax Calculation Summary
              </div>
              <div className={styles.resultItem}>
                <span>Selected Regime:</span>
                <strong>{taxResult.regime} Regime</strong>
              </div>
              <div className={styles.resultItem}>
                <span>Net Taxable Income:</span>
                <strong>₹{taxResult.taxableIncome.toLocaleString("en-IN")}</strong>
              </div>
              <div className={styles.resultItem}>
                <span>Estimated Annual Tax Payable:</span>
                <strong style={{ fontSize: "18px", color: "#1C3F3A" }}>
                  ₹{taxResult.tax.toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: AI Suggestions & Tax Guide */}
        <div>
          <div className={styles.glassCard}>
            <div className={styles.cardTitle}>
              <span>🤖 AI Tax-Saving Recommendations</span>
            </div>

            <div className={styles.suggestionsList}>
              {suggestions.length > 0 ? (
                suggestions.map((suggestion, index) => (
                  <div key={index} className={styles.suggestionItem}>
                    {suggestion}
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", color: "#5F7773", padding: "16px 0", fontSize: "13px" }}>
                  Fill in your income & deduction details, then click <strong>"✨ Get AI Advice"</strong> to get custom strategies to minimize your tax liability.
                </div>
              )}
            </div>
          </div>

          <div className={styles.generalTips}>
            <h3>💡 Key Deductions Checklist:</h3>
            <ul>
              <li><strong>Section 80C</strong> (Max ₹1.5L): PPF, EPF, ELSS Mutual Funds, Life Insurance.</li>
              <li><strong>Section 80D</strong>: Health Insurance for self (₹25k) + senior citizen parents (₹50k).</li>
              <li><strong>Section 24(b)</strong>: Home loan interest deduction up to ₹2,00,000.</li>
              <li><strong>Section 80CCD(1B)</strong>: Extra ₹50,000 deduction for NPS investments.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

