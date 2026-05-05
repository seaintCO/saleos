export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { needs, selected, setup, monthly } = req.body || {};

    if (!needs) {
      return res.status(400).json({ error: "Missing client needs" });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: "Missing OPENAI_API_KEY in Vercel env variables" });
    }

    const prompt = `
You are ALMA, an elite sales strategist for SEAINT.

Your job is to help sales reps build better offers based on what the client needs, their budget, and the services selected.

Client needs:
${needs}

Selected services:
${selected || "No services selected yet."}

Current estimate:
Setup: $${setup || 0}
Monthly: $${monthly || 0}/mo

Create a close-ready recommendation.

Format the response like this:

PACKAGE NAME:
Give the offer a strong name.

RECOMMENDED SERVICES:
List the best services to include.

WHY THIS WORKS:
Explain why this matches the client's need.

OFFER POSITIONING:
Explain how the rep should position this.

PRICE STRATEGY:
Give a smart anchor and close price.

REP TALK TRACK:
Give the exact simple wording the rep can say.

CLOSE LINE:
Give one strong closing line.

Keep it practical, direct, and sales-ready.
`;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || "OpenAI failed"
      });
    }

    const analysis =
      data.output_text ||
      data.output?.[0]?.content?.[0]?.text ||
      data.output?.[1]?.content?.[0]?.text ||
      "";

    if (!analysis) {
      return res.status(500).json({
        error: "AI returned empty response. Try again."
      });
    }

    return res.status(200).json({ analysis });

  } catch (err) {
    return res.status(500).json({
      error: err.message || "Server error"
    });
  }
}
