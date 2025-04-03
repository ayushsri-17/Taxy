// pages/calc-holder.js
import Link from "next/link";
import styles from '../styles/component-holder.module.css';
import GSTCalculator from "@/components/calculators/GSTCalculator";

export default function CalcHolder() {
  const calculators = [
    { title: "GST", img: "/gst-calc.png", link: "/tax-calculator/gst"},
    { title: "Income Tax", img: "/itax.png", link: "/tax-calculator/income-tax" },
    { title: "Property Tax", img: "/ptax.png", link: "/tax-calculator/property-tax" },
    { title: "Professional Tax", img: "/protax.png", link: "/tax-calculator/professional-tax" },
    { title: "Excise Duty & Customs Duty", img: "/ectax.png", link: "/tax-calculator/excise-imports" },
  ];

  return (
    <>
      <h1 className={styles.componentTitle}>
        Tax Calculators
      </h1>

      <div className={styles.calcContainer}>
        {calculators.map((calculator, index) => (
          <Link href={calculator.link} key={index}>
            <div className={styles.calcs}>
              {calculator.title}
              <img src={calculator.img} alt={calculator.title} />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}