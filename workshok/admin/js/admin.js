/* =========================================================================
   WORKSHOK — SOCIAL.EXE · APP
   Stato + wiring + export PNG.
   ========================================================================= */
(() => {
  "use strict";

  const $  = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  /* --------- STATE ---------- */
  const state = {
    tplId: "course",
    layoutId: null,   // scelto tra tpl.layouts[]; se null usa il primo
    fmt: "4x5",
    pal: "dark",
    data: {},
    photoHref: null, // data URI
  };

  function currentTpl()    { return window.TEMPLATES[state.tplId]; }
  function currentLayout() {
    const tpl = currentTpl();
    if (!tpl || !tpl.layouts || !tpl.layouts.length) return null;
    return tpl.layouts.find(l => l.id === state.layoutId) || tpl.layouts[0];
  }

  const setStatus = (msg) => { const el = $("#sb-msg"); if (el) el.textContent = String(msg || "").toUpperCase(); };

  /* --------- INIT ---------- */
  function init() {
    // clock
    const tick = () => {
      const now = new Date();
      const pad = (n) => String(n).padStart(2, "0");
      const s = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
      const c1 = $("#clock"); if (c1) c1.textContent = s;
      const c2 = $("#sb-clock"); if (c2) c2.textContent = s;
    };
    tick(); setInterval(tick, 1000);

    // difaults del template iniziale
    resetDataFor(state.tplId);

    // picker template
    $$("#tpl-picker button").forEach(btn => {
      btn.addEventListener("click", () => {
        $$("#tpl-picker button").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        state.tplId = btn.dataset.tpl;
        state.layoutId = null; // reset al primo layout del nuovo template
        resetDataFor(state.tplId);
        renderLayoutPicker();
        renderFields();
        renderPreview();
        setStatus(`Template · ${state.tplId}`);
      });
    });

    // picker formato
    $$("#fmt-picker button").forEach(btn => {
      btn.addEventListener("click", () => {
        $$("#fmt-picker button").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        state.fmt = btn.dataset.fmt;
        applyFrameAspect();
        renderPreview();
        const f = window.FORMATS[state.fmt];
        $("#preview-status").textContent = `[ ${f.w} × ${f.h} · ${state.fmt.replace("x", ":")} ]`;
        setStatus(`Formato · ${state.fmt}`);
      });
    });

    // picker palette
    $$("#pal-picker button").forEach(btn => {
      btn.addEventListener("click", () => {
        $$("#pal-picker button").forEach(b => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        state.pal = btn.dataset.pal;
        renderPreview();
        setStatus(`Palette · ${state.pal}`);
      });
    });

    // photo picker
    $("#photo-input").addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      const rd = new FileReader();
      rd.onload = () => {
        state.photoHref = rd.result;
        $("#photo-clear").hidden = false;
        renderPreview();
        setStatus(`Foto · ${f.name}`);
      };
      rd.readAsDataURL(f);
    });
    $("#photo-clear").addEventListener("click", () => {
      state.photoHref = null;
      $("#photo-input").value = "";
      $("#photo-clear").hidden = true;
      renderPreview();
      setStatus("Foto rimossa");
    });

    // export PNG
    $("#export-png").addEventListener("click", exportPNG);
    // export MP4 (loop 4s con animazione)
    const mp4Btn = $("#export-mp4");
    if (mp4Btn) mp4Btn.addEventListener("click", exportMP4);

    // preset save / load
    const saveBtn = $("#preset-save");
    if (saveBtn) saveBtn.addEventListener("click", savePreset);
    const loadInput = $("#preset-load");
    if (loadInput) loadInput.addEventListener("change", loadPreset);

    // primo mount
    applyFrameAspect();
    renderLayoutPicker();
    renderFields();
    renderPreview();
    setStatus("Ready.");
  }

  /* --------- LAYOUT PICKER (dinamico) ---------- */
  function renderLayoutPicker() {
    const host = $("#layout-picker");
    if (!host) return;
    const tpl = currentTpl();
    const layouts = (tpl && tpl.layouts) || [];
    host.innerHTML = "";
    if (layouts.length <= 1) {
      // se c'è un solo layout, nascondi il picker
      const sect = host.closest(".sect");
      if (sect) sect.style.display = "none";
      state.layoutId = layouts[0] ? layouts[0].id : null;
      return;
    }
    const sect = host.closest(".sect");
    if (sect) sect.style.display = "";
    const active = state.layoutId || layouts[0].id;
    state.layoutId = active;
    layouts.forEach(l => {
      const b = document.createElement("button");
      b.textContent = l.label;
      b.dataset.layout = l.id;
      if (l.id === active) b.classList.add("is-active");
      b.addEventListener("click", () => {
        state.layoutId = l.id;
        Array.from(host.children).forEach(x => x.classList.remove("is-active"));
        b.classList.add("is-active");
        renderPreview();
        setStatus(`Layout · ${l.label}`);
      });
      host.appendChild(b);
    });
  }

  /* --------- PRESET SAVE / LOAD ---------- */
  function savePreset() {
    const preset = {
      _kind: "workshok-social-preset",
      _version: 1,
      tplId: state.tplId,
      fmt: state.fmt,
      pal: state.pal,
      data: state.data,
      // per default NON includiamo la foto (troppo pesante); scommenta per esportarla
      // photoHref: state.photoHref,
    };
    const blob = new Blob([JSON.stringify(preset, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `workshok_preset_${state.tplId}_${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a); a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 100);
    setStatus("Preset salvato");
  }

  function loadPreset(e) {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const rd = new FileReader();
    rd.onload = () => {
      try {
        const p = JSON.parse(rd.result);
        if (p._kind !== "workshok-social-preset") throw new Error("Non è un preset Workshok");
        if (!window.TEMPLATES[p.tplId]) throw new Error("Template sconosciuto: " + p.tplId);
        state.tplId = p.tplId;
        state.fmt   = p.fmt || "4x5";
        state.pal   = p.pal || "dark";
        state.data  = p.data || {};
        if (p.photoHref) state.photoHref = p.photoHref;
        // sync UI
        syncPickers();
        applyFrameAspect();
        renderFields();
        renderPreview();
        setStatus(`Preset caricato · ${p.tplId}`);
      } catch (err) {
        console.error(err);
        alert("Preset non valido: " + err.message);
        setStatus("ERROR preset");
      } finally {
        e.target.value = "";
      }
    };
    rd.readAsText(f);
  }

  function syncPickers() {
    const map = { "tpl-picker": ["data-tpl", state.tplId],
                  "fmt-picker": ["data-fmt", state.fmt],
                  "pal-picker": ["data-pal", state.pal] };
    Object.entries(map).forEach(([id, [attr, val]]) => {
      const host = document.getElementById(id);
      if (!host) return;
      Array.from(host.querySelectorAll("button")).forEach(b => {
        b.classList.toggle("is-active", b.getAttribute(attr) === val);
      });
    });
  }

  /* --------- EXPORT MP4 / WEBM (4s loop animato) ---------- */
  async function exportMP4() {
    const btn = $("#export-mp4");
    try {
      btn.disabled = true;
      setStatus("Registrazione video · 4s…");

      const layout = currentLayout();
      const pal = window.PALETTES[state.pal];
      const f = window.FORMATS[state.fmt];

      // canvas offscreen
      const canvas = document.createElement("canvas");
      canvas.width = f.w; canvas.height = f.h;
      const ctx = canvas.getContext("2d");

      // MediaRecorder
      if (!canvas.captureStream) throw new Error("Il browser non supporta captureStream (usa Chrome/Edge/Firefox)");
      const fps = 30;
      // captureStream(0) = frame on demand; noi useremo requestFrame() dopo ogni draw
      const stream = canvas.captureStream(0);
      const [videoTrack] = stream.getVideoTracks();
      let mime = "video/webm;codecs=vp9";
      if (!MediaRecorder.isTypeSupported(mime)) mime = "video/webm;codecs=vp8";
      if (!MediaRecorder.isTypeSupported(mime)) mime = "video/webm";
      const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 6_000_000 });
      const chunks = [];
      rec.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
      const stopped = new Promise((res) => rec.onstop = res);

      // font ready
      if (document.fonts && document.fonts.ready) { try { await document.fonts.ready; } catch(e){} }

      // pre-render base SVG (con font @import) → immagine bitmap, per velocità
      const baseSvg = injectFontImport(layout.render(state.fmt, state.data, pal, state.photoHref));
      const baseImg = await svgToImage(baseSvg);

      rec.start();

      const duration = 4000; // 4s
      const frameMs = 1000 / fps;
      const totalFrames = Math.round(duration / frameMs);

      // Yield via MessageChannel per bypassare il throttling di setTimeout
      // sui tab in background (Chrome clampa setTimeout a 1s se non-focused).
      // MessageChannel + setTimeout con soglia: soglia bassa in foreground,
      // yield puro in background per non bloccare 2 minuti.
      const yieldFast = () => new Promise(resolve => {
        const ch = new MessageChannel();
        ch.port1.onmessage = () => resolve();
        ch.port2.postMessage(null);
      });
      const isHidden = document.hidden;

      const t0 = performance.now();
      for (let i = 0; i < totalFrames; i++) {
        const T = (i / totalFrames) % 1;
        ctx.fillStyle = pal.bg;
        ctx.fillRect(0, 0, f.w, f.h);
        ctx.drawImage(baseImg, 0, 0, f.w, f.h);
        drawOverlay(ctx, f.w, f.h, pal, T);
        if (videoTrack && videoTrack.requestFrame) videoTrack.requestFrame();
        // aspetta il tempo di frame reale (foreground) o yielda subito (hidden)
        if (isHidden) {
          await yieldFast();
        } else {
          const targetT = t0 + (i + 1) * frameMs;
          const wait = Math.max(0, targetT - performance.now());
          if (wait > 0) await new Promise(r => setTimeout(r, wait));
        }
      }

      rec.stop();
      await stopped;
      const blob = new Blob(chunks, { type: mime });
      const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      const ext = mime.includes("webm") ? "webm" : "mp4";
      const filename = `workshok_${state.tplId}_${state.fmt}_${stamp}.${ext}`;
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      document.body.appendChild(a); a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 100);
      setStatus(`Video OK · ${filename} (${ext.toUpperCase()})`);
    } catch (err) {
      console.error(err);
      setStatus(`ERROR video: ${err.message}`);
      alert("Export video fallito: " + err.message);
    } finally {
      btn.disabled = false;
    }
  }

  function svgToImage(svgMarkup) {
    return new Promise((res, rej) => {
      const blob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const img = new Image();
      img.onload = () => { URL.revokeObjectURL(url); res(img); };
      img.onerror = (e) => { URL.revokeObjectURL(url); rej(new Error("SVG load failed")); };
      img.src = url;
    });
  }

  function drawOverlay(ctx, w, h, pal, T) {
    // scan line diagonale (barra rossa che attraversa)
    const scanY = Math.floor(T * (h + 400)) - 200;
    ctx.save();
    ctx.globalAlpha = 0.85;
    ctx.fillStyle = pal.hot;
    ctx.fillRect(0, scanY, w, 3);
    ctx.globalAlpha = 0.12;
    ctx.fillRect(0, scanY - 30, w, 60);
    ctx.restore();

    // dot pulsante REC in alto a destra
    const pulse = 0.5 + 0.5 * Math.sin(T * Math.PI * 6);
    ctx.save();
    ctx.globalAlpha = 0.4 + 0.6 * pulse;
    ctx.fillStyle = pal.hot;
    ctx.beginPath();
    ctx.arc(w - 60, 60, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.font = "700 22px 'Space Mono', monospace";
    ctx.fillStyle = pal.hot;
    ctx.textAlign = "right";
    ctx.fillText("REC", w - 90, 68);
    ctx.restore();

    // coord ticker in basso
    ctx.save();
    ctx.font = "16px 'Space Mono', monospace";
    ctx.fillStyle = pal.hot;
    ctx.textAlign = "left";
    const x = Math.floor(T * 1080).toString().padStart(4, "0");
    const y = Math.floor((1 - T) * 1080).toString().padStart(4, "0");
    ctx.fillText(`CUR X:${x} Y:${y}`, 60, h - 12);
    ctx.restore();
  }

  /* --------- DATA / FIELDS ---------- */
  function resetDataFor(tplId) {
    const tpl = window.TEMPLATES[tplId];
    state.data = { ...(tpl.defaults ? tpl.defaults() : {}) };
  }

  function renderFields() {
    const host = $("#fields-host");
    host.innerHTML = "";
    const tpl = window.TEMPLATES[state.tplId];
    const lbl = document.createElement("label");
    lbl.className = "lbl";
    lbl.textContent = `// CAMPI · ${tpl.label.toUpperCase()}`;
    host.appendChild(lbl);

    tpl.fields.forEach(f => {
      if (f.type === "prefill") {
        const opts = (typeof f.options === "function") ? f.options() : (f.options || []);
        if (!opts.length) return;
        const wrap = document.createElement("div");
        wrap.className = "field";
        wrap.innerHTML = `
          <span>${f.label}</span>
          <select>
            <option value="">— scegli —</option>
            ${opts.map(o => `<option value="${o.value}">${o.label}</option>`).join("")}
          </select>
        `;
        wrap.querySelector("select").addEventListener("change", (e) => {
          const idx = Number(e.target.value);
          if (Number.isFinite(idx) && tpl.applyPrefill) {
            state.data = tpl.applyPrefill(state.data, idx);
            renderFields();
            renderPreview();
            setStatus(`Prefill · courses[${idx}]`);
          }
        });
        host.appendChild(wrap);
        return;
      }

      const wrap = document.createElement("label");
      wrap.className = "field";
      const val = state.data[f.key] ?? "";
      const inputHTML = f.type === "textarea"
        ? `<textarea rows="3" ${f.maxLength?`maxlength="${f.maxLength}"`:""}>${escapeHTML(val)}</textarea>`
        : `<input type="text" value="${escapeAttr(val)}" ${f.maxLength?`maxlength="${f.maxLength}"`:""} />`;
      wrap.innerHTML = `<span>${f.label}</span>${inputHTML}`;
      const ctrl = wrap.querySelector("input, textarea");
      ctrl.addEventListener("input", () => {
        state.data[f.key] = ctrl.value;
        renderPreview();
      });
      host.appendChild(wrap);
    });
  }

  /* --------- RENDER ---------- */
  function applyFrameAspect() {
    const f = window.FORMATS[state.fmt];
    const frame = $("#canvas-frame");
    frame.style.setProperty("--w", f.w);
    frame.style.setProperty("--h", f.h);
  }

  function renderPreview() {
    const layout = currentLayout();
    const pal = window.PALETTES[state.pal];
    if (!layout) { $("#canvas-frame").innerHTML = ""; return; }
    const svg = layout.render(state.fmt, state.data, pal, state.photoHref);
    $("#canvas-frame").innerHTML = svg;
  }

  /* --------- EXPORT PNG ---------- */
  async function exportPNG() {
    try {
      setStatus("Export PNG…");
      const btn = $("#export-png");
      btn.disabled = true;

      const layout = currentLayout();
      const pal = window.PALETTES[state.pal];
      const f = window.FORMATS[state.fmt];

      // rigenera SVG e ci inietta lo style dei font Google (garanzia rendering)
      let svgMarkup = layout.render(state.fmt, state.data, pal, state.photoHref);
      svgMarkup = injectFontImport(svgMarkup);

      // assicura font caricati nel DOM (fallback)
      if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch(e){}
      }

      const svgBlob = new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      const img = new Image();
      img.decoding = "sync";
      img.crossOrigin = "anonymous";
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = (e) => rej(new Error("SVG image load failed"));
        img.src = url;
      });

      const canvas = document.createElement("canvas");
      canvas.width = f.w; canvas.height = f.h;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = pal.bg;
      ctx.fillRect(0, 0, f.w, f.h);
      ctx.drawImage(img, 0, 0, f.w, f.h);
      URL.revokeObjectURL(url);

      const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
      const filename = `workshok_${state.tplId}_${state.fmt}_${stamp}.png`;
      await new Promise((res) => canvas.toBlob((blob) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); res(); }, 100);
      }, "image/png"));

      setStatus(`Export OK · ${filename}`);
    } catch (err) {
      console.error(err);
      setStatus(`ERROR: ${err.message}`);
      alert(`Export fallito: ${err.message}`);
    } finally {
      $("#export-png").disabled = false;
    }
  }

  function injectFontImport(svgMarkup) {
    const style = `<style>
      @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&amp;family=Space+Mono:ital,wght@0,400;0,700;1,400&amp;family=Barlow+Condensed:wght@400;500;700;800;900&amp;display=swap');
      text { font-family: 'Barlow Condensed', 'Space Grotesk', system-ui, sans-serif; }
    </style>`;
    return svgMarkup.replace(/<svg([^>]*)>/, `<svg$1>${style}`);
  }

  /* --------- UTIL ---------- */
  const escapeHTML = (s) => String(s ?? "").replace(/[&<>]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;"}[c]));
  const escapeAttr = (s) => String(s ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

  document.addEventListener("DOMContentLoaded", init);
})();
