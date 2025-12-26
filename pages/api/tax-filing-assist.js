export default async function handler(req, res) {
  try{

    console.log("🧩 ENV keys:", Object.keys(process.env).filter(k => k.includes("OPENROUTER")));
    console.log("🔑 Prefix:", process.env.OPENROUTER_API_KEY?.slice(0, 10) || "❌ Missing");

  
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

  
    const formData = req.body.formData;
    if (!formData || Object.keys(formData).length === 0) {
      return res.status(400).json({ error: "Form data missing" });
    }

    const prompt = `
You are an expert Indian tax advisor. Analyze the user's tax details and suggest
ways to optimize tax savings.

User profile (key details):
- Age: ${formData.age}
- Income sources: ${formData.incomeSources?.join(", ")}
- Annual income: ₹${formData.totalIncome}
- Deductions claimed: ${formData.deductions?.join(", ") || "None"}
- Housing: ${formData.housingStatus}

Consider:
- Age-based exemptions
- Deductions (80C, 80D, HRA, home loan, etc.)
- Old vs New Regime
- Common missed deductions

Provide 5 concise, actionable suggestions with emojis.
Limit to 5 bullet points, max 2 lines each.
`;

 
  const referer =
  process.env.VERCEL_ENV === "production"
    ? "https://taxy-one.vercel.app"
    : "http://localhost:3000";

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
         "HTTP-Referer": referer,
        "X-Title": "Tax Filing Assistant",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
  model: "google/gemini-2.5-flash",
  messages: [
    {
      role: "user",
      content: [{ type: "text", text: prompt }],
    },
  ],
  max_tokens: 1200,
  temperature: 0.7
}),
    })

    // ✅ Parse response safely
    const data = await response.json();
    res.status(response.status).json(data);

  } catch (error) {
    console.error("Tax Filing Assistant API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
