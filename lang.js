/* Lingua IT / EN.
   L'italiano è scritto nell'HTML; l'inglese sta accanto, negli attributi data-en (testo)
   e data-en-<attributo> (es. data-en-aria-label, data-en-title, data-en-content).
   La scelta si ricorda (localStorage) e si può forzare con ?lang=en / ?lang=it.
   Caricato nel <head>: imposta subito <html lang>, così anche app.js sa la lingua. */
(function () {
  "use strict";
  var KEY = "surreo.lang", lang = "it";
  try { lang = localStorage.getItem(KEY) || "it"; } catch (e) {}
  var q = /[?&]lang=(it|en)\b/.exec(location.search);
  if (q) { lang = q[1]; try { localStorage.setItem(KEY, lang); } catch (e) {} }
  if (lang !== "en") lang = "it";
  document.documentElement.lang = lang;

  function apply() {
    if (lang === "en") {
      document.querySelectorAll("[data-en]").forEach(function (el) { el.innerHTML = el.getAttribute("data-en"); });
      ["aria-label", "title", "content", "alt"].forEach(function (a) {
        document.querySelectorAll("[data-en-" + a + "]").forEach(function (el) { el.setAttribute(a, el.getAttribute("data-en-" + a)); });
      });
      var t = document.querySelector("title[data-en]");
      if (t) document.title = t.getAttribute("data-en");
    }
    document.querySelectorAll(".lang-chip [data-lang]").forEach(function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("is-on", on);
      b.setAttribute("aria-pressed", on);
      b.addEventListener("click", function () {
        if (on) return;
        try { localStorage.setItem(KEY, b.getAttribute("data-lang")); } catch (e) {}
        // un ?lang= nell'indirizzo vincerebbe sulla scelta: lo si toglie, altrimenti basta ricaricare
        if (q) location.replace(location.pathname + location.search.replace(/([?&])lang=(it|en)&?/, "$1").replace(/[?&]$/, "") + location.hash);
        else location.reload();
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", apply);
  else apply();
})();
