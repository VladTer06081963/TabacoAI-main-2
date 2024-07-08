import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

async function openAIRequest(messages) {
  console.log("Messages received for OpenAI request:", messages); // Логирование входных данных

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo-0125",
        messages: messages,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ошибка сервера: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return { success: true, data: data.choices[0].message.content };
    } else {
      throw new Error("Не удалось получить ожидаемый ответ от API.");
    }
  } catch (error) {
    console.error("Произошла ошибка:", error.message || error);
    return {
      success: false,
      error: error.message || "Произошла ошибка при обработке вашего запроса.",
    };
  }
}

export default openAIRequest;
