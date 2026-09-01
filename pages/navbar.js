import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/component-holder.module.css";

export default function Navbar() {
    const [mounted, setMounted] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState("");
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        const token = localStorage.getItem("token");
        const name = localStorage.getItem("userName");
        setIsLoggedIn(!!token);
        setUserName(name || "");
    }, [router.pathname]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userName");
        localStorage.removeItem("userEmail");
        setIsLoggedIn(false);
        setUserName("");
        router.push("/login");
    };

    return (
        <nav className="navbar">
            <div className="nav-links">
                <Link href="/">Home</Link>
                <Link href="/#feature-card">Features</Link>
                <Link href="/#about">About</Link>
                {mounted && isLoggedIn ? (
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "10px" }}>
                        {userName && (
                            <span style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff" }}>
                                Hi, {userName}
                            </span>
                        )}
                        <button onClick={handleLogout} className={styles.navLogoutBtn}>
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link href="/login">
                        <button className={styles.navLoginBtn}>Login</button>
                    </Link>
                )}
            </div>
        </nav>
    );
}


