// ScrapCade OS: idioma (portugues ou ingles) e links da versao mais nova.
(function () {
  var html = document.documentElement;
  var salvo = null;
  try { salvo = localStorage.getItem("scrapcade-lingua"); } catch (e) {}
  var lingua = salvo || ((navigator.language || "pt").toLowerCase().indexOf("pt") === 0 ? "pt" : "en");

  function aplicar(l) {
    lingua = l;
    html.setAttribute("data-lingua", l);
    html.setAttribute("lang", l === "pt" ? "pt-BR" : "en");
    document.querySelectorAll("img[data-alt-en]").forEach(function (img) {
      if (!img.dataset.altPt) img.dataset.altPt = img.alt;
      img.alt = l === "pt" ? img.dataset.altPt : img.dataset.altEn;
    });
    try { localStorage.setItem("scrapcade-lingua", l); } catch (e) {}
  }
  aplicar(lingua);
  document.querySelector(".idioma").addEventListener("click", function () { aplicar(lingua === "pt" ? "en" : "pt"); });

  // a versao publicada mais nova: links diretos para o .iso de 64 e de 32 bits (sem internet, ficam os da pagina de versoes)
  fetch("https://api.github.com/repos/thiagotechmaker/scrapcade.os/releases/latest")
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (rel) {
      if (!rel) return;
      document.querySelectorAll("[data-versao]").forEach(function (b) { b.textContent = rel.tag_name; });
      (rel.assets || []).forEach(function (a) {
        var m = a.name.match(/-pc-(64|32)bits\.iso$/);
        if (!m) return;
        document.querySelectorAll('[data-iso="' + m[1] + '"]').forEach(function (link) { link.href = a.browser_download_url; });
      });
    })
    .catch(function () {});
})();
