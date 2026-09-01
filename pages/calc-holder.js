// pages/calc-holder.js
import Link from "next/link";
import Image from "next/image";
import styles from "@/styles/calculator.module.css";

export default function CalcHolder() {
  const calculators = [
    {
      title: "Income Tax Calculator",
      tag: "🔥 FY 2025-26 Budget Slabs",
      desc: "Compare Old vs New Tax Regime with 80C, 80D, HRA & NPS deductions and instant savings recommendations.",
      img: "/itax.png",
      link: "/tax-calculator/income-tax",
    },
    {
      title: "GST Calculator",
      tag: "⚡ Inclusive & Exclusive",
      desc: "Compute GST for 0%, 5%, 12%, 18%, 28% slabs with CGST, SGST, and IGST interstate breakdown.",
      img: "/gst-calc.png",
      link: "/tax-calculator/gst",
    },
    {
      title: "Property Tax Calculator",
      tag: "🏠 Urban & Municipal",
      desc: "Calculate Annual Municipal Property Tax across BBMP, BMC, MCD, GCC, GHMC using Unit Area Value (UAV).",
      img: "/ptax.png",
      link: "/tax-calculator/property-tax",
    },
    {
      title: "Professional Tax Calculator",
      tag: "💼 State-Wise Slabs",
      desc: "State-specific PT calculations (MH, KA, WB, TN, TS, AP, GJ) with Section 16(iii) income tax deduction benefit.",
      img: "/protax.png",
      link: "/tax-calculator/professional-tax",
    },
    {
      title: "Customs & Import Duty Calculator",
      tag: "🚢 BCD + SWS + IGST",
      desc: "Calculate Basic Customs Duty, Social Welfare Surcharge, and Total Landed Cost on imported shipments.",
      img: "/ectax.png",
      link: "/tax-calculator/excise-imports",
    },
  ];

  return (
    <div className={styles.calcPageWrapper}>
      <Link href="/" className={styles.backLink}>
        ← Back to Home
      </Link>

      <div className={styles.calcHeader}>
        <div className={styles.calcBadge}>Financial Computation Suite</div>
        <h1 className={styles.calcTitle}>Tax Calculators</h1>
        <p className={styles.calcSubtitle}>
          Select a specialized tax calculator to compute taxes, compare regimes, and maximize legal deductions.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "24px",
          marginTop: "30px",
        }}
      >
        {calculators.map((calc, index) => (
          <Link
            href={calc.link}
            key={index}
            style={{ textDecoration: "none" }}
            className={styles.glassCard}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
              <span
                style={{
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  background: "rgba(28, 63, 58, 0.08)",
                  color: "#1C3F3A",
                  border: "1px solid rgba(28, 63, 58, 0.12)",
                }}
              >
                {calc.tag}
              </span>
              <div
                style={{
                  width: "56px",
                  height: "56px",
                  background: "rgba(246, 251, 250, 0.9)",
                  borderRadius: "14px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px",
                  boxShadow: "0 4px 12px rgba(28, 63, 58, 0.06)",
                }}
              >
                <img
                  src={calc.img}
                  alt={calc.title}
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              </div>
            </div>

            <div style={{ fontSize: "20px", fontWeight: "700", color: "#0A0C29", marginBottom: "8px" }}>
              {calc.title}
            </div>

            <div style={{ fontSize: "14px", color: "#5F7773", lineHeight: "1.5", marginBottom: "18px" }}>
              {calc.desc}
            </div>

            <div
              style={{
                fontSize: "14px",
                fontWeight: "600",
                color: "#1C3F3A",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              Open Calculator →
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}