import ai from "../config/gemini.js";

export const generateAIResponse = async (message) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
You are an AI assistant for a crowdfunding platform.

Your responsibilities:
- Help users create crowdfunding campaigns.
- Explain how donations work.
- Guide creators to write better campaign descriptions.
- Answer FAQs related to crowdfunding.
- Suggest fundraising best practices.
- Be friendly, concise, and professional.

User Question:
${message}
              `,
            },
          ],
        },
      ],
    });

    return response.text;
  } catch (error) {
      console.error("Gemini Error:");
  console.error(error);
  console.error(error.message);
  console.error(error.status);
  console.error(error.error);

  throw error;

  }
};