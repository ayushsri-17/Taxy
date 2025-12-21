import "@/styles/globals.css";
import dynamic from "next/dynamic";
import { Poppins } from "next/font/google";

const Navbar = dynamic(() => import("./navbar"), { ssr: false });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={poppins.className}>
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}
