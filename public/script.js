const chatContainer = document.getElementById("chat");
const input = document.getElementById("user-input");

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function appendMessage(content, sender) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = content;
  chatContainer.appendChild(messageDiv);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  appendMessage(message, "user");
  input.value = "";

const res = await fetch("/api/chat", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message,
    lang: navigator.language || "ar"
  })
});

  const data = await res.json();
  appendMessage(data.reply, "bot");
}