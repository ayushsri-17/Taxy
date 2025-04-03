// pages/tax-calculator/[calculator].js
import { useRouter } from "next/router";
import GSTCalculator from "../../components/calculators/GSTCalculator";
import IncomeTaxCalculator from "../../components/calculators/IncomeTaxCalculator";
import PropertyTaxCalculator from  "../../components/calculators/PropertyTaxCalculator"
import ProfessionalTaxCalculator from  "../../components/calculators/ProfessionalTaxCalculator"
import ExciseImportsTaxCalculator from  "../../components/calculators/ExciseImportsTaxCalculator"

const calculators = {
  gst: GSTCalculator,
  "income-tax": IncomeTaxCalculator,
  "property-tax": PropertyTaxCalculator,
  "professional-tax":ProfessionalTaxCalculator,
  "excise-imports": ExciseImportsTaxCalculator,
};

export default function CalculatorPage() {
  const router = useRouter();
  const { calculator } = router.query;

  const CalculatorComponent = calculators[calculator?.toLowerCase()];

  return (
    <div>
      {CalculatorComponent ? (
        <CalculatorComponent />
      ) : (
        <h2>Calculator not found</h2>
      )}
    </div>
  );
}
