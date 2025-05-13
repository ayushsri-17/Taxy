// utils/taxCalculator.js

export const calculateTax = (formData) => {
  // Convert all amounts to numbers
  const salaryIncome = parseFloat(formData.salaryIncome) || 0;
  const businessIncome = parseFloat(formData.businessIncome) || 0;
  const otherIncome = parseFloat(formData.otherIncome) || 0;
  const deduction80C = parseFloat(formData["80C"]) || 0;
  const deduction80D = parseFloat(formData["80D"]) || 0;
  const hra = parseFloat(formData.HRA) || 0;
  const homeLoanInterest = parseFloat(formData.homeLoanInterest) || 0;
  const age = parseInt(formData.age) || 0;

  // Calculate gross total income
  const grossTotalIncome = salaryIncome + businessIncome + otherIncome;

  // Calculate taxable income based on regime
  if (formData.regime === 'New') {
    // New regime has fewer deductions
    const standardDeduction = salaryIncome > 0 ? 50000 : 0;
    const taxableIncome = Math.max(0, grossTotalIncome - standardDeduction);
    return calculateNewRegimeTax(taxableIncome);
  } else {
    // Old regime with full deductions
    const totalDeductions = calculateOldRegimeDeductions(
      deduction80C,
      deduction80D,
      hra,
      homeLoanInterest,
      salaryIncome,
      age
    );
    const taxableIncome = Math.max(0, grossTotalIncome - totalDeductions);
    return calculateOldRegimeTax(taxableIncome, age);
  }
};

const calculateOldRegimeTax = (taxableIncome, age) => {
  let tax = 0;
  const isSeniorCitizen = age >= 60;
  const isSuperSeniorCitizen = age >= 80;

  // Tax slabs for Old Regime (FY 2023-24)
  if (isSuperSeniorCitizen) {
    if (taxableIncome > 1000000) {
      tax += (taxableIncome - 1000000) * 0.3;
      taxableIncome = 1000000;
    }
    if (taxableIncome > 500000) {
      tax += (taxableIncome - 500000) * 0.2;
      taxableIncome = 500000;
    }
  } else if (isSeniorCitizen) {
    if (taxableIncome > 1000000) {
      tax += (taxableIncome - 1000000) * 0.3;
      taxableIncome = 1000000;
    }
    if (taxableIncome > 500000) {
      tax += (taxableIncome - 500000) * 0.2;
      taxableIncome = 500000;
    }
    if (taxableIncome > 300000) {
      tax += (taxableIncome - 300000) * 0.05;
    }
  } else {
    if (taxableIncome > 1000000) {
      tax += (taxableIncome - 1000000) * 0.3;
      taxableIncome = 1000000;
    }
    if (taxableIncome > 500000) {
      tax += (taxableIncome - 500000) * 0.2;
      taxableIncome = 500000;
    }
    if (taxableIncome > 250000) {
      tax += (taxableIncome - 250000) * 0.05;
    }
  }

  // Add cess
  tax += tax * 0.04;

  return {
    taxableIncome,
    tax: Math.round(tax),
    regime: 'Old',
  };
};

const calculateNewRegimeTax = (taxableIncome) => {
  let tax = 0;

  // Tax slabs for New Regime (FY 2023-24)
  if (taxableIncome > 1500000) {
    tax += (taxableIncome - 1500000) * 0.3;
    taxableIncome = 1500000;
  }
  if (taxableIncome > 1200000) {
    tax += (taxableIncome - 1200000) * 0.2;
    taxableIncome = 1200000;
  }
  if (taxableIncome > 900000) {
    tax += (taxableIncome - 900000) * 0.15;
    taxableIncome = 900000;
  }
  if (taxableIncome > 600000) {
    tax += (taxableIncome - 600000) * 0.1;
    taxableIncome = 600000;
  }
  if (taxableIncome > 300000) {
    tax += (taxableIncome - 300000) * 0.05;
  }

  // Add cess
  tax += tax * 0.04;

  return {
    taxableIncome,
    tax: Math.round(tax),
    regime: 'New',
  };
};

const calculateOldRegimeDeductions = (deduction80C, deduction80D, hra, homeLoanInterest, salaryIncome, age) => {
  // Section 80C deductions (max 1.5 lakh)
  const sec80C = Math.min(deduction80C, 150000);
  
  // Section 80D deductions (25k for <60, 50k for 60+)
  const sec80DLimit = age >= 60 ? 50000 : 25000;
  const sec80D = Math.min(deduction80D, sec80DLimit);
  
  // HRA exemption (minimum of: actual HRA, 50% of salary, or rent paid - 10% of salary)
  // Simplified version - using minimum of HRA or 50% of salary
  const hraExemption = salaryIncome > 0 ? Math.min(hra, salaryIncome * 0.5) : 0;
  
  // Section 24 (home loan interest - max 2 lakh)
  const sec24 = Math.min(homeLoanInterest, 200000);
  
  // Standard deduction (50k for salaried)
  const standardDeduction = salaryIncome > 0 ? 50000 : 0;
  
  return sec80C + sec80D + hraExemption + sec24 + standardDeduction;
};