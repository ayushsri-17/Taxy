import { useReducer } from "react";
import styles from '@/styles/calculator.module.css';

const initialState = {
    salary: '',
    taxRegime: "old",
    hra: 0,
    standardDeduction: 50000,
    deductions80C: 0,
    deductions80D: 0,    
    deductions80E: 0,
    deductions80G: 0,
    homeLoanInterest: 0,
    tax: 0,
    taxBreakdown: ""
};

const calculateTax = (income, slabs) => {
    let tax = 0;
    let previousLimit = 0;

    for (let slab of slabs) {
        if (income > slab.limit) {
            tax += (slab.limit - previousLimit) * slab.rate; 
            previousLimit = slab.limit;
        } else {
            tax += (income - previousLimit) * slab.rate;
            break;
        }
    }
    return tax;
};

const taxReducer = (state, action) => {
    switch (action.type) {
        case "SET_SALARY":
            return { ...state, salary: Number(action.payload) || 0 };
        case "SET_TAX_REGIME":
            return { ...state, taxRegime: action.payload };
        case "SET_HRA":
            return { ...state, hra: Number(action.payload) || 0 };
        case "SET_80C":
            return { ...state, deductions80C: Number(action.payload) || 0 };
        case "SET_80D":
            return { ...state, deductions80D: Number(action.payload) || 0 };
        case "SET_80E":
            return { ...state, deductions80E: Number(action.payload) || 0 };
        case "SET_80G":
            return { ...state, deductions80G: Number(action.payload) || 0 };
        case "SET_HOME_LOAN":
            return { ...state, homeLoanInterest: Number(action.payload) || 0 };
        case "CALCULATE_TAX": {
            let taxableIncome = state.salary;
            let totalDeductions = state.standardDeduction;

            if (state.taxRegime === "old") {
                totalDeductions += state.hra + state.deductions80C + state.deductions80D + state.deductions80E + state.deductions80G + state.homeLoanInterest;
            }
            
            taxableIncome -= totalDeductions;
            taxableIncome = Math.max(taxableIncome, 0);

            const oldRegimeSlabs = [
                { limit: 250000, rate: 0 },
                { limit: 500000, rate: 0.05 },
                { limit: 1000000, rate: 0.2 },
                { limit: Infinity, rate: 0.3 }  // 30% tax for income above ₹10,00,000
            ];
            
            const newRegimeSlabs = [
                { limit: 300000, rate: 0 },
                { limit: 600000, rate: 0.05 },
                { limit: 900000, rate: 0.1 },
                { limit: 1200000, rate: 0.15 },
                { limit: 1500000, rate: 0.2 },
                { limit: Infinity, rate: 0.3 }
            ];
            

            let slabs = state.taxRegime === "old" ? oldRegimeSlabs : newRegimeSlabs;
            let tax = calculateTax(taxableIncome, slabs);

            // Apply rebate if applicable
            if ((state.taxRegime === "old" && taxableIncome <= 500000) || 
                    (state.taxRegime === "new" && taxableIncome <= 700000)) {
                    tax = 0;
                }


            let notEligible = state.taxRegime === "old" ? taxableIncome <= 250000 : taxableIncome <= 300000;
            let taxSummary = notEligible ? `Not eligible for tax (Taxable Income: ₹${taxableIncome})` : `
                Tax Regime: ${state.taxRegime.toUpperCase()}
                Gross Salary: ₹${state.salary}
                Total Deductions: ₹${totalDeductions}
                Taxable Income: ₹${taxableIncome}
                Final Tax Payable: ₹${tax.toFixed(2)}
            `;


            return { ...state, tax, taxBreakdown: taxSummary };
        }
        case "RESET":
            return initialState;
        default:
            return state;
    }
};

export default function IncomeTaxCalculator() {
    const [state, dispatch] = useReducer(taxReducer, initialState);

    return (
        <>
        <h2 className={styles.calcTitle}>Income Tax Calculator</h2>
        <div className={styles.calcContainer}>
        <div className={styles.calc}>

                <input className={styles.input} type="number" placeholder="Enter Salary" value={state.salary || ''} onChange={(e) => dispatch({ type: "SET_SALARY", payload: e.target.value })} />

                <select className={styles.input} value={state.taxRegime} onChange={(e) => dispatch({ type: "SET_TAX_REGIME", payload: e.target.value })}>
                    <option value="old">Old Tax Regime</option>
                    <option value="new">New Tax Regime</option>
                </select>

                {state.taxRegime === "old" && (
                    <>
                        <input className={styles.input} type="number" placeholder="Enter HRA" value={state.hra || ''} onChange={(e) => dispatch({ type: "SET_HRA", payload: e.target.value })} />
                        <input className={styles.input} type="number" placeholder="80C Deductions" value={state.deductions80C || ''} onChange={(e) => dispatch({ type: "SET_80C", payload: e.target.value })} />
                        <input className={styles.input} type="number" placeholder="80D (Medical Insurance)" value={state.deductions80D || ''} onChange={(e) => dispatch({ type: "SET_80D", payload: e.target.value })} />
                        <input className={styles.input} type="number" placeholder="80E (Education Loan Interest)" value={state.deductions80E || ''} onChange={(e) => dispatch({ type: "SET_80E", payload: e.target.value })} />
                        <input className={styles.input} type="number" placeholder="80G (Donations)" value={state.deductions80G || ''} onChange={(e) => dispatch({ type: "SET_80G", payload: e.target.value })} />
                        <input className={styles.input} type="number" placeholder="Home Loan Interest" value={state.homeLoanInterest || ''} onChange={(e) => dispatch({ type: "SET_HOME_LOAN", payload: e.target.value })} />
                    </>
                )}

                <button className={styles.calcBtn} onClick={() => dispatch({ type: "CALCULATE_TAX" })}>Calculate Tax</button>
                <button className={styles.calcBtn} onClick={() => dispatch({ type: "RESET" })}>Reset</button>

                <h3>Tax Payable: ₹{typeof state.tax === 'number' ? state.tax.toFixed(2) : state.tax}</h3>
                <h1 className={styles.taxBreakdown}>{state.taxBreakdown}</h1>
            </div> 
            
        </div>
        </>
    );  
}  
