(function () {
  const panels = Array.from(document.querySelectorAll("[data-panel]"));
  const modeButtons = Array.from(document.querySelectorAll("[data-mode]"));
  const navButtons = Array.from(document.querySelectorAll(".nav-item"));
  const response = document.getElementById("assistant-response");
  const assistantInput = document.getElementById("assistant-input");
  const assistantForm = document.getElementById("assistant-form");

  const directModes = new Set(["home", "images", "property", "news", "hero"]);
  const placeholderModes = {
    works: {
      eyebrow: "Works",
      title: "施工事例を管理する",
      description: "施工事例の追加・並び替え・公開状態の変更画面がここに表示されます。",
    },
    voices: {
      eyebrow: "Voices",
      title: "お客様の声を管理する",
      description: "インタビュー記事の作成と、掲載写真の管理画面がここに表示されます。",
    },
    settings: {
      eyebrow: "Settings",
      title: "基本設定",
      description: "会社情報、電話番号、営業時間など、サイト共通情報の設定画面です。",
    },
  };

  function preparePropertyEditor(requestedMode) {
    const isRent = requestedMode === "rent";
    const title = document.getElementById("property-editor-title");
    const description = document.getElementById("property-editor-description");
    const typeLabel = document.getElementById("property-type-label");
    const typeSelect = document.getElementById("property-type-select");
    if (title) title.textContent = isRent ? "賃貸・貸駐車場を登録する" : "売買物件を登録する";
    if (description) {
      description.textContent = isRent
        ? "賃貸物件と月極駐車場を同じ流れで登録できます。物件種別を選ぶと必要な項目だけ表示します。"
        : "わかる項目から入力してください。不足している情報は公開前にお知らせします。";
    }
    if (typeLabel) typeLabel.textContent = isRent ? "物件種別" : "取引形態";
    if (typeSelect) {
      typeSelect.innerHTML = isRent
        ? "<option>賃貸物件</option><option>月極駐車場</option>"
        : "<option>売主物件</option><option>仲介物件</option>";
    }
  }

  function preparePlaceholder(requestedMode) {
    const placeholder = document.querySelector('[data-panel="placeholder"]');
    const content = placeholderModes[requestedMode];
    if (!placeholder || !content) return;
    placeholder.innerHTML = `
      <div class="generated-heading">
        <div>
          <span class="generated-label">${content.eyebrow}</span>
          <h2>${content.title}</h2>
          <p>${content.description}</p>
        </div>
        <button class="secondary-button" type="button" data-placeholder-home>ホームへ戻る</button>
      </div>
      <div class="surface placeholder-surface">
        <span aria-hidden="true">✦</span>
        <h3>このモックでは、主要な登録・画像調整フローを先に体験できます。</h3>
        <p>画面上部の「今日は何をしますか？」にやりたいことを入力すると、対応する作業画面を表示します。</p>
      </div>`;
    placeholder.querySelector("[data-placeholder-home]")?.addEventListener("click", () => showMode("home", false));
  }

  function showMode(requestedMode, fromAssistant) {
    const isPlaceholder = Object.hasOwn(placeholderModes, requestedMode);
    const mode = requestedMode === "rent"
      ? "property"
      : directModes.has(requestedMode)
        ? requestedMode
        : isPlaceholder
          ? "placeholder"
          : "home";
    if (mode === "property") preparePropertyEditor(requestedMode);
    if (isPlaceholder) preparePlaceholder(requestedMode);
    panels.forEach((panel) => {
      panel.hidden = panel.dataset.panel !== mode;
    });

    navButtons.forEach((button) => {
      const navMode = button.dataset.mode;
      button.classList.toggle(
        "is-current",
        navMode === requestedMode,
      );
    });

    if (fromAssistant && response) {
      const messages = {
        images: "写真の調整画面を用意しました。<b>画像をクリックするだけ</b>で、見せたい中心を変更できます。",
        property: "売買物件の登録画面を用意しました。入力途中でも<b>下書き保存</b>できます。",
        rent: "賃貸・貸駐車場の登録画面を用意しました。種別を選ぶと、必要な項目だけを表示します。",
        news: "お知らせの作成画面を用意しました。文章の言い換えや公開予約もできます。",
        hero: "トップ画像の管理画面を用意しました。並び替えと公開プレビューを確認できます。",
        home: "目的をもう少し具体的に入力するか、下の候補から作業を選んでください。",
      };
      response.innerHTML = messages[requestedMode] || messages[mode] || messages.home;
      response.hidden = false;
    } else if (response) {
      response.hidden = true;
    }

    document.getElementById("task-workspace")?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => showMode(button.dataset.mode, false));
  });

  assistantForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const value = assistantInput?.value.trim() || "";
    let mode = "home";
    if (/画像|写真|トリミング|見切れ|中心/.test(value)) mode = "images";
    else if (/賃貸|駐車場/.test(value)) mode = "rent";
    else if (/物件|売買|土地/.test(value)) mode = "property";
    else if (/お知らせ|休暇|休業|ニュース/.test(value)) mode = "news";
    else if (/トップ|メイン|ヒーロー/.test(value)) mode = "hero";
    showMode(mode, true);
  });

  const focusStage = document.getElementById("focus-stage");
  const focusImage = document.getElementById("focus-image");
  const focusPreviews = Array.from(document.querySelectorAll(".focus-preview"));
  const containPreview = document.getElementById("contain-preview");
  const lightboxImage = document.getElementById("lightbox-image");

  function updateFocus(x, y) {
    const safeX = Math.max(0, Math.min(100, x));
    const safeY = Math.max(0, Math.min(100, y));
    focusStage?.style.setProperty("--focus-x", `${safeX}%`);
    focusStage?.style.setProperty("--focus-y", `${safeY}%`);
    focusPreviews.forEach((image) => {
      image.style.objectPosition = `${safeX}% ${safeY}%`;
    });
  }

  focusStage?.addEventListener("click", (event) => {
    const bounds = focusStage.getBoundingClientRect();
    updateFocus(
      ((event.clientX - bounds.left) / bounds.width) * 100,
      ((event.clientY - bounds.top) / bounds.height) * 100,
    );
  });

  document.getElementById("reset-focus")?.addEventListener("click", () => {
    updateFocus(50, 50);
  });

  document.querySelectorAll(".queue-photo").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".queue-photo").forEach((item) => item.classList.remove("is-selected"));
      button.classList.add("is-selected");
      const source = button.dataset.image;
      const alt = button.dataset.alt || "物件画像";
      if (!source) return;
      [focusImage, containPreview, lightboxImage, ...focusPreviews].forEach((image) => {
        if (!image) return;
        image.src = source;
        image.alt = alt;
      });
      updateFocus(50, 50);
    });
  });

  const lightbox = document.getElementById("lightbox");
  document.getElementById("compare-view")?.addEventListener("click", () => lightbox?.showModal());
  document.getElementById("close-lightbox")?.addEventListener("click", () => lightbox?.close());
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) lightbox.close();
  });

  const toast = document.getElementById("toast");
  let toastTimer;
  document.querySelectorAll(".save-action").forEach((button) => {
    button.addEventListener("click", () => {
      toast.hidden = false;
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => {
        toast.hidden = true;
      }, 2400);
    });
  });
})();
