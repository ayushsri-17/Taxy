import { useState } from "react";
import styles from "../styles/component-holder.module.css";

export default function AskTaxy() {
  const [inputData, setInputData] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  async function getAIResults(inputData) {
    try {
      setLoading(true);
      const res = await fetch("/api/ask-taxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputData }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("API error:", data);
        return [
          "⚠️ API error: " + (data.error?.message || "Unknown error occurred."),
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
      return ["⚠️ Error fetching AI suggestions."];
    } finally {
      setLoading(false);
    }
  }

  async function handleAsk() {
    if (!inputData.trim()) return;
    const results = await getAIResults(inputData);
    setSuggestions(results);
    setShowResults(true);
  }

  return (
    <>
      <h2 className={styles.componentTitle}>Ask Taxy</h2>

      <div className={styles.uploaderContainer}>
        <textarea
          style={{
            color: "black",
            height: "auto",
            overflow: "hidden",
            wordWrap: "break-word",
            width: "100%",
            minHeight: "100px",
            resize: "none",
          }}
          className={styles.input}
          placeholder="Ask Taxy here..."
          value={inputData}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = e.target.scrollHeight + "px";
            setInputData(e.target.value);
          }}
        />

        <button
          onClick={handleAsk}
          disabled={loading}
          className={styles.submitBtn}
        >
          {loading ? "Thinking..." : "Ask Taxy"}
        </button>

        {showResults && (
          <div className={styles.suggestionsContainer}>
            <h2 style={{ fontWeight: 900 }}>Taxy Advices</h2>
            <div className={styles.suggestionsList}>
              {suggestions.length > 0 ? (
                suggestions.map((result, index) => (
                  <div key={index} className={styles.suggestionItem}>
                    {result}
                  </div>
                ))
              ) : (
                <p>No suggestions yet. Try asking a question above!</p>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
