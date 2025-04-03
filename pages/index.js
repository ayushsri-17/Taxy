import Image from "next/image";
import Link from 'next/link';
import Navbar from "./navbar";

export default function Home() {
  
  const features = [
    { title: "Tax Calculator", img: "calculator.png", link: "/calc-holder" },
    { title: "Document Holder", img: "folder.png", link: "/document-holder" },
    { title: "Income-Expense Manager", img: "wallet.png", link: "/income-expense-manager" },
    { title: "Invoice Generator", img: "invoice.png", link: "/invoice-generator" },
    { title: "Tax-Filing Assistance", img: "tax-filler.png", link: "/taxfiling-assist" },
    { title: "News Box", img: "news.png", link: "/news-box" },
  ];
  
  
  return (
    <>
    <div className="container">
    <Navbar/>
    <section className="section-1">
       <h1 className="title">Welcome to TAXY</h1>
       <h1 style={{fontSize:"35px",fontWeight:"600"}}>Let's make your taxes easy and simple</h1>
    
     </section> 

     <section className="section-2">
      <h1 style={{fontSize:"60px",fontWeight:"600"}}>Features</h1>
      
      <div className="features-container">
        {features.map((feature, index)=>(
         <Link href={feature.link} key={index}>
        <div id="features">
        {feature.title}
        <img src={feature.img}></img>
        </div>
        </Link> 
        ))}
      </div>
     </section>
    </div>
    </>
  )
}
