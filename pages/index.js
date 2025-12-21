import Image from "next/image";
import Link from 'next/link';
import Navbar from "./navbar";
import ScrollFloat from "@/components/Animations/ScrollFloat";
import CardSlide from "@/components/Animations/CardSlide";

export default function Home() {

  const features = [
    { title: "Tax Calculator", img: "calculator.png", link: "/calc-holder" },
    { title: "Ask Taxy", img: "folder.png", link: "/askTaxy" },
    { title: "Income/Expense Manager", img: "wallet.png", link: "/income-expense-manager" },
    { title: "Invoice Generator", img: "invoice.png", link: "/invoice-generator" },
    { title: "AI Tax-Filing Assistance", img: "tax-filler.png", link: "/taxfiling-assist" },
    { title: "News Box", img: "news.png", link: "/news-box" },
  ];

  return (
    <>
      <div className="container">
        <Navbar />
        <section className="section-1">

  {/* CENTER TEXT */}
          <div className="hero-text">
            <h1 className="title">Welcome to TAXY</h1>

            <h2 className="subtitle">
              Let's make your taxes easy and simple
            </h2>

            <p className="description">
              Managing taxes is often confusing, time-consuming, and prone to mistakes.
              From manual calculations to complex filing rules, users struggle to stay
              compliant while maximizing savings. Taxy simplifies the entire process by
              combining automation, AI-powered guidance, and real-time insights in one platform.
            </p>
          </div>

          {/* LEFT CARD */}
          <div className="card-element-left">
            <img src="star-left.png" className="star-left" />
          </div>

          {/* RIGHT CARD */}
          <div className="card-element-right">
            <img src="star-right.png" className="star-right" />
          </div>

        </section>
       
        <hr style={{border:"1px solid #1c3f3a", width:"70%",   margin: "0px auto"}} />
         <ScrollFloat
          animationDuration={1.5}
          ease="back.inOut(2)"
          scrollStart="center bottom+=50%"
          scrollEnd="bottom bottom-=40%"
          stagger={0.03}
        >
          Features
        </ScrollFloat>
        <hr style={{border:"1px solid #1c3f3a", width:"70%",   margin: "0px auto"}} />

        <section className="section-2">
       
          <div className="features-container">
            {features.map((feature, index) => (
              <Link href={feature.link} key={index}>
                <div id="feature-card">
                  {feature.title}
                 <div className="feature-image-container">
                    <Image
                      src={`/${feature.img}`}
                      alt={feature.title}
                      width={150}
                      height={150}
                      className="feature-image"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
        <hr style={{border:"1px solid #1c3f3a", width:"70%",   margin: "0px auto"}} />
        <ScrollFloat
            animationDuration={2}
            ease='back.inOut(2)'
            scrollStart='center bottom+=50%'
            scrollEnd='bottom bottom-=40%'
            stagger={0.03}
          >
            About
          </ScrollFloat>
        <hr style={{border:"1px solid #1c3f3a", width:"70%",   margin: "0px auto"}} />
        <section className="section-3">
          
          <div id="about">

          <div className="scroll-about">       
            <CardSlide direction="left">
              <div className="card">An all-in-one tax management platform that automates tax calculations, invoice generation, and financial tracking. Built with modern web technologies to simplify complex tax workflows and improve accuracy.</div>
            </CardSlide>

            <CardSlide direction="right" delay={0.15}>
              <div className="card">Features AskTaxy, an AI-driven tax advisory assistant that explains tax concepts in plain language, suggests saving strategies, and provides automated filing insights to reduce errors and optimize deductions.</div>
            </CardSlide>

            <CardSlide direction="left" delay={0.3}>
              <div className="card">Includes an income–expense manager, PDF invoice generator, and a live tax news feed that keeps users updated with the latest financial regulations, compliance changes, and budget announcements.</div>
            </CardSlide>
          </div>     
          </div>
        </section>
      </div>
      <hr style={{border:"40px solid #1c3f3a",}} />
    </>
  );
}
