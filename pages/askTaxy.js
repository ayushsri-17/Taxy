import { useState } from "react";
import Link from "next/link";
import styles from "../styles/component-holder.module.css";

const QUICK_PROMPTS = [
  "How to save tax on ₹12 Lakh salary under New Regime?",
  "What are the standard deduction rules for FY 2025-26?",
  "How much can I claim under Section 80D for parents?",
  "Is HRA exemption allowed in the New Tax Regime?",
  "What is the penalty for late ITR filing?",
];

export default function AskTaxy() {
  const [inputData, setInputData] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  async function getAIResults(question) {
    try {
      setLoading(true);
      const res = await fetch("/api/ask-taxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputData: question }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API error:", data);
        return [
          "⚠️ API error: " + (data.error?.message || "Unknown error occurred. Please ensure your Gemini/OpenAI API key is configured."),
        ];
      }

      const text =
        data?.choices?.[0]?.message?.content?.[0]?.text ||
        data?.choices?.[0]?.message?.content ||
        "No AI suggestions generated.";

      return text
        .split(/\n(?=\d+\.|•|–|✅|💡|🏠|💰|👉|📊)/)
        .map((s) => s.trim())
        .filter(Boolean);
    } catch (err) {
      console.error("AI suggestion error:", err);
      return ["⚠️ Error fetching AI suggestions. Please check network connection."];
    } finally {
      setLoading(false);
    }
  }

  async function handleAsk(queryText) {
    const query = queryText || inputData;
    if (!query.trim()) return;
    setInputData(query);
    const results = await getAIResults(query);
    setSuggestions(results);
    setShowResults(true);
  }

  return (
    <div className={styles.glassPageWrapper}>
      <Link href="/" className={styles.backLink}>
        ← Back to Home
      </Link>

      <div className={styles.headerSection}>
        <div className={styles.badge}>🤖 AI Tax Consultant</div>
        <h1 className={styles.componentTitle}>Ask Taxy</h1>
        <p className={styles.subtitle}>
          Instant, intelligent answers on Indian Income Tax, GST, Deductions, and Budget 2025 Slabs.
        </p>
      </div>

      <div className={styles.askTaxyContainer}>
        {/* Prompt Input Card */}
        <div className={styles.glassCard}>
          {/* Quick Prompt Chips */}
          <div className={styles.promptChips}>
            {QUICK_PROMPTS.map((prompt, i) => (
              <button
                key={i}
                type="button"
                className={styles.chip}
                onClick={() => handleAsk(prompt)}
              >
                {prompt}
              </button>
            ))}
          </div>

          <textarea
            className={styles.chatTextarea}
            placeholder="Ask anything regarding taxes, deductions, exemptions, or regime comparisons..."
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleAsk();
              }
            }}
          />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "14px" }}>
            <span style={{ fontSize: "12px", color: "#8A9C98" }}>
              Press <strong>Enter ↵</strong> to ask
            </span>
            <button
              type="button"
              onClick={() => handleAsk()}
              disabled={loading || !inputData.trim()}
              className={styles.submitBtn}
            >
              {loading ? "Thinking & Analyzing..." : "Ask Taxy →"}
            </button>
          </div>
        </div>

        {/* AI Recommendations Output */}
        {showResults && (
          <div className={styles.glassCard} style={{ marginTop: "24px" }}>
            <div className={styles.cardTitle}>
              <span>💡 Taxy AI Recommendations</span>
              <span style={{ fontSize: "12px", color: "#5F7773" }}>Personalized Analysis</span>
            </div>

            <div className={styles.suggestionsList}>
              {suggestions.length > 0 ? (
                suggestions.map((result, index) => (
                  <div key={index} className={styles.suggestionItem}>
                    {result}
                  </div>
                ))
              ) : (
                <div style={{ textAlign: "center", color: "#5F7773", padding: "20px" }}>
                  No suggestions yet. Ask a question above to get started!
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

