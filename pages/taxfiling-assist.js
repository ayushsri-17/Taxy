import { useState, useEffect } from 'react';
import styles from "../styles/component-holder.module.css";
import { calculateTax } from '../components/taxFilingCalc';

export default function TaxFiling() {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    pan: '',
    employmentType: '',
    salaryIncome: '',
    businessIncome: '',
    otherIncome: '',
    "80C": '',
    "80D": '',
    HRA: '',
    homeLoanInterest: '',
    regime: 'Old',
  });

  const [errors, setErrors] = useState({});
  const [taxResult, setTaxResult] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loadingAI, setLoadingAI] = useState(false);


async function getAISuggestions(formData) {
  try {
    const response = await fetch("/api/tax-filing-assist", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ formData }),
  });

    const data = await response.json();

    if (!response.ok) {
      console.error("Backend API error:", data);
      return ["⚠️ Backend API error: " + (data.error?.message || "Unknown error")];
    }

    const text =
      data?.choices?.[0]?.message?.content?.[0]?.text ||
      data?.choices?.[0]?.message?.content ||
      "No AI suggestions generated.";

    return text
      .split(/\n(?=\d+\.|•|–|✅|💡|🏠|💰)/)
      .filter(Boolean);
  } catch (err) {
    console.error("AI suggestion error:", err);
    return ["⚠️ Error fetching AI suggestions."];
  }
}



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.age || isNaN(formData.age) || formData.age <= 0)
      newErrors.age = 'Age must be a positive number';

    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    if (!formData.pan || !panRegex.test(formData.pan))
      newErrors.pan = 'Enter a valid PAN';

    if (formData.salaryIncome && formData.salaryIncome < 0)
      newErrors.salaryIncome = 'Salary Income cannot be negative';

    if (formData.businessIncome && formData.businessIncome < 0)
      newErrors.businessIncome = 'Business Income cannot be negative';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleReset = () => {
    setFormData({
      name: '',
      age: '',
      pan: '',
      employmentType: '',
      salaryIncome: '',
      businessIncome: '',
      otherIncome: '',
      "80C": '',
      "80D": '',
      HRA: '',
      homeLoanInterest: '',
      regime: 'Old',
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
  setSuggestions(["Thinking..."]);


  await new Promise(resolve => setTimeout(resolve, 2000));

  const newSuggestions = await getAISuggestions(formData);
  setSuggestions(newSuggestions);
  setLoadingAI(false);
};


  return (
    <>
      <h1 className={styles.componentTitle}> AI Tax Filing Assistant</h1>
      <button className={styles.addBtn} onClick={handleReset}>Start a new filing ➕</button>
      <div className={styles.formAndSuggestionsContainer}>
        <div className={styles.formSection}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <h1>1. Personal Details</h1>
            <input className={styles.input} type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Name" />
            {errors.name && <p className={styles.error}>{errors.name}</p>}

            <input className={styles.input} type="number" name="age" value={formData.age} onChange={handleChange} placeholder="Age" />
            {errors.age && <p className={styles.error}>{errors.age}</p>}

            <input className={styles.input} type="text" name="pan" value={formData.pan} onChange={handleChange} placeholder="PAN" />
            {errors.pan && <p className={styles.error}>{errors.pan}</p>}

            <input className={styles.input} type="text" name="employmentType" value={formData.employmentType} onChange={handleChange} placeholder="Employment Type" />

            <label htmlFor="regime">Choose a regime:</label>
            <select className={styles.input} name="regime" value={formData.regime} onChange={handleChange}>
              <option value="Old">Old</option>
              <option value="New">New</option>
            </select>

            <h1>2. Income Details</h1>
            <input className={styles.input} type="number" name="salaryIncome" value={formData.salaryIncome} onChange={handleChange} placeholder="Salary Income" />
            {errors.salaryIncome && <p className={styles.error}>{errors.salaryIncome}</p>}

            <input className={styles.input} type="number" name="businessIncome" value={formData.businessIncome} onChange={handleChange} placeholder="Business Income" />
            {errors.businessIncome && <p className={styles.error}>{errors.businessIncome}</p>}

            <input className={styles.input} type="number" name="otherIncome" value={formData.otherIncome} onChange={handleChange} placeholder="Other Income (rent, interest, etc)" />

            <h1>3. Deductions</h1>
            <input className={styles.input} type="number" name="80C" value={formData["80C"]} onChange={handleChange} placeholder="80C (LIC, PPF, ELSS, etc.)" />
            <input className={styles.input} type="number" name="80D" value={formData["80D"]} onChange={handleChange} placeholder="80D (Health Insurance)" />
            <input className={styles.input} type="number" name="HRA" value={formData.HRA} onChange={handleChange} placeholder="HRA (if applicable)" />
            <input className={styles.input} type="number" name="homeLoanInterest" value={formData.homeLoanInterest} onChange={handleChange} placeholder="Home loan interest (Section 24B)" />

            <button onClick={handleAISuggestions} disabled={loadingAI} className={styles.submitBtn}>{loadingAI ? 'Thinking...' : 'Get AI Suggestions'}</button>
          </form>

          {showResults && taxResult && (
            <div className={styles.resultsContainer}>
              <h2>Tax Calculation Results</h2>
              <div className={styles.resultItem}>
                <span>Tax Regime:</span>
                <span>{taxResult.regime}</span>
              </div>
              <div className={styles.resultItem}>
                <span>Taxable Income:</span>
                <span>₹{taxResult.taxableIncome.toLocaleString('en-IN')}</span>
              </div>
              <div className={styles.resultItem}>
                <span>Estimated Tax Liability:</span>
                <span>₹{taxResult.tax.toLocaleString('en-IN')}</span>
              </div>
              <div className={styles.taxNote}>
                <p>Note: {formData.regime === 'Old' 
                  ? 'Old regime calculations include all applicable deductions.'
                  : 'New regime has lower tax rates but fewer deductions.'}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className={styles.suggestionsContainer}>
          <h2 style={{fontWeight:'900'}}>Ai Tax Saving Tips</h2>
          <div className={styles.suggestionsList}>
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <div key={index} className={styles.suggestionItem}>
                  {suggestion}
                </div>
              ))
            ) : (
              <p>Fill in some details to get personalized AI tax-saving suggestions</p>
            )}
          </div>
          <div className={styles.generalTips}>
            <h3>Common Tax Saving Options:</h3>
            <ul>
              <li>Section 80C (₹1.5L limit): PPF, ELSS, NSC, Tax-saving FDs</li>
              <li>Section 80D: Health insurance premiums</li>
              <li>Section 24: Home loan interest (up to ₹2L)</li>
              <li>HRA: House Rent Allowance exemption</li>
              <li>NPS: Additional ₹50,000 under 80CCD(1B)</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
