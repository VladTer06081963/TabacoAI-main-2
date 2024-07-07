// Предполагается, что этот код находится в файле, где вы настраиваете ваше Express-приложение

// import express from "express";
// import dotenv from "dotenv";
// import openAIRequest from "./utils/openaiRequest.js"; 

// Обратите внимание на .js в конце openaiRequest";
// Убедитесь, что путь к файлу верный

// dotenv.config();

// const app = express();
// app.set("view engine", "ejs");
// app.use(express.static("public"));

// app.get("/", (req, res) => {
//   res.render("index");
// });
// app.get("/about", (req, res) => {
//   res.render("about");
// });


// Обработка запроса к index.html

// app.get("/index.html", (req, res) => {
//   res.redirect("/");
// });
// app.get("/index", (req, res) => {
//   res.redirect("/");
// });

// Обработка запроса к about.html
// app.get("/about.html", (req, res) => {
//   res.redirect("/about");
// });
// app.get("/user/:username", (req, res) => {
//   let data = {
//     username: req.params.username,
//     hobbies: [
//       "Хотите такой сайт?",
//       "Регистрируйтесь у нас",
//       "и генерируйте",
//       "свои сайты!!!",
//     ],
//   };
//   res.render("user", data);
// });

// app.post("/api/message", express.json(), async (req, res) => {
//   const { success, data, error } = await openAIRequest(req.body.content);
//   if (success) {
//     res.json(data);
//   } else {
//     res.status(500).json({ error });
//   }
// });

// const PORT = process.env.PORT || 3150;
// app.listen(PORT, () => {
//   console.log(`Server started on http://localhost:${PORT} ...`);
// });

import express from "express";
import dotenv from "dotenv";
import openAIRequest from "./utils/openaiRequest.js";

dotenv.config();

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/index.html", (req, res) => {
  res.redirect("/");
});

app.get("/index", (req, res) => {
  res.redirect("/");
});

app.get("/about.html", (req, res) => {
  res.redirect("/about");
});

app.get("/user/:username", (req, res) => {
  const data = {
    username: req.params.username,
    hobbies: [
      "Хотите такой сайт?",
      "Регистрируйтесь у нас",
      "и генерируйте",
      "свои сайты!!!",
    ],
  };
  res.render("user", data);
});

app.post("/api/message", async (req, res) => {
  const { content, messages } = req.body;
  const { success, data, error } = await openAIRequest(messages);
  if (success) {
    res.json({ data });
  } else {
    res.status(500).json({ error });
  }
});

const PORT = process.env.PORT || 3150;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT} ...`);
});
