import express from "express";
import dotenv from "dotenv";
import openAIRequest from "./utils/openaiRequest.js";

dotenv.config();
console.log(`API_KEY loaded: ${process.env.API_KEY ? 'yes' : 'no'}`); // Проверка загрузки API_KEY

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
  console.log("Received POST request to /api/message with body:", req.body); // Логирование тела запроса

  try {
    const { success, data, error } = await openAIRequest(messages);
    if (success) {
      res.json({ data });
    } else {
      console.error("OpenAI request failed with error:", error); // Логирование ошибки
      res.status(500).json({ error });
    }
  } catch (error) {
    console.error("Server error:", error.message || error); // Логирование ошибки
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3150;
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT} ...`);
});
