import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const handler = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).end("Method Not Allowed");
  }

  const { message, lang } = req.body;

  try {
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `رد على المستخدم بنفس لغته (${lang}) وبطريقة ذكية، واذكر أنك مطور من قبل كرار العبدلي.`
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "gpt-4o",
    });

    const reply = chatCompletion.choices[0].message.content;
    res.status(200).json({ reply });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

export default handler;
