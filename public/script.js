/// ملف server.js (للنشر على Vercel)
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import chatHandler from "./api/chat.js";

const app = express();
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post("/api/chat", chatHandler);

app.get("/chat.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "chat.html"));
});

app.listen(3000, () => console.log("✅ Server running on port 3000"));
