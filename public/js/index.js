// function submitForm(event) {
//   event.preventDefault();
//   getData();
// }
// async function getData() {
//   let userData = document.getElementById("input").value.trim();
//   if (userData === "") return false;

//   document.getElementById("messages").innerHTML =
//     `<div class="mess-user">
//       <h3>Ваш запрос принят...</h3> 
//       <div class="loader"></div>
//       <p>${userData}</p>
//     </div>` + document.getElementById("messages").innerHTML;

//   document.getElementById("input").value = "";
//   const loader = document.querySelector(".mess-user .loader");
//   loader.style.display = "block";

//   try {
//     const response = await fetch("/api/message", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ content: userData }),
//     });
//     if (!response.ok) {
//       throw new Error("Произошла ошибка при получении данных с сервера");
//     }
//     const data = await response.json();

//     loader.style.display = "none";
//     document.getElementById("messages").innerHTML =
//       `<div class="mess-chat">
//         <p>${data}</p>
//       </div>` + document.getElementById("messages").innerHTML;
//   } catch (error) {
//     console.error("Error:", error);
//     loader.style.display = "none";
//     document.getElementById("messages").innerHTML =
//       `<div class="mess-chat error">
//         <p>Ошибка: Не удалось получить ответ. Пожалуйста, попробуйте позже.</p>
//       </div>` + document.getElementById("messages").innerHTML;
//   }
// }
// Возможно, вам также понадобится обработчик событий для формы, если он не объявлен в HTML:

// document.addEventListener("DOMContentLoaded", function () {
//   const form = document.querySelector("form");
//   form.addEventListener("submit", submitForm);
// });


//New code 

document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("form");
  form.addEventListener("submit", submitForm);
});

let messages = [];

// Сброс истории диалога при начале нового диалога
function startNewDialog() {
  messages = []; // Обнуление массива истории диалога
}

function submitForm(event) {
  event.preventDefault();
  getData();
}

async function getData() {
  const userInput = document.getElementById("input").value.trim();
  if (userInput === "") return;

  showUserMessage(userInput);
  clearInput();
  toggleLoader(true);

  // Если начат новый диалог, сбросить историю диалога
  if (userInput.toLowerCase() === "начать новый диалог") {
    startNewDialog();
  }

  // Добавление пользовательского сообщения в историю диалога
  messages.push({ role: "user", content: userInput });

  try {
    const response = await fetch("/api/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: userInput, messages: messages }),
    });

    const result = await response.json();

    if (response.ok) {
      const botMessage = result.data;
      // Добавление ответа бота в историю диалога
      messages.push({ role: "assistant", content: botMessage });
      toggleLoader(false);
      showServerMessage(botMessage);
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error("Ошибка:", error);
    toggleLoader(false);
    showErrorMessage(error.message);
  }
}

function showUserMessage(message) {
  const messagesContainer = document.getElementById("messages");
  const userMessageHtml = `
    <div class="mess-user">
      <h3>Ваш запрос принят...</h3>
      <div class="loader"></div>
      <p>${message}</p>
    </div>`;
  messagesContainer.innerHTML = userMessageHtml + messagesContainer.innerHTML;
}

function showServerMessage(message) {
  const messagesContainer = document.getElementById("messages");
  const serverMessageHtml = `
    <div class="mess-chat">
      <p>${message}</p>
    </div>`;
  messagesContainer.innerHTML = serverMessageHtml + messagesContainer.innerHTML;
}

function showErrorMessage(error) {
  const messagesContainer = document.getElementById("messages");
  const errorMessageHtml = `
    <div class="mess-chat error">
      <p>Ошибка: ${error}. Пожалуйста, попробуйте позже.</p>
    </div>`;
  messagesContainer.innerHTML = errorMessageHtml + messagesContainer.innerHTML;
}

function clearInput() {
  document.getElementById("input").value = "";
}

function toggleLoader(show) {
  const loader = document.querySelector(".mess-user .loader");
  if (loader) {
    loader.style.display = show ? "block" : "none";
  }
}
