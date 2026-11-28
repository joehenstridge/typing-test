// Shared helpers for all activities. Nothing here talks to the network.
window.App = (function () {
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

  // Speech: uses the voices built into the device. A chosen voice is remembered.
  const canSpeak = "speechSynthesis" in window;
  const FEMALE = /sonia|libby|maisie|mia|hazel|susan|serena|kate|stephanie|martha|fiona|moira|tessa|karen|samantha|catherine|zira|aria|jenny|emma|female/i;
  function allVoices() {
    if (!canSpeak) return [];
    let v = [];
    try { v = speechSynthesis.getVoices().filter(x => /^en[-_]/i.test(x.lang) || x.lang === "en"); } catch (e) {}
    const rank = x => (/GB/i.test(x.lang) ? 0 : /IE|AU|NZ/i.test(x.lang) ? 1 : 2) * 10 + (FEMALE.test(x.name) ? 0 : 1) + (/natural|enhanced|premium|online/i.test(x.name) ? -0.5 : 0);
    return v.sort((p, q) => rank(p) - rank(q) || p.name.localeCompare(q.name));
  }
  function chosenVoice() {
    const v = allVoices(), want = store.get("rsl-voice", "");
    return v.find(x => x.voiceURI === want) || v[0] || null;
  }
  function voiceLabel(v) {
    const region = { GB: "UK", US: "US", AU: "Australia", IE: "Ireland", IN: "India", NZ: "New Zealand", ZA: "South Africa", CA: "Canada" }[(v.lang.split(/[-_]/)[1] || "").toUpperCase()] || v.lang;
    const natural = /natural|enhanced|premium/i.test(v.name);
    let n = v.name.replace(/^(Microsoft|Google|Apple)\s+/, "").replace(/\s*-\s*English.*$/, "").replace(/\s*\(.*?\)/g, "").replace(/\s+Online$/, "").trim();
    return n + (n.includes(region) ? "" : " (" + region + ")") + (natural ? ", natural" : "");
  }
  function onVoices(cb) {
    if (!canSpeak) return cb([]);
    cb(allVoices());
    try { speechSynthesis.addEventListener("voiceschanged", () => cb(allVoices())); } catch (e) {}
  }
  function speak(text, rate) {
    if (!canSpeak) return false;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text), v = chosenVoice();
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "en-GB";
      u.rate = rate || store.get("rsl-rate", 0.85);
      speechSynthesis.speak(u);
      return true;
    } catch (e) { return false; }
  }
  if (canSpeak) { try { speechSynthesis.getVoices(); } catch (e) {} }

  function stars(n) { return `<span aria-label="${n} out of 3 stars">${"★".repeat(n)}${"☆".repeat(3 - n)}</span>`; }
  function chips(sel, onPick) {
    document.querySelectorAll(sel).forEach(b => b.addEventListener("click", () => onPick(b)));
  }
  function press(sel, test) {
    document.querySelectorAll(sel).forEach(b => b.setAttribute("aria-pressed", String(!!test(b))));
  }
  function fmtTime(s) { s = Math.round(s); return s >= 60 ? Math.floor(s / 60) + "m " + (s % 60) + "s" : s + "s"; }
  // Light / dark mode switch, shown in every page header. Follows the device until changed.
  const SUN='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"/></svg>';
  const MOON='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>';
  const root = document.documentElement;
  const current = () => root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
  function themeButton() {
    const nav = document.querySelector(".site-nav"); if (!nav) return;
    const b = document.createElement("button"); b.type = "button"; b.className = "theme-btn";
    const paint = () => { const d = current() === "dark"; b.innerHTML = d ? SUN : MOON; b.setAttribute("aria-label", d ? "Switch to light mode" : "Switch to dark mode"); b.title = b.getAttribute("aria-label"); };
    b.addEventListener("click", () => { root.dataset.theme = current() === "dark" ? "light" : "dark"; store.set("rsl-theme", root.dataset.theme); paint(); window.dispatchEvent(new Event("resize")); });
    paint(); nav.appendChild(b);
  }
  themeButton();
  return { store, esc, rnd, pick, shuffle, speak, canSpeak, allVoices, chosenVoice, voiceLabel, onVoices, stars, chips, press, fmtTime };
})();
