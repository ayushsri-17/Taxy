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

  const generateSuggestions = (data) => {
    const newSuggestions = [];
    const totalIncome = parseFloat(data.salaryIncome || 0) + 
                        parseFloat(data.businessIncome || 0) + 
                        parseFloat(data.otherIncome || 0);

    newSuggestions.push("✅ Always file your return before the due date to avoid penalties");
    newSuggestions.push("✅ Keep all investment proofs and documents handy for verification");

    if (totalIncome > 500000) {
      newSuggestions.push("💡 Consider investing more in Section 80C instruments (max ₹1.5L) to reduce taxable income");
    }

    if (totalIncome > 1000000) {
      newSuggestions.push("💡 Explore tax-free bonds for additional tax-free income");
    }

    if (parseFloat(data["80C"] || 0) < 150000) {
      newSuggestions.push("💰 You can invest up to ₹1.5L in 80C instruments (PPF, ELSS, NSC, etc.) for tax savings");
    }

    if (parseFloat(data["80D"] || 0) < 25000) {
      newSuggestions.push("🏥 Consider health insurance (up to ₹25,000 for self, up to ₹50,000 for senior citizens) under 80D");
    }

    if (parseFloat(data.homeLoanInterest || 0) === 0 && totalIncome > 1000000) {
      newSuggestions.push("🏠 Home loan interest (Section 24) can give additional deduction up to ₹2L - consider if planning to buy property");
    }

    if (data.regime === 'Old') {
      newSuggestions.push("🔍 Compare with New regime - it might be beneficial if you don't have many deductions");
    } else {
      newSuggestions.push("🔍 Compare with Old regime - it might be beneficial if you have significant deductions");
    }

    if (parseInt(data.age) >= 60) {
      newSuggestions.push("👵 Senior citizens get higher exemption limits - ensure you're claiming them");
    }

    return newSuggestions;
  };

  useEffect(() => {
    if (formData.age || formData.salaryIncome || formData.businessIncome) {
      setSuggestions(generateSuggestions(formData));
    }
  }, [formData]);

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

  return (
    <>
      <h1 className={styles.componentTitle}>Tax Filing Assistant</h1>
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

            <button type="submit" className={styles.submitBtn}>Calculate Tax</button>
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
          <h2 style={{fontWeight:'900'}}>Tax Saving Tips</h2>
          <div className={styles.suggestionsList}>
            {suggestions.length > 0 ? (
              suggestions.map((suggestion, index) => (
                <div key={index} className={styles.suggestionItem}>
                  {suggestion}
                </div>
              ))
            ) : (
              <p>Fill in some details to get personalized tax-saving suggestions</p>
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
