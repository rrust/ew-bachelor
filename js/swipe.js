// Swipe gestures for mobile navigation

/**
 * Initialize swipe gestures on an element
 * @param {HTMLElement} element - Element to add swipe detection to
 * @param {Object} callbacks - { onSwipeLeft, onSwipeRight }
 * @param {Object} options - { threshold: minimum swipe distance }
 */
function initSwipeGestures(element, callbacks, options = {}) {
  const threshold = options.threshold || 50;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;

  element.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    },
    { passive: true }
  );

  element.addEventListener(
    'touchend',
    (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    },
    { passive: true }
  );

  function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Only trigger if horizontal swipe is greater than vertical (not scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX < 0 && callbacks.onSwipeLeft) {
        callbacks.onSwipeLeft();
      } else if (deltaX > 0 && callbacks.onSwipeRight) {
        callbacks.onSwipeRight();
      }
    }
  }
}

// Expose globally
window.SwipeGestures = {
  init: initSwipeGestures
};
