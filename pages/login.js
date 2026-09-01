import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import styles from "../styles/component-holder.module.css";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const router = useRouter();

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/signup";
    const payload = isLogin
      ? { email: email.trim(), password }
      : { name: name.trim(), email: email.trim(), password };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "An error occurred. Please try again.");
        setLoading(false);
        return;
      }

      // Save token and user details
      if (data.token) {
        localStorage.setItem("token", data.token);
      }
      if (data.user?.name) {
        localStorage.setItem("userName", data.user.name);
      }
      if (data.user?.email) {
        localStorage.setItem("userEmail", data.user.email);
      }

      setSuccessMsg(isLogin ? `Welcome back, ${data.user?.name || "User"}!` : "Account created successfully!");

      // Redirect to home page
      setTimeout(() => {
        router.push("/");
      }, 800);
    } catch (error) {
      console.error("Auth request error:", error);
      setErrorMsg("Network error. Please make sure the server and database are reachable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.form}>
        <div style={{ marginBottom: "14px" }}>
          <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#0A0C29", margin: "0 0 4px 0" }}>
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>
          <p style={{ fontSize: "13px", color: "#5F7773", margin: "0" }}>
            {isLogin ? "Sign in to manage your tax profiles and calculations" : "Join TAXY to access personalized tax insights"}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className={styles.authToggleContainer} style={{ width: "100%" }}>
          <button
            type="button"
            className={isLogin ? styles.activeAuthTab : styles.authTab}
            onClick={() => {
              setIsLogin(true);
              setErrorMsg("");
              setSuccessMsg("");
            }}
          >
            Log In
          </button>
          <button
            type="button"
            className={!isLogin ? styles.activeAuthTab : styles.authTab}
            onClick={() => {
              setIsLogin(false);
              setErrorMsg("");
              setSuccessMsg("");
            }}
          >
            Sign Up
          </button>
        </div>

        {/* Alert Messages */}
        {errorMsg && <div className={styles.authAlertError} style={{ padding: "8px 12px", marginBottom: "10px" }}>⚠️ {errorMsg}</div>}
        {successMsg && <div className={styles.authAlertSuccess} style={{ padding: "8px 12px", marginBottom: "10px" }}>✅ {successMsg}</div>}

        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          {/* Name field for Sign Up only */}
          {!isLogin && (
            <div className={styles.formGroup} style={{ marginBottom: "10px" }}>
              <label className={styles.label} style={{ fontSize: "12px", marginBottom: "2px" }}>Full Name</label>
              <input
                className={styles.input}
                type="text"
                placeholder="e.g. Rahul Verma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
                style={{ padding: "8px 12px" }}
              />
            </div>
          )}

          <div className={styles.formGroup} style={{ marginBottom: "10px" }}>
            <label className={styles.label} style={{ fontSize: "12px", marginBottom: "2px" }}>Email Address</label>
            <input
              className={styles.input}
              type="email"
              placeholder="e.g. rahul@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: "8px 12px" }}
            />
          </div>

          <div className={styles.formGroup} style={{ marginBottom: "10px" }}>
            <label className={styles.label} style={{ fontSize: "12px", marginBottom: "2px" }}>Password</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: "8px 12px" }}
            />
          </div>

          <button
            className={styles.loginBtn}
            type="submit"
            disabled={loading}
            style={{ opacity: loading ? 0.7 : 1, padding: "11px", marginTop: "8px" }}
          >
            {loading
              ? (isLogin ? "Signing In..." : "Creating Account...")
              : (isLogin ? "Sign In →" : "Create Account →")}
          </button>

          <p style={{ fontSize: "12px", marginTop: "12px", marginBottom: "0", color: "#5F7773" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span
              style={{ color: "#1C3F3A", fontWeight: "700", cursor: "pointer", textDecoration: "underline" }}
              onClick={() => {
                setIsLogin(!isLogin);
                setErrorMsg("");
                setSuccessMsg("");
              }}
            >
              {isLogin ? "Sign Up here" : "Log In here"}
            </span>
          </p>

          <div style={{ marginTop: "12px", paddingTop: "10px", borderTop: "1px solid rgba(28,63,58,0.08)", fontSize: "11px", color: "#8A9C98" }}>
            🔒 End-to-end encrypted with bcrypt hashing & JWT session security.
          </div>
        </form>
      </div>
    </div>
  );
}



