// コミュニティ湘南 トップページ デザイン案 共通スクリプト
(function () {
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-in"); });
  }

  // 全画面ステージ: 画面中央にあるステップに合わせて写真を切り替える
  window.setupStage = function (options) {
    var steps = Array.prototype.slice.call(document.querySelectorAll(options.steps));
    var layers = Array.prototype.slice.call(document.querySelectorAll(options.layers));
    var links = Array.prototype.slice.call(document.querySelectorAll(options.links || ".__none"));
    function show(index) {
      layers.forEach(function (layer, i) {
        layer.classList.toggle("is-now", i === index);
        layer.classList.toggle("is-past", i < index);
      });
      links.forEach(function (link, i) {
        if (i === index) link.setAttribute("aria-current", "true");
        else link.removeAttribute("aria-current");
      });
      if (options.onChange) options.onChange(index);
    }
    show(0);
    if (!("IntersectionObserver" in window)) return;
    var stageObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) show(steps.indexOf(entry.target));
        });
      },
      { rootMargin: "-48% 0px -48% 0px" }
    );
    steps.forEach(function (step) { stageObserver.observe(step); });
  };

  // 写真を全画面で開く
  var dialog = document.querySelector("dialog.viewer");
  if (dialog) {
    var viewerImage = dialog.querySelector("img");
    document.querySelectorAll("[data-view]").forEach(function (button) {
      button.addEventListener("click", function () {
        var image = button.querySelector("img");
        viewerImage.src = image.src;
        viewerImage.alt = image.alt;
        dialog.showModal();
      });
    });
    dialog.addEventListener("click", function () { dialog.close(); });
  }

  // 確認用: まだ行き先のないリンクを押したときに案内する
  var note = document.createElement("div");
  note.className = "mocknote";
  note.setAttribute("role", "status");
  note.textContent = "デザイン確認用のため、このリンクは動きません";
  document.body.appendChild(note);
  var noteTimer;
  document.querySelectorAll('a[href="#"]').forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      note.classList.add("is-on");
      clearTimeout(noteTimer);
      noteTimer = setTimeout(function () { note.classList.remove("is-on"); }, 2200);
    });
  });
  document.querySelectorAll(".menu a").forEach(function (link) {
    link.addEventListener("click", function () { link.closest("details").open = false; });
  });
})();
