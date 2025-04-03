"use client";
import React, { useState } from 'react';
import styles from '@/styles/calculator.module.css';

export default function PropertyTaxCalculator() {
  const [propertyType, setPropertyType] = useState("residential");
  const [propertyUsage, setPropertyUsage] = useState("self");
  const [propertySize, setPropertySize] = useState(0);
  const [numFloors, setNumFloors] = useState(1);
  const [constructionYear, setConstructionYear] = useState(2024);
  const [location, setLocation] = useState("urban");
  const [marketValue, setMarketValue] = useState(0);
  const [baseTaxRate, setBaseTaxRate] = useState(0);
  const [waterTax, setWaterTax] = useState(2);
  const [sewageTax, setSewageTax] = useState(1);
  const [fireTax, setFireTax] = useState(500);
  const [discount, setDiscount] = useState(0);
  const [latePenalty, setLatePenalty] = useState(5);
  const [finalTax, setFinalTax] = useState(0);

  // Tax Calculation
  const calculateTax = () => {
    if (!marketValue || !baseTaxRate) {
      setFinalTax(0);
      return;
    }

    let basePropertyTax = marketValue * (baseTaxRate / 100);
    let totalAdditionalTaxes = (marketValue * (waterTax / 100)) + (marketValue * (sewageTax / 100)) + fireTax;
    let totalTaxBeforeDiscount = basePropertyTax + totalAdditionalTaxes;
    let discountAmount = totalTaxBeforeDiscount * (discount / 100);
    let taxAfterDiscount = totalTaxBeforeDiscount - discountAmount;
    let penaltyAmount = taxAfterDiscount * (latePenalty / 100);
    let finalTaxAmount = parseFloat(taxAfterDiscount + penaltyAmount).toFixed(2);

    setFinalTax(finalTaxAmount);
  };

  // Reset Form
  const resetForm = () => {
    setPropertyType("residential");
    setPropertyUsage("self");
    setPropertySize(0);
    setNumFloors(1);
    setConstructionYear(2024);
    setLocation("urban");
    setMarketValue(0);
    setBaseTaxRate(0);
    setWaterTax(2);
    setSewageTax(1);
    setFireTax(500);
    setDiscount(0);
    setLatePenalty(5);
    setFinalTax(0);
  };

  return (
    <>
     <h2 className={styles.calcTitle}>Property Tax Calculator</h2>
     <div className={styles.calcContainer}>
     <div className={styles.calc}>

      <select  className={styles.input} value={propertyType} onChange={(e) => setPropertyType(e.target.value)}>
        <option value="residential">Residential</option>
        <option value="commercial">Commercial</option>
        <option value="industrial">Industrial</option>
        <option value="agricultural">Agricultural</option>
      </select>

      <select className={styles.input} value={propertyUsage} onChange={(e) => setPropertyUsage(e.target.value)}>
        <option value="self">Self-Occupied</option>
        <option value="rented">Rented</option>
        <option value="vacant">Vacant</option>
        <option value="mixed">Mixed-Use</option>
      </select>

      <input className={styles.input} type="number" value={propertySize} placeholder="Property Size (sq. ft)" onChange={(e) => setPropertySize(Number(e.target.value) || 0)} required />

      <input className={styles.input} type="number" value={numFloors} placeholder="Number of Floors" onChange={(e) => setNumFloors(Number(e.target.value) || 1)} required />

      <input  className={styles.input}type="number" value={constructionYear} placeholder="Construction Year" min="1900" max="2025" onChange={(e) => setConstructionYear(Number(e.target.value) || 2024)} required />

      <select className={styles.input} value={location} onChange={(e) => setLocation(e.target.value)}>
        <option value="urban">Urban</option>
        <option value="semi-urban">Semi-Urban</option>
        <option value="rural">Rural</option>
      </select>

      <input className={styles.input} type="number" value={marketValue} placeholder="Market Value" onChange={(e) => setMarketValue(Number(e.target.value) || 0)} required />

      <input className={styles.input}type="number" value={baseTaxRate} placeholder="Base Tax Rate (%)" onChange={(e) => setBaseTaxRate(Number(e.target.value) || 0)} required />

      <input className={styles.input} type="number" value={waterTax} placeholder="Water Tax Rate (%)" onChange={(e) => setWaterTax(Number(e.target.value) || 2)} required />

      <input className={styles.input} type="number" value={sewageTax} placeholder="Sewage Tax Rate (%)" onChange={(e) => setSewageTax(Number(e.target.value) || 1)} required />

      <input  className={styles.input}type="number" value={fireTax} placeholder="Fire Tax (Fixed Amount)" onChange={(e) => setFireTax(Number(e.target.value) || 500)} required />

      <input  className={styles.input}type="number" value={discount} placeholder="Discount (%)" onChange={(e) => setDiscount(Number(e.target.value) || 0)} />

      <input  className={styles.input}type="number" value={latePenalty} placeholder="Late Penalty (%)" onChange={(e) => setLatePenalty(Number(e.target.value) || 5)} />

      <button className={styles.calcBtn} onClick={calculateTax} disabled={!marketValue || !baseTaxRate}>
        Calculate Tax
      </button>
      <button className={styles.calcBtn} onClick={resetForm}>Reset</button>

      <h3>Final Property Tax Payable: ₹ <span>{finalTax}</span></h3>
    </div>
    </div>
    </>
  );
}
