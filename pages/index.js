import Image from "next/image";
import Link from 'next/link';
import CardSlide from "@/components/Animations/CardSlide";

export default function Home() {
  const features = [
    {
      title: "Tax Calculator",
      tag: "⚡ FY 2025-26 Ready",
      desc: "Calculate Income Tax, GST, Capital Gains, Professional & Property tax under Old vs New regime.",
      img: "calculator.png",
      link: "/calc-holder",
    },
    {
      title: "Ask Taxy",
      tag: "🤖 AI Advisory",
      desc: "Instant intelligent tax assistant to decode deductions, exemptions, and complex tax queries.",
      img: "folder.png",
      link: "/askTaxy",
    },
    {
      title: "Income/Expense Manager",
      tag: "📊 Smart Tracker",
      desc: "Log daily earnings and expenditures with automated monthly tax liability forecasts.",
      img: "wallet.png",
      link: "/income-expense-manager",
    },
    {
      title: "Invoice Generator",
      tag: "📄 Instant PDF",
      desc: "Generate professional, GST-compliant invoices with downloadable receipts in seconds.",
      img: "invoice.png",
      link: "/invoice-generator",
    },
    {
      title: "AI Tax-Filing Assistance",
      tag: "✨ Smart Filing",
      desc: "Step-by-step guided filing recommendations to maximize legal deductions and avoid penalties.",
      img: "tax-filler.png",
      link: "/taxfiling-assist",
    },
    {
      title: "News Box",
      tag: "📰 Live Updates",
      desc: "Real-time feed of latest Union Budget updates, CBDT circulars, and tax policy changes.",
      img: "news.png",
      link: "/news-box",
    },
  ];

  const stats = [
    { num: "6+", label: "Financial & Tax Tools" },
    { num: "Old vs New", label: "Smart Regime Analysis" },
    { num: "AI-Powered", label: "Instant Advisory" },
    { num: "100% Free", label: "Client-Side Privacy" },
  ];

  return (
    <>
      <div className="container">
        {/* HERO SECTION */}
        <section className="section-1">
          {/* Glass Hero Card */}
          <div className="hero-glass-card">
            <div className="hero-badge">
              <span>✦</span> Intelligent Indian Tax & Finance Suite <span>✦</span>
            </div>

            <h1 className="title">
              Tax Intelligence, <span className="title-gradient">Elevated.</span>
            </h1>

            <h2 className="subtitle">
              Precision planning, automated computations, and effortless compliance.
            </h2>

            <p className="description">
              Taxy redefines personal and business taxation with institutional rigor.
              Compare Old vs New regimes, track tax-deductible ledgers, generate GST-compliant invoices,
              and receive instant AI advisory — all calibrated for flawless accuracy and zero clutter.
            </p>

            {/* Hero CTAs */}
            <div className="hero-cta-group">
              <Link href="/calc-holder" className="btn-primary-glass">
                <span>⚡</span> Launch Tax Calculators →
              </Link>
              <Link href="/askTaxy" className="btn-secondary-glass">
                <span>🤖</span> Consult Ask Taxy AI
              </Link>
            </div>
          </div>
        </section>

        {/* STATS TRUST STRIP */}
        <div className="stats-strip">
          {stats.map((stat, idx) => (
            <div className="stat-item" key={idx}>
              <div className="stat-num">{stat.num}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* FEATURES SECTION */}
        <div className="section-header" id="feature-card">
          <div className="section-badge">Institutional Toolkit</div>
          <h2 className="section-heading">Engineered for Precision</h2>
          <p className="section-subheading">
            Dedicated modules crafted to simplify computations, audits, invoices, and deductions.
          </p>
        </div>

        <section className="section-2">
          <div className="features-container">
            {features.map((feature, index) => (
              <Link href={feature.link} key={index} id="feature-card">
                <div className="feature-top-bar">
                  <span className="feature-tag">{feature.tag}</span>
                  <div className="feature-image-container">
                    <Image
                      src={`/${feature.img}`}
                      alt={feature.title}
                      width={44}
                      height={44}
                      className="feature-image"
                    />
                  </div>
                </div>

                <div className="feature-title">{feature.title}</div>
                <div className="feature-desc">{feature.desc}</div>
                <div className="feature-link">
                  Open Engine <span>→</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ABOUT SECTION */}
        <div className="section-header" id="about">
          <div className="section-badge">The Philosophy</div>
          <h2 className="section-heading">Built on Clarity & Discretion</h2>
          <p className="section-subheading">
            Designed for salaried leaders, independent consultants, and modern enterprises.
          </p>
        </div>

        <section className="section-3">
          <div className="scroll-about">
            <CardSlide direction="left">
              <div className="card">
                🏛️ <strong>I. Unified Financial Architecture:</strong> An end-to-end tax suite that automates regime comparisons, property unit calculations, and GST invoice generation with zero room for human error.
              </div>
            </CardSlide>

            <CardSlide direction="right" delay={0.15}>
              <div className="card">
                🤖 <strong>II. Institutional AI Advisory:</strong> AskTaxy interprets complex tax circulars, evaluates Section 80C/80D scenarios, and formulates compliant savings strategies in clear, actionable terms.
              </div>
            </CardSlide>

            <CardSlide direction="left" delay={0.3}>
              <div className="card">
                🛡️ <strong>III. Real-Time Ledger & Privacy:</strong> Built client-first with tax-deductible tracking, instant PDF documentation, and uninterrupted live circular feeds from CBDT and Union Budgets.
              </div>
            </CardSlide>
          </div>
        </section>
      </div>

      {/* GLASS FOOTER */}
      <footer className="footer-glass">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">TAXY</div>
            <p className="footer-text">
              Making taxation simple, accessible, and automated for everyone. Plan smart, save legally, and file with complete confidence.
            </p>
          </div>

          <div className="footer-links-group">
            <div className="footer-col">
              <h4>Tools</h4>
              <ul>
                <li><Link href="/calc-holder">Tax Calculators</Link></li>
                <li><Link href="/askTaxy">Ask Taxy AI</Link></li>
                <li><Link href="/income-expense-manager">Income Tracker</Link></li>
                <li><Link href="/invoice-generator">Invoice Generator</Link></li>
                <li><Link href="/taxfiling-assist">Filing Assistance</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <h4>Quick Links</h4>
              <ul>
                <li><Link href="/#feature-card">All Features</Link></li>
                <li><Link href="/#about">About Platform</Link></li>
                <li><Link href="/news-box">Tax News Feed</Link></li>
                <li><Link href="/login">Account Login</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} TAXY. All rights reserved.</div>
          <div>Calculations are indicative for planning and educational purposes.</div>
        </div>
      </footer>
    </>
  );
}

