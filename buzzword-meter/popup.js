// Takes the text selected on the current page, sends it to my Ask AI
// function on Vercel, and shows the model's answer in the popup.

const API_URL = "https://oim3690-delta.vercel.app/api/ask";

// What the popup asks the model to do with the selected text.
// Change this line to make it yours.
const INSTRUCTION =
  "Explain the following text to a first-year college student in two sentences:";

const button = document.getElementById("ask");
const selectedBox = document.getElementById("selected");
const answerBox = document.getElementById("answer");

function show(text, isError = false) {
  answerBox.textContent = text;
  answerBox.className = isError ? "error" : "";
}

async function getSelectedText() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const [result] = await chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: () => window.getSelection().toString()
  });
  return (result && result.result ? result.result : "").trim();
}

// The reply is JSON with an output list; the text is in the item of type "message".
function extractAnswer(data) {
  const message = (data.output || []).find((item) => item.type === "message");
  if (!message) return null;
  return message.content
    .filter((part) => part.type === "output_text")
    .map((part) => part.text)
    .join("\n");
}

button.addEventListener("click", async () => {
  let selection;
  try {
    selection = await getSelectedText();
  } catch (err) {
    show("This page doesn't let extensions read it (for example chrome:// pages). Try a regular website.", true);
    return;
  }

  if (!selection) {
    show("Nothing is selected. Highlight some text on the page first.", true);
    return;
  }

  selectedBox.style.display = "block";
  selectedBox.textContent = `"${selection.slice(0, 300)}${selection.length > 300 ? "…" : ""}"`;

  button.disabled = true;
  show("Thinking…");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: `${INSTRUCTION}\n\n${selection}` })
    });
    const data = await response.json();

    if (!response.ok) {
      show(`Error: ${data.error?.message || data.error || response.status}`, true);
      return;
    }

    const answer = extractAnswer(data);
    show(answer || "The model sent back an empty answer. Try again.", !answer);
  } catch (err) {
    show(`Couldn't reach the Ask AI function: ${err.message}`, true);
  } finally {
    button.disabled = false;
  }
});
