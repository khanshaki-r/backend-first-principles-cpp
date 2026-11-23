/* Backend From First Principles (C/C++) — shared page script.
   - theme toggle (persists in localStorage, falls back to OS preference)
   - copy buttons on every <pre><code>
   - highlight.js init (loaded via CDN on each page)
   - progress bar on the index page */
(function () {
  "use strict";

  // ---- Theme ---------------------------------------------------------------
  var root = document.documentElement;
  function readTheme() {
    try { return localStorage.getItem("theme"); } catch (e) { return null; }
  }
  function applyTheme(t) {
    if (t === "light" || t === "dark") root.setAttribute("data-theme", t);
    else root.removeAttribute("data-theme");
  }
  applyTheme(readTheme());

  document.addEventListener("DOMContentLoaded", function () {
    var btn = document.querySelector(".theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var current = root.getAttribute("data-theme");
        var osDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        var effective = current || (osDark ? "dark" : "light");
        var next = effective === "dark" ? "light" : "dark";
        applyTheme(next);
        try { localStorage.setItem("theme", next); } catch (e) {}
      });
    }

    // ---- Copy buttons ------------------------------------------------------
    document.querySelectorAll("pre > code").forEach(function (code) {
      var pre = code.parentElement;
      var b = document.createElement("button");
      b.className = "copy-btn";
      b.type = "button";
      b.textContent = "Copy";
      b.addEventListener("click", function () {
        var text = code.innerText;
        var done = function () { b.textContent = "Copied"; setTimeout(function () { b.textContent = "Copy"; }, 1500); };
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(text).then(done, done);
        } else {
          var ta = document.createElement("textarea");
          ta.value = text; document.body.appendChild(ta); ta.select();
          try { document.execCommand("copy"); } catch (e) {}
          document.body.removeChild(ta); done();
        }
      });
      pre.appendChild(b);
    });

    // ---- Syntax highlighting -----------------------------------------------
    if (window.hljs) {
      document.querySelectorAll("pre > code").forEach(function (el) {
        if (!el.classList.contains("nohighlight")) window.hljs.highlightElement(el);
      });
    }

    // ---- Progress (index page) ---------------------------------------------
    var rows = document.querySelectorAll("table.syllabus tbody tr");
    var bar = document.querySelector(".progress-bar > div");
    var label = document.querySelector(".progress-label");
    if (rows.length && bar) {
      var done = 0;
      rows.forEach(function (r) {
        var s = r.querySelector(".status");
        if (s && s.getAttribute("data-status") === "done") done++;
      });
      bar.style.width = Math.round((done / rows.length) * 100) + "%";
      if (label) label.textContent = done + " / " + rows.length + " days complete";
    }
  });
})();
