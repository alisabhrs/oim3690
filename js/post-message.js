async function postMessage(text) {
  const response = await fetch("https://oim.zhili.dev/message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Token": "alisabhrs"
    },
    body: JSON.stringify({ message: text })
  });
  return response.json();
}

const form = document.getElementById("message-form");
const input = document.getElementById("message");
const status = document.getElementById("status");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  status.textContent = "Sending...";
  try {
    const result = await postMessage(input.value);
    status.textContent = "Sent!";
    console.log(result);
    form.reset();
  } catch (error) {
    status.textContent = "Failed to send message.";
    console.error(error);
  }
});
