// Buzzword Meter: counts buzzwords on job postings at jobs.lever.co
// and shows the total in a banner at the top of the page.

const BUZZWORDS = [
  "synergy",
  "fast-paced",
  "self-starter",
  "rockstar",
  "ninja",
  "passionate",
  "dynamic",
  "innovative",
  "disruptive",
  "leverage",
  "best-in-class",
  "cross-functional",
  "stakeholders",
  "ownership",
  "scalable",
  "world-class",
  "game-changer",
  "move the needle",
  "wear many hats",
  "results-driven",
  "detail-oriented",
  "go-getter",
  "thought leader",
  "mission-driven",
  "high-impact",
  "ambiguity"
];

function escapeRegex(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function countBuzzwords(text) {
  const counts = {};
  let total = 0;
  for (const word of BUZZWORDS) {
    const pattern = new RegExp("\\b" + escapeRegex(word) + "\\b", "gi");
    const matches = text.match(pattern);
    if (matches) {
      counts[word] = matches.length;
      total += matches.length;
    }
  }
  return { total, counts };
}

function showBanner() {
  // The posting text lives in the main content area; fall back to the whole page.
  const posting = document.querySelector(".content") || document.body;
  const { total, counts } = countBuzzwords(posting.innerText);

  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word, n]) => `${word} (${n})`)
    .join(", ");

  const banner = document.createElement("div");
  banner.id = "buzzword-meter-banner";
  banner.textContent =
    total === 0
      ? "Buzzword Meter: no buzzwords found on this page."
      : `Buzzword Meter: ${total} buzzword${total === 1 ? "" : "s"} found. Top: ${top}`;

  Object.assign(banner.style, {
    position: "sticky",
    top: "0",
    zIndex: "99999",
    padding: "12px 16px",
    background: total >= 10 ? "#b42318" : total >= 4 ? "#b54708" : "#067647",
    color: "#ffffff",
    font: "600 15px/1.4 system-ui, sans-serif",
    textAlign: "center"
  });

  document.body.prepend(banner);
}

showBanner();
