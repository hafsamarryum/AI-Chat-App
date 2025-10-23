export async function callLLM(prompt: string, model: string): Promise<string> {
  console.log("[v0] callLLM called with prompt:", prompt, "model:", model)

  // If OpenAI API key is available, use real API
  if (process.env.OPENAI_API_KEY) {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: model,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 500,
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        console.error("[v0] OpenAI API error:", error)
        throw new Error("OpenAI API error")
      }

      const data = await response.json()
      console.log("[v0] OpenAI response received")
      return data.choices[0].message.content
    } catch (error) {
      console.error("[v0] OpenAI API error:", error)
      // Fall back to stub
    }
  }

  // Stub response
  console.log("[v0] Using stub response")
  return `I'm a stub AI assistant. You said: "${prompt}". To enable real responses, add your OpenAI API key to .env.local`
}
