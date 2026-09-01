import "@/styles/globals.css";
import Head from "next/head";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Poppins } from "next/font/google";

const Navbar = dynamic(() => import("./navbar"), { ssr: false });

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let timer;

    const handleStart = (url) => {
      // If navigating to a different path, trigger the luxury transition
      if (url !== router.asPath) {
        setLoading(true);
      }
    };

    const handleComplete = () => {
      // Provide an intentional, smooth reveal pause
      timer = setTimeout(() => {
        setLoading(false);
      }, 450);
    };

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      clearTimeout(timer);
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return (
    <div className={poppins.className}>
      <Head>
        <title>TAXY — The Intelligent Tax & Finance Suite</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Navbar />

      {/* Luxury Old Money Transition Loader */}
      {loading && (
        <div className="lux-loader-overlay">
          <div className="lux-loader-content">
            <div className="lux-loader-badge">✦ TAXY FINANCIAL ENGINE ✦</div>
            <h2 className="lux-loader-title">Preparing Module</h2>
            <div className="lux-loader-bar">
              <div className="lux-loader-progress" />
            </div>
            <div className="lux-loader-text">Loading secure financial environment...</div>
          </div>
        </div>
      )}

      {/* Page Content with Smooth Transition */}
      <div key={router.asPath} className="page-transition-wrapper">
        <Component {...pageProps} />
      </div>
    </div>
  );
}


