export default async function handler(req, res) {
  try {
console.log("🧩 ENV keys:", Object.keys(process.env).filter(k => k.includes("OPENROUTER")));
console.log("🔑 Prefix:", process.env.OPENROUTER_API_KEY?.slice(0, 10) || "❌ Missing");

    const question = req.body.inputData || "No question provided.";
     
    const referer =
    process.env.VERCEL_ENV === "production"
    ? "https://taxy-one.vercel.app"
    : "http://localhost:3000";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer":  referer,
        "X-Title": "AskTaxy Assistant",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
  {
    role: "user",
    content: [
      {
        type: "text",
        text: `You are AskTaxy, a friendly and knowledgeable Indian tax assistant 🇮🇳.

Your goal is to provide accurate, lawful, and easy-to-understand tax advice for Indian users.

💡 Guidelines:
- Paragraph should not be more than 5 lines.
- Use headings and subheadings.
- Concise paragraphs for clarity.
- Bullet points or numbered lists to make complex tax topics simpler.
- Offer practical examples.
- Clearly mention if something requires a tax professional’s opinion or depends on recent legal updates.
- Avoid legal jargon — use simple, conversational English that an average taxpayer can follow.
- Always ensure information aligns with the latest Indian tax laws (Income Tax Act, GST, etc.).

🧮 Tone:
- Friendly, patient, and trustworthy — like a helpful CA explaining things clearly.
- End answers with a short summary or key takeaway.

User question: ${question}` }],
          },
        ],
      }),
    });

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error("AskTaxy API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
