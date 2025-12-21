import "@/styles/globals.css";
import Navbar from './navbar';
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export default function MyApp({ Component, pageProps }) {
  return (
    <div className={poppins.className}>
      <Navbar/>
      <Component {...pageProps} />
    </div>
  );
}
