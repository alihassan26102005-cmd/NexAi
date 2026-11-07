
export async function POST(request) {
  try {
    const { messages } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "Gemini API key not found!" },
        { status: 500 }
      );
    }

    if (!Array.isArray(messages) || messages.length === 0) {
      return Response.json(
        { error: "Please send a message." },
        { status: 400 }
      );
    }

    // Keep only the latest 10 messages
    const recentMessages = messages.slice(-10);

    // Convert messages into Gemini format
    const contents = recentMessages.map((message) => ({
      role: message.role === "assistant" ? "model" : "user",
      parts: [
        {
          text: String(message.text || ""),
        },
      ],
    }));

    // Gemini API request
    const chatbotRes = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [
              {
                text: "You are a helpful AI assistant. Give clear, friendly and useful answers. Keep answers concise unless the user asks for details.",
              },
            ],
          },
          contents,
          generationConfig: {
            maxOutputTokens: 512,
            thinkingConfig: {
              thinkingLevel: "low",
            },
          },
        }),
      }
    );

    const data = await chatbotRes.json();

    // Check API errors
    if (!chatbotRes.ok) {
      console.error("Gemini API Error:", data);

      return Response.json(
        {
          error:
            data.error?.message || "Gemini API request failed.",
        },
        { status: chatbotRes.status }
      );
    }

    // Extract AI response
    const reply = data.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || "")
      .join("")
      .trim();

    if (!reply) {
      return Response.json(
        { error: "Gemini returned an empty response. Please try again." },
        { status: 502 }
      );
    }

    return Response.json({ reply });

  } catch (error) {
    console.error("Server Error:", error);

    return Response.json(
      {
        error: error.message || "Internal server error.",
      },
      { status: 500 }
    );
  }
}
