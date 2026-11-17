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

  // animacao de boot do iChroma: so toca quando a pessoa pede, e para no mesmo botao (WCAG 2.2.2)
  var anim = document.querySelector(".ver-anim"), img = document.querySelector(".ichroma-gif");
  if (anim && img) {
    var parado = img.getAttribute("src");
    anim.addEventListener("click", function () {
      var tocando = anim.getAttribute("aria-pressed") === "true";
      img.src = tocando ? parado : img.dataset.gif;
      anim.setAttribute("aria-pressed", tocando ? "false" : "true");
      anim.querySelector('[lang="pt"]').textContent = tocando ? "Ver a animação de boot" : "Parar a animação";
      anim.querySelector('[lang="en"]').textContent = tocando ? "Play the boot animation" : "Stop the animation";
    });
  }

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
        // o botao avisa o tamanho antes de baixar (uns 440 MB)
        document.querySelectorAll('[data-tam="' + m[1] + '"]').forEach(function (s) { s.textContent = "(" + Math.round(a.size / 1048576) + " MB)"; });
      });
    })
    .catch(function () {});
})();
