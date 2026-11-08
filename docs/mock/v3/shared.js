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

  // 写真を全画面で開く（前後の写真へ移動できる）
  var dialog = document.querySelector("dialog.viewer");
  if (dialog) {
    var viewerImage = dialog.querySelector("img");
    var buttons = Array.prototype.slice.call(document.querySelectorAll("[data-view]"));
    var current = 0;
    function open(index) {
      current = (index + buttons.length) % buttons.length;
      var image = buttons[current].querySelector("img");
      viewerImage.src = image.src;
      viewerImage.alt = image.alt;
    }
    buttons.forEach(function (button, index) {
      button.addEventListener("click", function () {
        open(index);
        dialog.showModal();
      });
    });
    dialog.querySelector(".close").addEventListener("click", function () { dialog.close(); });
    dialog.querySelector(".prev").addEventListener("click", function () { open(current - 1); });
    dialog.querySelector(".next").addEventListener("click", function () { open(current + 1); });
    dialog.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") open(current - 1);
      if (event.key === "ArrowRight") open(current + 1);
    });
  }

  // 場所のタブを切り替える
  var tabs = document.querySelectorAll("[data-tab]");
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (other) {
        other.setAttribute("aria-selected", other === tab ? "true" : "false");
      });
      document.querySelectorAll("[data-panel]").forEach(function (panel) {
        panel.classList.toggle("is-on", panel.dataset.panel === tab.dataset.tab);
      });
    });
  });

  // 写真の横送り（タッチ操作ではそのままスワイプできる）
  document.querySelectorAll("[data-carousel]").forEach(function (carousel) {
    var track = carousel.querySelector(".track");
    function step(direction) {
      var slide = track.querySelector(".slide");
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var width = slide.getBoundingClientRect().width + gap;
      var atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      var atStart = track.scrollLeft <= 4;
      if (direction > 0 && atEnd) track.scrollTo({ left: 0, behavior: "smooth" });
      else if (direction < 0 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: "smooth" });
      else track.scrollBy({ left: direction * width, behavior: "smooth" });
    }
    carousel.querySelector(".prev").addEventListener("click", function () { step(-1); });
    carousel.querySelector(".next").addEventListener("click", function () { step(1); });
  });

  // URLの#からタブを開く（貸駐車場への直接リンク用）
  function openHashTab() {
    var target = location.hash ? document.querySelector('[data-hash="' + location.hash.slice(1) + '"]') : null;
    if (target) target.click();
  }
  openHashTab();
  window.addEventListener("hashchange", openHashTab);

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
  document.querySelectorAll(".menu a, .find a").forEach(function (link) {
    link.addEventListener("click", function () { link.closest("details").open = false; });
  });
  // メニューの外を押したら閉じる
  document.addEventListener("click", function (event) {
    document.querySelectorAll("details.find[open], details.menu[open]").forEach(function (details) {
      if (!details.contains(event.target)) details.open = false;
    });
  });
})();
