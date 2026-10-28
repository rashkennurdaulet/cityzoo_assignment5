/* =====================================================================
   Owner: Saidazimov Mukhammadjan
   Assignment #5 — Keyboard navigation for the main menu
   ArrowRight / ArrowLeft move focus between the top-level menu items,
   Home / End jump to the first / last item. Uses keydown + switch.
   ===================================================================== */
(function () {
  'use strict';

  /* all focusable top-level items of the navbar (links and the Subscribe button) */
  function getMenuItems(menu) {
    return Array.prototype.filter.call(
      menu.querySelectorAll(':scope > .nav-item > a, :scope > .nav-item > button'),
      function (item) { return item.offsetParent !== null; }
    );
  }

  /* returns the item that should receive focus, or null for "not our key" */
  function nextItem(items, currentIndex, key) {
    var last = items.length - 1;
    switch (key) {
      case 'ArrowRight':
      case 'ArrowDown':
        return items[currentIndex === last ? 0 : currentIndex + 1];
      case 'ArrowLeft':
      case 'ArrowUp':
        return items[currentIndex === 0 ? last : currentIndex - 1];
      case 'Home':
        return items[0];
      case 'End':
        return items[last];
      default:
        return null;
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    var menu = document.querySelector('.navbar-nav');
    if (!menu) return;

    menu.addEventListener('keydown', function (event) {
      var items = getMenuItems(menu);
      var index = items.indexOf(document.activeElement);
      if (index === -1) return;                       /* focus is inside a dropdown */

      /* leave ArrowDown alone on the dropdown toggle: Bootstrap opens the menu */
      if (event.key === 'ArrowDown' && items[index].classList.contains('dropdown-toggle')) return;

      var target = nextItem(items, index, event.key);
      if (target) {
        event.preventDefault();
        target.focus();
      }
    });
  });
})();
