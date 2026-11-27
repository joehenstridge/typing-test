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

  // Speech: British English voice where the device has one.
  const canSpeak = "speechSynthesis" in window;
  function speak(text, rate) {
    if (!canSpeak) return false;
    try {
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = "en-GB"; u.rate = rate || 0.8;
      const voices = speechSynthesis.getVoices();
      const v = voices.find(v => v.lang === "en-GB") || voices.find(v => /^en/.test(v.lang));
      if (v) u.voice = v;
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
  return { store, esc, rnd, pick, shuffle, speak, canSpeak, stars, chips, press, fmtTime };
})();
