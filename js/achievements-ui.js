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
  const { id, title, description, icon, currentStatus, progress } = achievement;

  let statusBadge = '';
  let statusIcon = '';
  let statusColor = '';
  let cardClass = 'cursor-pointer hover:shadow-lg';
  let daysRemaining = '';

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
    Icons.get(icon, 'w-10 h-10', 'text-gray-600 dark:text-gray-400') ||
    Icons.get('document', 'w-10 h-10', 'text-gray-600 dark:text-gray-400');

  return `
    <div id="achievement-${id}" class="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition duration-300 ${cardClass}">
      <div class="flex items-start justify-between mb-4">
        <div>${achievementIcon}</div>
        <span class="${statusColor} text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
          ${statusIcon}${statusBadge}
        </span>
      </div>
      
      <h3 class="text-xl font-bold mb-2">${title}</h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">${description}</p>
      
      ${
        daysRemaining
          ? `
        <div class="text-sm font-medium text-blue-600 dark:text-blue-400 mb-2">
          ${daysRemaining}
        </div>
      `
          : ''
      }
      
      ${
        currentStatus === 'locked' || currentStatus === 'expired'
          ? `
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p class="text-xs text-gray-500 dark:text-gray-500 font-medium mb-1">Freischalten:</p>
          <p class="text-xs text-gray-600 dark:text-gray-400">${unlockDesc}</p>
        </div>
      `
          : ''
      }
      
      ${
        currentStatus === 'unlocked' || currentStatus === 'locked-soon'
          ? `
        <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button class="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
            Öffnen
          </button>
        </div>
      `
          : ''
      }
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
  content.innerHTML = achievement.content;

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

  // Close modal listeners
  const closeBtn = document.getElementById('close-achievement-modal');
  closeBtn.onclick = () => modal.classList.add('hidden');

  modal.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  };
}

/**
 * Setup achievements view event listeners
 */
function setupAchievementsListeners() {
  // Filter buttons
  const filterButtons = document.querySelectorAll('.filter-btn');
  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach((b) => {
        b.classList.remove('bg-blue-500', 'text-white');
        b.classList.add(
          'bg-gray-200',
          'dark:bg-gray-700',
          'text-gray-800',
          'dark:text-gray-200'
        );
      });
      btn.classList.remove(
        'bg-gray-200',
        'dark:bg-gray-700',
        'text-gray-800',
        'dark:text-gray-200'
      );
      btn.classList.add('bg-blue-500', 'text-white');

      // Apply filter
      const filterId = btn.id.replace('filter-', '');
      renderAchievementsGallery(filterId);
    });
  });
}

// Expose functions to global scope
window.renderAchievementsGallery = renderAchievementsGallery;
window.showAchievementModal = showAchievementModal;
window.setupAchievementsListeners = setupAchievementsListeners;
