import "@/styles/globals.css";
import Head from "next/head";
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
      <Head>
        <title>Taxy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <Component {...pageProps} />
    </div>
  );
}

