import "@/styles/globals.css";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Poppins } from "next/font/google";

const Navbar = dynamic(() => import("./navbar"), { ssr: false });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();

  return (
    <div className={poppins.className}>
      <Head>
        <title>Taxy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Navbar />
      <div key={router.asPath} className="page-zoom-transition">
        <Component {...pageProps} />
      </div>
    </div>
  );
}


