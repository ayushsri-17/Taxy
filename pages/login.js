import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/component-holder.module.css";

export default function Login() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    // Login Function
    const handleLogin = async (e) => {
        e.preventDefault();
    
        const response = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
        });
    
        const data = await response.json();
        console.log("Login Response:", data); // Debugging: See what API returns
    
        if (response.ok) {
            if (data.user && data.user.name) { 
                localStorage.setItem("token", data.token);
                localStorage.setItem("userName", data.user.name);
                alert(`Welcome ${data.user.name}!`);
                router.push("/");
            } else {
                alert("User data missing from response.");
            }
        } else {
            alert(data.message);
        }
    };

    // Signup Function
    const handleSignup = async (e) => {
        e.preventDefault();

        const response = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            alert("Signup Successful! Please log in.");
        } else {
            alert(data.message);
        }
    };

    return (
        <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={handleLogin}>
                <h1>Get Started</h1>
                
                {/* Name field only for Signup */}
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Name (Only for Signup)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className={styles.input}
                    type="email"
                    placeholder="E-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className={styles.input}
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                
                <button className={styles.loginBtn} type="submit">
                    Login
                </button>
                <button className={styles.signupBtn} type="button" onClick={handleSignup}>
                    Signup
                </button>
            </form>
        </div>
    );
}
