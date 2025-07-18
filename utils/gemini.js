import "dotenv/config";

const geminiResponse = async (message) => {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [
        {
          parts: [{ text: message }],
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      options
    );

    const data = await response.json();
    console.log("Gemini API raw response:", data); // 🔍 Check terminal output

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return reply;
  } catch (err) {
    console.error("Error from Gemini:", err);
    return "Error: Could not generate response.";
  }
};

export default geminiResponse;
