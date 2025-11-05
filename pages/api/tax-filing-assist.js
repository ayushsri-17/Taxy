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
You are an expert Indian tax advisor. Analyze the user's provided tax details and
suggest practical ways to optimize their tax savings.

User Data:
${JSON.stringify(formData, null, 2)}

Consider:
- Age-based exemptions (senior citizens)
- Salary/business/other income combinations
- Deductions (80C, 80D, HRA, home loan, etc.)
- Choosing between Old and New Regime
- Common missed deductions
- Investment or saving strategies to reduce taxable income

Provide 5 personalized, actionable, and user-friendly suggestions with emojis and pointers.
Keep them concise and practical.
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
      }),
    });

    // ✅ Parse response safely
    const data = await response.json();
    res.status(response.status).json(data);

  } catch (error) {
    console.error("Tax Filing Assistant API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
}
