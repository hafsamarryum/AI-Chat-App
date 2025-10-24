export async function callLLM(prompt: string, model: string): Promise<string> {

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
        console.error("OpenAI API error:", error)
        throw new Error("OpenAI API error")
      }

      const data = await response.json()
      return data.choices[0].message.content
    } catch (error) {
      console.error("OpenAI API error:", error)
      // Fall back to stub
    }
  }

  // Stub response
    return `I am AI assistant."You said: "${prompt}". Since no API key is configured, the system is returning this fallback message. Please set up your OpenAI API key to get real responses."`

}
