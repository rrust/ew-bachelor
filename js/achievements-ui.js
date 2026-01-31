// js/achievements-ui.js
// UI functions for displaying and managing achievements

/**
 * Render the achievements gallery
 */
function renderAchievementsGallery(filter = 'all') {
  const grid = document.getElementById('achievements-grid');
  if (!grid) return;

  // Check if APP_CONTENT is loaded
  if (!window.APP_CONTENT || !window.APP_CONTENT.achievements) {
    grid.innerHTML =
      '<div class="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">Lade Achievements...</div>';
    return;
  }

  const achievements = [];

  // Collect all achievements with their status
  for (const achievementId in window.APP_CONTENT.achievements) {
    const achievement = window.APP_CONTENT.achievements[achievementId];
    const status = getAchievementStatus(achievementId);
    const progress = getAchievementProgress(achievementId);

    achievements.push({
      ...achievement,
      currentStatus: status,
      progress: progress
    });
  }

  // Filter achievements
  const filteredAchievements = achievements.filter((achievement) => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return achievement.currentStatus === 'unlocked';
    if (filter === 'locked')
      return (
        achievement.currentStatus === 'locked' ||
        achievement.currentStatus === 'expired'
      );
    if (filter === 'expiring')
      return achievement.currentStatus === 'locked-soon';
    return true;
  });

  // Update stats
  const unlockedCount = achievements.filter(
    (a) => a.currentStatus === 'unlocked' || a.currentStatus === 'locked-soon'
  ).length;
  const expiringCount = achievements.filter(
    (a) => a.currentStatus === 'locked-soon'
  ).length;
  const lockedCount = achievements.filter(
    (a) => a.currentStatus === 'locked' || a.currentStatus === 'expired'
  ).length;

  document.getElementById('achievements-all').textContent = achievements.length;
  document.getElementById('achievements-total').textContent = unlockedCount;
  document.getElementById('achievements-expiring').textContent = expiringCount;
  document.getElementById('achievements-locked').textContent = lockedCount;

  // Render achievement cards
  grid.innerHTML =
    filteredAchievements.length > 0
      ? filteredAchievements
          .map((achievement) => createAchievementCard(achievement))
          .join('')
      : '<div class="col-span-full text-center text-gray-500 dark:text-gray-400 py-12">Keine Achievements gefunden</div>';

  // Add click listeners for achievement cards
  filteredAchievements.forEach((achievement) => {
    const card = document.getElementById(`achievement-${achievement.id}`);
    if (card) {
      card.addEventListener('click', () => {
        if (
          achievement.currentStatus === 'unlocked' ||
          achievement.currentStatus === 'locked-soon'
        ) {
          showAchievementModal(achievement);
        }
      });
    }
  });
}

/**
 * Create HTML for an achievement card
 */
function createAchievementCard(achievement) {
  const {
    id,
    title,
    description,
    icon,
    currentStatus,
    progress,
    achievementType
  } = achievement;

  let statusBadge = '';
  let statusIcon = '';
  let statusColor = '';
  let cardClass = 'cursor-pointer hover:shadow-lg';
  let daysRemaining = '';

  // Determine if this is a blueprint (vs cheatsheet)
  const isBlueprint = achievementType === 'blueprint';
  const typeBadge = isBlueprint
    ? `<span class="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 text-xs px-1.5 py-0.5 rounded mr-1">${Icons.get('pencil', 'w-3 h-3 inline')} Blueprint</span>`
    : '';

  switch (currentStatus) {
    case 'locked':
      statusIcon = Icons.get('lock', 'w-3 h-3 inline mr-1');
      statusBadge = 'Gesperrt';
      statusColor = 'bg-gray-500';
      cardClass = 'opacity-75 cursor-not-allowed';
      break;
    case 'unlocked':
      if (progress) {
        const expiresAt = new Date(progress.expiresAt);
        const now = new Date();
        const days = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
        daysRemaining = `noch ${days} Tage`;
      }
      statusIcon = Icons.get('unlock', 'w-3 h-3 inline mr-1');
      statusBadge = 'Aktiv';
      statusColor = 'bg-green-500';
      break;
    case 'locked-soon':
      if (progress) {
        const expiresAt = new Date(progress.expiresAt);
        const now = new Date();
        const days = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
        daysRemaining = `${days} Tage!`;
      }
      statusIcon = Icons.get('clock', 'w-3 h-3 inline mr-1');
      statusBadge = 'Läuft bald ab';
      statusColor = 'bg-yellow-500';
      break;
    case 'expired':
      statusIcon = Icons.get('hourglass', 'w-3 h-3 inline mr-1');
      statusBadge = 'Abgelaufen';
      statusColor = 'bg-red-500';
      cardClass = 'opacity-75 cursor-not-allowed';
      break;
  }

  // Get unlock condition description
  const unlockDesc = getUnlockConditionDescription(achievement.unlockCondition);

  // Render achievement icon (use Icons.get if it's a known icon name, otherwise show placeholder)
  const achievementIcon =
    Icons.get(icon, 'w-6 h-6', 'text-gray-600 dark:text-gray-400') ||
    Icons.get('document', 'w-6 h-6', 'text-gray-600 dark:text-gray-400');

  return `
    <div id="achievement-${id}" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition duration-300 ${cardClass}">
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0 mt-0.5">${achievementIcon}</div>
        <div class="flex-grow min-w-0">
          <div class="flex items-start justify-between gap-3 mb-1">
            <h3 class="font-bold text-sm">${typeBadge}${title}</h3>
            <span class="${statusColor} text-white text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0">
              ${statusBadge}
            </span>
          </div>
          <p class="text-xs text-gray-600 dark:text-gray-400">${description}</p>
          ${
            daysRemaining
              ? `<span class="text-xs font-medium text-blue-600 dark:text-blue-400 mt-1 inline-block">${daysRemaining}</span>`
              : ''
          }
        </div>
      </div>
    </div>
  `;
}

