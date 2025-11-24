const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const log = document.getElementById("chat-log");

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = "message " + (role === "user" ? "user" : "bot");
  div.textContent = text;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  addMessage("user", text);
  input.value = "";

  const loadingMsg = document.createElement("div");
  loadingMsg.className = "message bot";
  loadingMsg.textContent = "답변 생성 중...";
  log.appendChild(loadingMsg);
  log.scrollTop = log.scrollHeight;

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text }),
    });

    if (res.status === 401) {
      loadingMsg.textContent = "로그인이 필요합니다. 페이지를 새로고침해 주세요.";
      return;
    }

    const data = await res.json();
    loadingMsg.textContent = data.reply || "응답이 비어 있습니다.";
  } catch (err) {
    loadingMsg.textContent = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
});
