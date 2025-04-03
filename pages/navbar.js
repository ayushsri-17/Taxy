import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/component-holder.module.css";

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); // Convert to boolean
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        router.push("/login"); // Redirect to login page
    };

    return (
        <nav className="navbar">
            <div className="nav-links">
                <Link href="/">Home</Link>
                <Link href="/#features">Features</Link>
                <Link href="/About">About</Link>
                {isLoggedIn ? (
                    <button onClick={handleLogout} className={styles.navLogoutBtn}>
                        Logout
                    </button>
                ) : (
                    <Link href="/login">
                        <button className={styles.navLoginBtn}>Login</button>
                    </Link>
                )}
            </div>
        </nav>
    );
}
