// Swipe gestures for mobile navigation

/**
 * Initialize swipe gestures on an element
 * @param {HTMLElement} element - Element to add swipe detection to
 * @param {Object} callbacks - { onSwipeLeft, onSwipeRight }
 * @param {Object} options - { threshold: minimum swipe distance, animateElement: element to animate }
 */
function initSwipeGestures(element, callbacks, options = {}) {
  const threshold = options.threshold || 50;
  const animateElement = options.animateElement || null;
  let touchStartX = 0;
  let touchStartY = 0;
  let touchEndX = 0;
  let touchEndY = 0;
  let isSwiping = false;
  let isPinching = false;
  let isZoomed = false;

  // Track pinch-to-zoom state
  element.addEventListener(
    'touchstart',
    (e) => {
      // Detect multi-touch (pinch gesture starting)
      if (e.touches.length > 1) {
        isPinching = true;
        return;
      }

      // Don't start swipe if zoomed in
      if (isZoomed) return;

      isPinching = false;
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
      isSwiping = false;

      // Reset any ongoing animation
      if (animateElement) {
        animateElement.style.transform = '';
        animateElement.style.opacity = '';
      }
    },
    { passive: true }
  );

  element.addEventListener(
    'touchmove',
    (e) => {
      // Detect multi-touch (pinch gesture)
      if (e.touches.length > 1) {
        isPinching = true;
        isZoomed = true; // Assume zooming in
        return;
      }

      // Don't track swipe if pinching or zoomed
      if (isPinching || isZoomed) return;

      if (!animateElement) return;

      const currentX = e.changedTouches[0].screenX;
      const currentY = e.changedTouches[0].screenY;
      const deltaX = currentX - touchStartX;
      const deltaY = currentY - touchStartY;

      // Only track horizontal swipes (not scrolling)
      if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 10) {
        isSwiping = true;
        // Move the element with the finger (limited movement)
        const maxMove = 100;
        const move = Math.max(-maxMove, Math.min(maxMove, deltaX * 0.5));
        const opacity = 1 - (Math.abs(move) / maxMove) * 0.3;
        animateElement.style.transform = `translateX(${move}px)`;
        animateElement.style.opacity = opacity;
      }
    },
    { passive: true }
  );

  element.addEventListener(
    'touchend',
    (e) => {
      // If was pinching, check if we're back to no zoom
      if (isPinching) {
        isPinching = false;
        // Check zoom state after a small delay
        setTimeout(() => {
          checkZoomState();
        }, 100);
        return;
      }

      // Don't trigger swipe if zoomed
      if (isZoomed) {
        // Check if zoom was reset
        checkZoomState();
        return;
      }

      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      handleSwipe();
    },
    { passive: true }
  );

  /**
   * Check if the page is zoomed by comparing visual viewport to layout viewport
   */
  function checkZoomState() {
    if (window.visualViewport) {
      // visualViewport.scale > 1 means zoomed in
      isZoomed = window.visualViewport.scale > 1.05; // Small tolerance
    } else {
      // Fallback: assume not zoomed if API not available
      isZoomed = false;
    }
  }

  // Listen for viewport scale changes
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', () => {
      checkZoomState();
    });
  }

  function handleSwipe() {
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Reset element position if not a valid swipe
    if (animateElement) {
      animateElement.style.transition =
        'transform 0.3s ease-out, opacity 0.3s ease-out';
    }

    // Only trigger if horizontal swipe is greater than vertical (not scrolling)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > threshold) {
      if (deltaX < 0 && callbacks.onSwipeLeft) {
        // Animate out to the left, then call callback
        if (animateElement) {
          animateElement.style.transform = 'translateX(-100%)';
          animateElement.style.opacity = '0';
          setTimeout(() => {
            callbacks.onSwipeLeft();
            // Reset and animate in from right
            animateElement.style.transition = 'none';
            animateElement.style.transform = 'translateX(100%)';
            animateElement.style.opacity = '0';
            // Force reflow
            animateElement.offsetHeight;
            animateElement.style.transition =
              'transform 0.3s ease-out, opacity 0.3s ease-out';
            animateElement.style.transform = 'translateX(0)';
            animateElement.style.opacity = '1';
          }, 150);
        } else {
          callbacks.onSwipeLeft();
        }
      } else if (deltaX > 0 && callbacks.onSwipeRight) {
        // Animate out to the right, then call callback
        if (animateElement) {
          animateElement.style.transform = 'translateX(100%)';
          animateElement.style.opacity = '0';
          setTimeout(() => {
            callbacks.onSwipeRight();
            // Reset and animate in from left
            animateElement.style.transition = 'none';
            animateElement.style.transform = 'translateX(-100%)';
            animateElement.style.opacity = '0';
            // Force reflow
            animateElement.offsetHeight;
            animateElement.style.transition =
              'transform 0.3s ease-out, opacity 0.3s ease-out';
            animateElement.style.transform = 'translateX(0)';
            animateElement.style.opacity = '1';
          }, 150);
        } else {
          callbacks.onSwipeRight();
        }
      } else {
        // Reset position
        if (animateElement) {
          animateElement.style.transform = 'translateX(0)';
          animateElement.style.opacity = '1';
        }
      }
    } else {
      // Reset position - swipe didn't meet threshold
      if (animateElement) {
        animateElement.style.transform = 'translateX(0)';
        animateElement.style.opacity = '1';
      }
    }

    // Clean up transition after animation
    if (animateElement) {
      setTimeout(() => {
        animateElement.style.transition = '';
      }, 350);
    }
  }
}

/**
 * Animate a slide transition on an element
 * @param {HTMLElement} element - Element to animate
 * @param {string} direction - 'left' or 'right'
 * @param {Function} callback - Function to call during the transition
 */
function animateSlide(element, direction, callback) {
  if (!element) {
    if (callback) callback();
    return;
  }

  const slideOut = direction === 'left' ? '-100%' : '100%';
  const slideIn = direction === 'left' ? '100%' : '-100%';

  // Slide out
  element.style.transition = 'transform 0.15s ease-out, opacity 0.15s ease-out';
  element.style.transform = `translateX(${slideOut})`;
  element.style.opacity = '0';

  setTimeout(() => {
    // Call the callback (which updates the content)
    if (callback) callback();

    // Reset position instantly
    element.style.transition = 'none';
    element.style.transform = `translateX(${slideIn})`;

    // Force reflow
    element.offsetHeight;

    // Slide in
    element.style.transition =
      'transform 0.15s ease-out, opacity 0.15s ease-out';
    element.style.transform = 'translateX(0)';
    element.style.opacity = '1';

    // Clean up
    setTimeout(() => {
      element.style.transition = '';
    }, 200);
  }, 150);
}

// Expose globally
window.SwipeGestures = {
  init: initSwipeGestures,
  animateSlide: animateSlide
};
