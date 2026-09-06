(function () {
  var button = document.querySelector(".menu-button");
  var menu = document.getElementById("mobile-nav");

  if (!button || !menu) return;

  button.addEventListener("click", function () {
    var isOpen = button.getAttribute("aria-expanded") === "true";
    button.setAttribute("aria-expanded", String(!isOpen));
    button.setAttribute(
      "aria-label",
      isOpen ? "メニューを開く" : "メニューを閉じる",
    );
    menu.hidden = isOpen;
  });
})();
