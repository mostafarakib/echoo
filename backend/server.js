import express from "express";
import chats from "./data/data.js";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.get("/api/chats", (req, res) => {
  res.send(chats);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
