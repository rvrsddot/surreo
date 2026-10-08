/* Gallery: provino in home (#gal-sheet) + pagina gallery.html (#gal-grid, filtri, lightbox). */
(function () {
  var SETS = window.GALLERY || [];
  var BASE = "assets/gallery/";
  function pad(n) { return String(n).padStart(3, "0"); }

  var ALL = [];
  SETS.forEach(function (s) {
    for (var i = 1; i <= s.count; i++) ALL.push({ set: s.id, label: s.label, alt: s.alt || ("Workshok — " + s.label), name: s.prefix + "-" + pad(i), dir: BASE + s.folder + "/" });
  });
  function th(p) { return p.dir + "thumb/" + p.name + ".jpg"; }
  function fu(p) { return p.dir + "full/" + p.name + ".jpg"; }

  /* ---------- Home: provino a contatto (16 fotogrammi, set alternati) ---------- */
  var sheet = document.getElementById("gal-sheet");
  if (sheet) {
    var by = SETS.map(function (s) { return ALL.filter(function (p) { return p.set === s.id; }); });
    var mix = [], k = 0;
    while (mix.length < 16 && k < 200) {
      by.forEach(function (arr) { var p = arr[k * 3]; if (p && mix.length < 16) mix.push(p); });
      k++;
    }
    var picks = [2, 9, 13];
    sheet.innerHTML = mix.map(function (p, i) {
      return '<a class="sheet__f' + (picks.indexOf(i) > -1 ? " is-pick" : "") + '" href="gallery.html?f=' + p.name + '">' +
        '<span class="sheet__ph"><img loading="lazy" decoding="async" src="' + th(p) + '" alt="' + p.alt + ', foto ' + (i + 1) + '"></span>' +
        '<span class="sheet__cap"><span>' + pad(i + 1) + 'A</span><span>' + p.name.toUpperCase() + '</span></span></a>';
    }).join("");
    var cnt = document.getElementById("gal-count");
    if (cnt) cnt.textContent = ALL.length;
  }

  /* ---------- Pagina gallery ---------- */
  var grid = document.getElementById("gal-grid");
  if (!grid) return;
  var tabs = document.getElementById("gal-tabs");
  var st = document.getElementById("gal-status");
  var cur = ALL, idx = 0;

  tabs.innerHTML = '<button type="button" class="is-on" data-f="all">Tutte <i>' + ALL.length + '</i></button>' +
    SETS.map(function (s) { return '<button type="button" data-f="' + s.id + '">' + s.label + ' <i>' + s.count + '</i></button>'; }).join("");

  function draw(f) {
    cur = f === "all" ? ALL : ALL.filter(function (p) { return p.set === f; });
    grid.innerHTML = cur.map(function (p, i) {
      return '<figure class="gal__f" data-i="' + i + '" tabindex="0"><img loading="lazy" decoding="async" src="' + th(p) + '" alt="' + p.alt + ', foto ' + (i + 1) + '">' +
        '<figcaption><span>' + pad(i + 1) + '</span><span>' + p.label + '</span></figcaption></figure>';
    }).join("");
    if (st) st.textContent = "[ " + cur.length + " FILES ]";
  }
  draw("all");
  tabs.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    Array.prototype.forEach.call(tabs.children, function (x) { x.classList.toggle("is-on", x === b); });
    draw(b.dataset.f);
  });

  var lb = document.getElementById("gal-lb"), img = document.getElementById("gal-lb-img");
  function show(i) {
    idx = (i + cur.length) % cur.length;
    var p = cur[idx];
    img.src = fu(p);
    img.alt = p.alt + ", foto " + (idx + 1);
    document.getElementById("gal-lb-name").textContent = p.name.toUpperCase() + ".JPG · " + p.label;
    document.getElementById("gal-lb-count").textContent = pad(idx + 1) + " / " + pad(cur.length);
    [1, -1].forEach(function (d) { var n = cur[(idx + d + cur.length) % cur.length]; new Image().src = fu(n); });
    lb.hidden = false; document.body.classList.add("is-lb");
  }
  function close() { lb.hidden = true; document.body.classList.remove("is-lb"); }
  grid.addEventListener("click", function (e) { var f = e.target.closest(".gal__f"); if (f) show(+f.dataset.i); });
  grid.addEventListener("keydown", function (e) { var f = e.target.closest(".gal__f"); if (f && e.key === "Enter") show(+f.dataset.i); });
  document.getElementById("gal-lb-close").addEventListener("click", close);
  document.getElementById("gal-lb-prev").addEventListener("click", function () { show(idx - 1); });
  document.getElementById("gal-lb-next").addEventListener("click", function () { show(idx + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) close(); });
  document.addEventListener("keydown", function (e) {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });

  /* arrivo dal provino in home: gallery.html?f=wk-004 apre subito quella foto */
  var f = new URLSearchParams(location.search).get("f");
  if (f) { var j = ALL.findIndex(function (p) { return p.name === f; }); if (j > -1) show(j); }
})();
