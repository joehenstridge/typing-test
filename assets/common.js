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
  return { store, esc, rnd, pick, shuffle, speak, canSpeak, stars, chips, press, fmtTime };
})();
