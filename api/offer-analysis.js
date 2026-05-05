export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { needs, selected, setup, monthly } = req.body || {};

    const prompt = `
You are ALMA, an elite sales strategist for SEAINT.

Client needs:
${needs}

Selected services:
${selected || "No services selected yet."}

Current estimate:
Setup: $${setup || 0}
Monthly: $${monthly || 0}/mo

Create a stronger close-ready package recommendation.

Output:
1. Best package name
2. Recommended services
3. Why this matches the client needs
4. Better offer positioning
5. How the sales rep should explain the value
6. Suggested price anchor
7. Suggested close line

Keep it practical, direct, and sales-ready.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method:"POST",
      headers:{
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        model:"gpt-4.1-mini",
        input: prompt
      })
    });

    const data = await response.json();

    if(!response.ok){
      return res.status(response.status).json({ error: data.error?.message || "OpenAI failed" });
    }

    return res.status(200).json({
      analysis: data.output_text || "No analysis returned."
    });

  } catch(err){
    return res.status(500).json({ error: err.message || "Server error" });
  }
}
