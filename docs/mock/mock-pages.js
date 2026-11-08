(function () {
  var button = document.querySelector(".menu-button");
  var menu = document.getElementById("mobile-nav");

  if (button && menu) {
    button.addEventListener("click", function () {
      var isOpen = button.getAttribute("aria-expanded") === "true";
      button.setAttribute("aria-expanded", String(!isOpen));
      button.setAttribute(
        "aria-label",
        isOpen ? "メニューを開く" : "メニューを閉じる",
      );
      menu.hidden = isOpen;
    });
  }

  var propertyFilter = document.querySelector("[data-property-filter]");
  var propertyCards = Array.prototype.slice.call(
    document.querySelectorAll("#property-list [data-status][data-type]"),
  );
  var resultSummary = document.getElementById("property-result-summary");
  var emptyState = document.getElementById("property-empty");
  var pagination = document.querySelector("[data-property-pagination]");
  var pageNumbers = document.querySelector("[data-page-numbers]");

  if (!propertyFilter || !propertyCards.length) return;

  var selectedFilters = { status: "all", type: "all" };
  var currentPage = 1;
  var pageSize = 6;

  function renderPagination(totalPages) {
    if (!pagination || !pageNumbers) return;
    pagination.hidden = totalPages <= 1;
    pageNumbers.innerHTML = "";

    for (var page = 1; page <= totalPages; page += 1) {
      var pageButton = document.createElement("button");
      pageButton.type = "button";
      pageButton.textContent = String(page);
      pageButton.setAttribute("data-page", String(page));
      pageButton.setAttribute("aria-label", page + "ページ目を表示");
      if (page === currentPage) pageButton.setAttribute("aria-current", "page");
      pageNumbers.appendChild(pageButton);
    }

    var previousButton = pagination.querySelector('[data-page-action="previous"]');
    var nextButton = pagination.querySelector('[data-page-action="next"]');
    if (previousButton) previousButton.disabled = currentPage === 1;
    if (nextButton) nextButton.disabled = currentPage === totalPages;
  }

  function applyPropertyFilters() {
    var matchingCards = propertyCards.filter(function (card) {
      var matchesStatus =
        selectedFilters.status === "all" ||
        card.getAttribute("data-status") === selectedFilters.status;
      var matchesType =
        selectedFilters.type === "all" ||
        card.getAttribute("data-type") === selectedFilters.type;
      return matchesStatus && matchesType;
    });

    var totalPages = Math.max(1, Math.ceil(matchingCards.length / pageSize));
    currentPage = Math.min(currentPage, totalPages);
    var pageStart = (currentPage - 1) * pageSize;
    var visibleCards = matchingCards.slice(pageStart, pageStart + pageSize);

    propertyCards.forEach(function (card) {
      card.hidden = visibleCards.indexOf(card) === -1;
    });

    if (resultSummary) {
      resultSummary.innerHTML = "<strong>" + matchingCards.length + "</strong>件の物件";
    }
    if (emptyState) emptyState.hidden = matchingCards.length !== 0;
    renderPagination(matchingCards.length ? totalPages : 0);
  }

  propertyFilter.addEventListener("change", function (event) {
    var target = event.target;
    if (!target.matches("select[data-filter-group]")) return;
    var group = target.getAttribute("data-filter-group");
    var value = target.value;
    if (!group || !value) return;

    selectedFilters[group] = value;
    currentPage = 1;
    applyPropertyFilters();
  });

  pagination?.addEventListener("click", function (event) {
    var pageButton = event.target.closest("button");
    if (!pageButton || pageButton.disabled) return;
    var requestedPage = Number(pageButton.getAttribute("data-page"));
    var action = pageButton.getAttribute("data-page-action");
    if (requestedPage) currentPage = requestedPage;
    if (action === "previous") currentPage -= 1;
    if (action === "next") currentPage += 1;
    applyPropertyFilters();
  });

  document.querySelector("[data-reset-property-filter]")?.addEventListener("click", function () {
    selectedFilters.status = "all";
    selectedFilters.type = "all";
    currentPage = 1;
    propertyFilter.querySelectorAll("select[data-filter-group]").forEach(function (select) {
      select.value = "all";
    });
    applyPropertyFilters();
  });

  applyPropertyFilters();
})();
