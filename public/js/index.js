document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");
  form.addEventListener("submit", handleSubmit);
});

// let dialogHistory = [];
let messages = [];

// const startNewDialog = () => dialogHistory = [];
const startNewDialog = () => messages = [];

const handleSubmit = (event) => {
  event.preventDefault();
  handleUserInput();
}

const handleUserInput = async () => {
  const userInput = document.getElementById("input").value.trim();
  if (!userInput) return;

  displayUserMessage(userInput);
  clearInput();
  toggleLoader(true);

  if (userInput.toLowerCase() === "начать новый диалог") {
    startNewDialog();
  }

  // dialogHistory.push({ role: "user", content: userInput });
  messages.push({ role: "user", content: userInput });

  try {
    const botMessage = await fetchBotResponse(userInput);
    // dialogHistory.push({ role: "assistant", content: botMessage });
    messages.push({ role: "assistant", content: botMessage });
    displayBotMessage(botMessage);
  } catch (error) {
    displayErrorMessage(error.message);
  } finally {
    toggleLoader(false);
  }
}

const fetchBotResponse = async (userInput) => {
  try {
    // const requestBody = JSON.stringify({ content: userInput, messages: dialogHistory });
    const requestBody = JSON.stringify({ content: userInput, messages: messages });
    console.log("Sending request with body:", requestBody); // Логирование тела запроса

    const response = await fetch("/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: requestBody,
    });

    if (!response.ok) {
      const errorMessage = `Server error: ${response.status} ${response.statusText}`;
      console.error(errorMessage);
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.data;
  } catch (error) {
    console.error("Fetch error:", error.message || error);
    throw error;
  }
};

const displayMessage = (message, isUser = true, isError = false) => {
  const messagesContainer = document.getElementById("messages");
  const messageClass = isUser ? 'mess-user' : 'mess-chat';
  const errorClass = isError ? ' error' : '';
  const loaderHtml = isUser ? '<h3>Ваш запрос принят...</h3><div class="loader"></div>' : '';
  const messageHtml = `
    <div class="${messageClass}${errorClass}">
      ${loaderHtml}
      <p>${message}</p>
    </div>`;
  messagesContainer.innerHTML = messageHtml + messagesContainer.innerHTML;
}

const displayUserMessage = (message) => displayMessage(message);
const displayBotMessage = (message) => displayMessage(message, false);
const displayErrorMessage = (error) => displayMessage(`Ошибка: ${error}. Пожалуйста, попробуйте позже.`, false, true);

const clearInput = () => document.getElementById("input").value = "";

const toggleLoader = (show) => {
  const loader = document.querySelector(".mess-user .loader");
  if (loader) {
    loader.style.display = show ? "block" : "none";
  }
}