/**
 * Get human-readable unlock condition description
 */
function getUnlockConditionDescription(condition) {
  switch (condition.type) {
    case 'lecture-quiz-gold':
      return 'Gold-Badge (≥90%) im Lecture Quiz erreichen';
    case 'lecture-item-reached':
      return `Item ${condition.itemIndex} in der Vorlesung erreichen`;
    case 'module-exam-gold':
      return 'Gold-Badge im Modul-Exam erreichen';
    case 'multiple-lecture-gold':
      return `Gold-Badges in ${condition.lectureIds.length} Vorlesungen erreichen`;
    case 'consecutive-lecture-gold':
      return `${condition.count} aufeinanderfolgende Gold-Badges erreichen`;
    case 'achievement-with-extensions':
      return 'Vorheriges Achievement erfolgreich verlängern';
    case 'first-exercise-solved':
      return 'Erste praktische Übung im Modul-Training lösen';
    default:
      return 'Bedingungen erfüllen';
  }
}

/**
 * Show achievement detail modal
 */
function showAchievementModal(achievement) {
  const modal = document.getElementById('achievement-modal');
  const iconEl = document.getElementById('modal-achievement-icon');
  const title = document.getElementById('modal-achievement-title');
  const content = document.getElementById('modal-achievement-content');

  // Render achievement icon as SVG
  iconEl.innerHTML =
    Icons.get(achievement.icon, 'w-8 h-8', 'text-yellow-500') ||
    Icons.get('document', 'w-8 h-8', 'text-yellow-500');
  title.textContent = achievement.title;

  // Parse markdown content on-the-fly (for lazy-loaded achievements)
  // or use pre-parsed HTML if available (for full content mode)
  let htmlContent;
  if (achievement.contentMarkdown && window.marked) {
    htmlContent = marked.parse(achievement.contentMarkdown);
  } else {
    htmlContent = achievement.content || '';
  }

  // Remove the first H1 tag from content (it's already shown in the modal header)
  // This prevents duplicate title display
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = htmlContent;
  const firstH1 = tempDiv.querySelector('h1');
  if (firstH1) {
    firstH1.remove();
  }
  content.innerHTML = tempDiv.innerHTML;

  // Render math in achievement content if available
  if (window.renderMathInElement) {
    renderMathInElement(content, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      throwOnError: false
    });
  }

  modal.classList.remove('hidden');

  // Get modal container for fullscreen toggle
  const container = document.getElementById('achievement-modal-container');
  const fullscreenBtn = document.getElementById('fullscreen-achievement-modal');

  // Helper to reset fullscreen state and icons
  const resetFullscreenState = () => {
    container.classList.remove('fullscreen-modal');
    if (fullscreenBtn) {
      const expandIcon = fullscreenBtn.querySelector('.fullscreen-expand-icon');
      const collapseIcon = fullscreenBtn.querySelector(
        '.fullscreen-collapse-icon'
      );
      if (expandIcon && collapseIcon) {
        expandIcon.classList.remove('hidden');
        collapseIcon.classList.add('hidden');
      }
      fullscreenBtn.title = 'Vollbild';
    }
  };

  // Close modal listeners
  const closeBtn = document.getElementById('close-achievement-modal');
  closeBtn.onclick = () => {
    modal.classList.add('hidden');
    resetFullscreenState();
  };

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
      resetFullscreenState();
    }
  };

  // Fullscreen toggle
  if (fullscreenBtn) {
    fullscreenBtn.onclick = () => {
      container.classList.toggle('fullscreen-modal');
      // Toggle icon visibility
      const expandIcon = fullscreenBtn.querySelector('.fullscreen-expand-icon');
      const collapseIcon = fullscreenBtn.querySelector(
        '.fullscreen-collapse-icon'
      );
      if (expandIcon && collapseIcon) {
        expandIcon.classList.toggle('hidden');
        collapseIcon.classList.toggle('hidden');
      }
      // Update title
      fullscreenBtn.title = container.classList.contains('fullscreen-modal')
        ? 'Verkleinern'
        : 'Vollbild';
    };
  }
}

/**
 * Setup achievements view event listeners
 */
function setupAchievementsListeners() {
  // Stat card filters
  const statButtons = document.querySelectorAll('.stat-filter-btn');
  statButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active state - remove ring from all, add to clicked
      statButtons.forEach((b) => {
        b.classList.remove('ring-2', 'ring-blue-500');
      });
      btn.classList.add('ring-2', 'ring-blue-500');

      // Apply filter
      const filterId = btn.id.replace('filter-', '');
      renderAchievementsGallery(filterId);
    });
  });
}

/**
 * Show achievement modal by ID (for linking from other views)
 */
function showAchievementModalById(achievementId) {
  if (!window.APP_CONTENT || !window.APP_CONTENT.achievements) {
    console.warn('[AchievementsUI] Achievements not loaded');
    return;
  }

  const achievement = window.APP_CONTENT.achievements[achievementId];
  if (!achievement) {
    console.warn('[AchievementsUI] Achievement not found:', achievementId);
    return;
  }

  showAchievementModal(achievement);
}

// Expose functions to global scope
window.renderAchievementsGallery = renderAchievementsGallery;
window.showAchievementModal = showAchievementModal;
window.showAchievementModalById = showAchievementModalById;
window.setupAchievementsListeners = setupAchievementsListeners;
