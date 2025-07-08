import express from "express";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();
const app = express();
app.use(express.json());
app.use(express.static("public"));

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
let conversationHistory = [];

const identityKeywords = [
  "منو انت", "من انت", "شنو اسمك", "من هو krx", "شنو krx",
  "انت شنو", "شنو انت", "انت مصنوع", "انت برنامج", "انت تطبيق",
  "شنو يعني krx", "كر اكس شنو", "من صممك", "من سواك", "من الي مبرمجك",
  "شنو هذا التطبيق", "من مطورك", "من اللي مسويك", "krx ai", "كرار العبدلي",
  "who are you", "what's your name", "who created you", "who made you"
];

const greetingKeywords = [
  "هلو", "هاي", "السلام عليكم", "شلونك", "مرحبا", "hello", "hi", "اهلاً", "سلام"
];

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  const normalizedMessage = message.toLowerCase().replace(/[؟.,،!]/g, "").trim();
  const isEnglish = /^[a-z0-9\s.,!?']+$/i.test(message);

  const isGreeting = greetingKeywords.some((kw) => normalizedMessage.includes(kw));
  if (isGreeting) {
    return res.json({
      reply: isEnglish
        ? "Hello! 👋 How can I help you today?"
        : "هلوووو نورتني ✨ شلون أقدر أساعدك اليوم؟"
    });
  }

  const isIdentity = identityKeywords.some((kw) => normalizedMessage.includes(kw)) &&
    !normalizedMessage.includes("ترجم") &&
    !normalizedMessage.includes("translate");

  if (isIdentity) {
    const reply = isEnglish
      ? "I'm KRX AI — a smart assistant created by Karrar Al-Abdali ✨"
      : "أنـا KRX AI — مساعد ذكي طورني كرار العبدلي ✨";

    conversationHistory.push({ role: "assistant", content: reply });
    return res.json({ reply });
  }

  conversationHistory.push({ role: "user", content: message });

  try {
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
You are KRX AI — an intelligent assistant developed by Karrar Al-Abdali.
You must always reply in the same language or dialect the user uses.
Understand context, connect related questions, and simulate natural conversation.
If asked about your creator, always mention Karrar Al-Abdali.
          `
        },
        ...conversationHistory
      ],
      stream: false
    });

    const reply = chatCompletion.choices[0].message.content;
    conversationHistory.push({ role: "assistant", content: reply });
    res.json({ reply });
  } catch (err) {
    console.error("OpenAI Error:", err.message);
    res.status(500).json({ reply: "⚠️ خطأ من السيرفر أثناء المعالجة." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ KRX AI (with context) جاهز على http://localhost:${PORT}`);
});