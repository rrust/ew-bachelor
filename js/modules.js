// Modules module - Handles module cards and lecture lists

/**
 * Calculates estimated time for a module (sum of all lectures and quizzes)
 * Works with both full content and lazy-loading mode
 * @param {string} moduleId - Module ID
 * @param {Object} APP_CONTENT - Content object
 * @returns {number} Total estimated time in minutes
 */
function getModuleEstimatedTime(moduleId, APP_CONTENT) {
  const module = APP_CONTENT[moduleId];

  // First, try from loaded content (full mode)
  if (module && module.lectures) {
    let totalTime = 0;
    let hasLoadedLectures = false;

    for (const lectureId in module.lectures) {
      const lecture = module.lectures[lectureId];
      if (lecture.estimatedTime !== undefined) {
        hasLoadedLectures = true;
        totalTime += lecture.estimatedTime || 0;
        totalTime += lecture.quizEstimatedTime || 0;
      }
    }

    if (hasLoadedLectures) {
      return totalTime;
    }
  }

  // In lazy-loading mode, try to get from manifest
  if (window.DownloadManager) {
    const settings = window.getAppSettings ? window.getAppSettings() : {};
    const studyId = settings.activeStudyId;
    const moduleMeta = window.MODULES?.find((m) => m.id === moduleId);

    if (moduleMeta && moduleMeta.lectures) {
      // Estimate: 15 min per lecture as fallback
      return moduleMeta.lectures.length * 15;
    }
  }

  return 0;
}

/**
 * Formats minutes into a readable time string (e.g., "1h 30min" or "25min")
 * @param {number} minutes - Time in minutes
 * @returns {string} Formatted time string
 */
function formatEstimatedTime(minutes) {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours} h`;
  }
  return `${hours} h ${remainingMinutes} min`;
}

/**
 * Calculates statistics for a module (quiz completion, average score, badge)
 * Works with both full content and lazy-loading mode
 * @param {string} moduleId - Module ID
 * @param {Object} APP_CONTENT - Content object
 * @param {Function} getUserProgress - Function to get user progress
 * @returns {Object} Stats object with totalQuizzes, completedQuizzes, averageScore, badge
 */
function getModuleStats(moduleId, APP_CONTENT, getUserProgress) {
  const module = APP_CONTENT[moduleId];
  const progress = getUserProgress();

  // Get module metadata from MODULES array for lecture count
  const moduleMeta = window.MODULES?.find((m) => m.id === moduleId);
  const lectureIds = moduleMeta?.lectures || [];

  // In lazy-loading mode, we may not have lecture data loaded
  // So we count quizzes from user progress instead
  let totalQuizzes = 0;
  let completedQuizzes = 0;
  let totalScore = 0;

  // First, try to get stats from loaded content (full mode)
  if (module && module.lectures) {
    for (const lectureId in module.lectures) {
      const lecture = module.lectures[lectureId];
      if (lecture.quiz && lecture.quiz.length > 0) {
        totalQuizzes++;
        const lectureProgress =
          progress?.modules?.[moduleId]?.lectures?.[lectureId];
        if (lectureProgress && lectureProgress.score !== undefined) {
          completedQuizzes++;
          totalScore += lectureProgress.score;
        }
      }
    }
  }

  // If no content loaded (lazy mode), estimate from manifest and progress
  if (totalQuizzes === 0 && lectureIds.length > 0) {
    // Assume each lecture has a quiz (will be refined when content loads)
    totalQuizzes = lectureIds.length;

    // Count completed from progress
    for (const lectureId of lectureIds) {
      const lectureProgress =
        progress?.modules?.[moduleId]?.lectures?.[lectureId];
      if (lectureProgress && lectureProgress.score !== undefined) {
        completedQuizzes++;
        totalScore += lectureProgress.score;
      }
    }
  }

  const averageScore = completedQuizzes > 0 ? totalScore / completedQuizzes : 0;

  // Determine badge based on average score of completed quizzes
  const thresholds = window.BADGE_THRESHOLDS || {
    GOLD: 90,
    SILVER: 70,
    BRONZE: 50
  };
  let badge = 'none';
  if (completedQuizzes > 0) {
    if (averageScore >= thresholds.GOLD) {
      badge = 'gold';
    } else if (averageScore >= thresholds.SILVER) {
      badge = 'silver';
    } else if (averageScore >= thresholds.BRONZE) {
      badge = 'bronze';
    } else {
      badge = 'incomplete';
    }
  }

  return { totalQuizzes, completedQuizzes, averageScore, badge };
}

/**
 * Auto-sync all modules in the background
 * Downloads all lectures for all unlocked modules
 * @param {Array} MODULES - Module metadata array
 * @param {HTMLElement} container - Container with module cards
 */
async function autoSyncAllModules(MODULES, container) {
  if (!window.DownloadManager || !window.BundleLoader) return;

  const settings = window.getAppSettings ? window.getAppSettings() : {};
  const studyId = settings.activeStudyId;
  if (!studyId) return;

  // Only sync unlocked modules
  const unlockedModules = MODULES.filter((m) => m.status !== 'gesperrt');

  console.log(
    `[Modules] Auto-syncing ${unlockedModules.length} modules in background`
  );

  for (const module of unlockedModules) {
    const moduleId = module.id;
    const lectureIds = module.lectures || [];

    if (lectureIds.length === 0) continue;

    // Get status element for this module
    const statusEl = container.querySelector(
      `.module-offline-status[data-module="${moduleId}"]`
    );

    // Check how many need syncing
    let needsSync = false;
    for (const lectureId of lectureIds) {
      const status = await window.DownloadManager.getStatus(
        studyId,
        moduleId,
        lectureId
      );
      if (status === 'not-downloaded' || status === 'outdated') {
        needsSync = true;
        break;
      }
    }

    if (!needsSync) continue;

    // Show spinner on module card and track start time
    const spinnerStartTime = Date.now();
    if (statusEl) {
      statusEl.innerHTML = `<span class="text-blue-500 dark:text-blue-400 inline-block animate-spin" title="Wird synchronisiert...">${Icons.get(
        'spinner',
        'w-5 h-5'
      )}</span>`;
    }

    // Sync all lectures for this module
    let syncedCount = 0;
    for (const lectureId of lectureIds) {
      try {
        const status = await window.DownloadManager.getStatus(
          studyId,
          moduleId,
          lectureId
        );
        if (status === 'not-downloaded' || status === 'outdated') {
          await window.BundleLoader.loadLectureFromBundle(
            studyId,
            moduleId,
            lectureId
          );
          syncedCount++;
        }
      } catch (e) {
        console.warn(`[Modules] Failed to sync ${moduleId}/${lectureId}:`, e);
      }
    }

    // Ensure spinner is visible for at least 1 second
    const elapsed = Date.now() - spinnerStartTime;
    const minDisplayTime = 1000; // 1 second minimum
    if (elapsed < minDisplayTime) {
      await new Promise((resolve) =>
        setTimeout(resolve, minDisplayTime - elapsed)
      );
    }

    // Update module status to green
    if (statusEl) {
      statusEl.innerHTML = `<span class="text-green-500 dark:text-green-400" title="Alle ${
        lectureIds.length
      } Vorlesungen offline verfügbar">${Icons.get(
        'cloudCheck',
        'w-5 h-5'
      )}</span>`;
    }

    if (syncedCount > 0) {
      console.log(`[Modules] Synced ${syncedCount} lectures for ${moduleId}`);
    }
  }

  console.log('[Modules] Background sync complete');
}

/**
 * Update offline status indicators for module cards
 * @param {HTMLElement} container - Container with module cards
 */
async function updateModuleOfflineStatus(container) {
  if (!window.DownloadManager) return;

  const settings = window.getAppSettings ? window.getAppSettings() : {};
  const studyId = settings.activeStudyId;
  if (!studyId) return;

  const statusElements = container.querySelectorAll('.module-offline-status');

  for (const el of statusElements) {
    const moduleId = el.dataset.module;

    const status = await window.DownloadManager.getModuleDownloadStatus(
      studyId,
      moduleId
    );

    if (status.downloaded === 0) {
      // No lectures downloaded - show gray crossed-out cloud
      el.innerHTML = `<span class="text-gray-400 dark:text-gray-500" title="Nicht offline verfügbar">${Icons.get(
        'cloudOff',
        'w-5 h-5'
      )}</span>`;
    } else if (status.downloaded === status.total && status.outdated === 0) {
      // All lectures downloaded and current
      el.innerHTML = `<span class="text-green-500 dark:text-green-400" title="Alle ${
        status.total
      } Vorlesungen offline verfügbar">${Icons.get(
        'cloudCheck',
        'w-5 h-5'
      )}</span>`;
    } else if (status.outdated > 0) {
      // Some lectures have updates available
      el.innerHTML = `<span class="text-amber-500 dark:text-amber-400" title="${
        status.downloaded
      }/${status.total} offline (${status.outdated} mit Updates)">${Icons.get(
        'cloudDownload',
        'w-5 h-5'
      )}</span>`;
    } else {
      // Partial download - show yellow cloud
      el.innerHTML = `<span class="text-amber-500 dark:text-amber-400" title="${
        status.downloaded
      }/${status.total} Vorlesungen offline verfügbar">${Icons.get(
        'cloudCheck',
        'w-5 h-5'
      )}</span>`;
    }
  }
}

/**
 * Loads and displays all module cards
 * @param {Array} MODULES - Module metadata array
 * @param {Object} APP_CONTENT - Content object
 * @param {Function} getUserProgress - Function to get user progress
 * @param {Function} getModuleStats - Function to get module stats
 * @param {Function} createModuleCard - Function to create a card
 * @param {Function} displayLecturesForModule - Function to display lectures
 */
function loadModuleCards(
  MODULES,
  APP_CONTENT,
  getUserProgress,
  getModuleStats,
  createModuleCard,
  displayLecturesForModule
) {
  const moduleGrid = document.getElementById('module-grid');
  moduleGrid.innerHTML = '';

  // Sort modules by order
  const sortedModules = [...MODULES].sort((a, b) => a.order - b.order);

  for (const module of sortedModules) {
    const card = createModuleCard(module.id, module, () =>
      displayLecturesForModule(module.id)
    );
    moduleGrid.appendChild(card);
  }

  // Update offline status for all modules async
  updateModuleOfflineStatus(moduleGrid);

  // Auto-sync all modules in background when online
  if (navigator.onLine) {
    autoSyncAllModules(MODULES, moduleGrid);
  }
}

/**
 * Creates a single module card
 * @param {string} moduleId - Module ID
 * @param {Object} moduleMeta - Module metadata
 * @param {Object} APP_CONTENT - Content object
 * @param {Function} getUserProgress - Function to get user progress
 * @param {Function} getModuleStats - Function to get module stats
 * @param {Function} onClick - Click handler for the card
 * @returns {HTMLElement} The module card element
 */
function createModuleCard(
  moduleId,
  moduleMeta,
  APP_CONTENT,
  getUserProgress,
  getModuleStats,
  onClick
) {
  const stats = getModuleStats(moduleId, APP_CONTENT, getUserProgress);
  const estimatedTime = getModuleEstimatedTime(moduleId, APP_CONTENT);
  const formattedTime = formatEstimatedTime(estimatedTime);

  const card = document.createElement('div');
  card.className =
    'module-card bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col min-h-[200px]';

  if (moduleMeta.status === 'gesperrt') {
    card.classList.add('locked', 'opacity-50');
  }

  // Card Header: Status (left), ECTS (center), Badge (right)
  let cardHTML = `
          <div class="card-header flex items-center justify-between px-4 py-3 border-b dark:border-gray-700 rounded-t-lg">
              <div class="status-badge text-xs font-semibold px-2 py-1 rounded-full ${
                moduleMeta.status === 'gesperrt'
                  ? 'bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200'
                  : 'bg-green-200 dark:bg-green-900 text-green-800 dark:text-green-200'
              }">${moduleMeta.status}</div>
              <span class="text-sm font-medium text-gray-600 dark:text-gray-400">${
                moduleMeta.ects
              } ECTS</span>
      `;

  // Badge on the right - use colored stars
  cardHTML += '<div class="badge-container">';
  if (stats.totalQuizzes > 0 && moduleMeta.status !== 'gesperrt') {
    const badgeInfo = window.getBadgeInfo
      ? window.getBadgeInfo(stats.averageScore)
      : { html: '☆', text: '' };
    if (stats.completedQuizzes > 0) {
      cardHTML += `<span class="text-2xl" title="Durchschnittliche Punktzahl: ${stats.averageScore.toFixed(
        0
      )}% (${badgeInfo.text})">${badgeInfo.html}</span>`;
    } else {
      cardHTML += `<span class="text-2xl" title="Noch keine Quizzes absolviert"><span style="color: #D1D5DB;">☆</span></span>`;
    }
  } else {
    cardHTML +=
      '<span class="text-2xl" title="Noch keine Quizzes absolviert"><span style="color: #D1D5DB;">☆</span></span>';
  }
  cardHTML += '</div>';
  cardHTML += '</div>'; // Close header

  // Card Content: Module Title and Description
  cardHTML += `
          <div class="card-content flex-grow px-4 py-6">
              <h3 class="text-lg font-bold text-gray-800 dark:text-gray-100 mb-2">${
                moduleMeta.title
              }</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">${
                moduleMeta.description || ''
              }</p>
              ${
                estimatedTime > 0
                  ? `<p class="text-xs text-gray-400 dark:text-gray-500">⏱️ Geschätzte Dauer: ${formattedTime}</p>`
                  : ''
              }
          </div>
      `;

  // Card Footer: Action buttons (right aligned)
  if (moduleMeta.status !== 'gesperrt') {
    // Extract module number from ID (e.g., "01-" from "01-ernaehrungslehre-grundlagen")
    const moduleNumber = moduleId.match(/^(\d+)-/)?.[1] || '';

    // Calculate completion percentage for progress bar
    const completionPercent =
      stats.totalQuizzes > 0
        ? (stats.completedQuizzes / stats.totalQuizzes) * 100
        : 0;

    // Mini progress bar
    cardHTML += `
      <div class="px-4 pt-2">
        <div class="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>${stats.completedQuizzes}/${stats.totalQuizzes} Tests</span>
          <span>${Math.round(completionPercent)}%</span>
        </div>
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
          <div class="bg-blue-500 dark:bg-blue-400 h-1.5 rounded-full transition-all duration-300" 
               style="width: ${completionPercent}%"></div>
        </div>
      </div>
    `;

    cardHTML +=
      '<div class="card-footer px-4 py-3 border-t dark:border-gray-700 rounded-b-lg flex items-center justify-between mt-2">';

    // Module icon + number + middot + offline status on the left
    cardHTML += `<div class="flex items-center gap-1.5">`;
    if (moduleNumber) {
      const moduleIcon = Icons.get(
        'modules',
        'w-4 h-4',
        'text-gray-500 dark:text-gray-400'
      );
      cardHTML += `<span class="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">${moduleIcon}${moduleNumber}</span>`;
      cardHTML += `<span class="text-gray-400 dark:text-gray-500">&middot;</span>`;
    }
    // Placeholder for offline status - will be updated async
    cardHTML += `<span class="module-offline-status flex items-center" data-module="${moduleId}"></span>`;
    cardHTML += `</div>`;

    // Action buttons on the right
    cardHTML += '<div class="flex items-center space-x-2">';
    cardHTML += `<button class="view-lectures-btn text-sm px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition duration-200" title="Vorlesungen">${Icons.get(
      'book',
      'w-4 h-4'
    )}</button>`;

    // Exam button
    const EXAM_UNLOCK_THRESHOLD = 80;
    const examEnabled =
      stats.averageScore >= EXAM_UNLOCK_THRESHOLD && stats.completedQuizzes > 0;
    const examBtnClass = examEnabled
      ? 'text-sm px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded transition duration-200'
      : 'text-sm px-3 py-1.5 bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 font-medium rounded cursor-not-allowed';

    const examTooltip = examEnabled
      ? 'Modulprüfung ablegen'
      : `Deine aktuelle Punktzahl: ${stats.averageScore.toFixed(
          0
        )}%, du brauchst 80%`;

    cardHTML += `<button class="exam-btn ${examBtnClass}" ${
      !examEnabled ? 'disabled' : ''
    } title="${examTooltip}">${Icons.get('exam', 'w-4 h-4')}</button>`;
    cardHTML += '</div>'; // Close action buttons
    cardHTML += '</div>'; // Close footer
  }

  card.innerHTML = cardHTML;

  // Add event listeners
  if (moduleMeta.status !== 'gesperrt') {
    const viewLecturesBtn = card.querySelector('.view-lectures-btn');
    viewLecturesBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      onClick();
    });

    const examBtn = card.querySelector('.exam-btn');
    if (examBtn && !examBtn.disabled) {
      examBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        // TODO: Start module exam
        alert('Modulprüfung wird noch implementiert.');
      });
    }
  }

  return card;
}

/**
 * Displays the lecture list for a module
 * Works with both full content and lazy-loading mode
 * @param {string} moduleId - Module ID
 * @param {Object} APP_CONTENT - Content object
 * @param {Array} MODULES - Module metadata array
 * @param {Function} getUserProgress - Function to get user progress
 * @param {Function} updateURL - URL update function
 * @param {Function} showView - View switching function
 * @param {Function} startLecture - Function to start a lecture
 * @param {Function} startQuiz - Function to start a quiz
 * @param {Function} showLectureOverview - Function to show overview
 * @param {Function} loadModuleCards - Function to reload module cards when navigating back
 */
async function displayLecturesForModule(
  moduleId,
  APP_CONTENT,
  MODULES,
  getUserProgress,
  updateURL,
  showView,
  startLecture,
  startQuiz,
  showLectureOverview,
  loadModuleCards
) {
  const module = APP_CONTENT[moduleId];
  const progress = getUserProgress();
  const moduleData = MODULES.find((m) => m.id === moduleId);

  // Get lecture IDs from module metadata (works in lazy mode)
  const lectureIds = moduleData?.lectures || [];

  if (
    lectureIds.length === 0 &&
    (!module || !module.lectures || Object.keys(module.lectures).length === 0)
  ) {
    alert('Für dieses Modul wurden keine Vorlesungen gefunden.');
    return;
  }

  // Update URL
  updateURL(`/module/${moduleId}`, moduleData?.title || 'Module');

  // Hide player and overview, show lecture list
  document.getElementById('lecture-player').style.display = 'none';
  document.getElementById('lecture-overview').style.display = 'none';
  const lectureListContainer = document.getElementById(
    'lecture-list-container'
  );
  lectureListContainer.style.display = 'block';
  showView('lecture');

  // Clear and inject header
  lectureListContainer.innerHTML = '';
  if (window.injectHeader) {
    window.injectHeader('lecture-list-container', 'lecture', {
      moduleTitle: moduleData?.title || moduleId,
      moduleIcon: moduleData?.icon || 'modules'
    });
  }

  // Recreate the content structure
  const container = document.createElement('div');
  container.className = 'container mx-auto px-8';
  const lectureContentDiv = document.createElement('div');
  lectureContentDiv.id = 'lecture-content';
  lectureContentDiv.className =
    'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8';
  container.appendChild(lectureContentDiv);
  lectureListContainer.appendChild(container);

  // Set up back button listener
  const backButton = document.getElementById('back-to-modules-button');
  if (backButton) {
    backButton.addEventListener('click', () => {
      if (loadModuleCards) {
        loadModuleCards();
      }
      showView('moduleMap');
      updateURL('/', 'Module Overview');
    });
  }

  // Get settings for manifest lookup
  const settings = window.getAppSettings ? window.getAppSettings() : {};
  const studyId = settings.activeStudyId;

  // Determine which lectures to show
  // In lazy mode: use lectureIds from module metadata
  // In full mode: use loaded lectures from APP_CONTENT
  const lecturesToShow =
    lectureIds.length > 0 ? lectureIds : Object.keys(module?.lectures || {});

  for (const lectureId of lecturesToShow) {
    // Get lecture data from APP_CONTENT (if loaded) or from manifest
    let lecture = module?.lectures?.[lectureId];
    let lectureInfo = null;

    // In lazy mode, get info from manifest
    if (!lecture || !lecture.items || lecture.items.length === 0) {
      if (window.DownloadManager) {
        lectureInfo = await window.DownloadManager.getLectureInfo(
          studyId,
          moduleId,
          lectureId
        );
      }
    }

    // Skip if no data at all
    if (!lecture && !lectureInfo) continue;

    const lectureProgress =
      progress?.modules?.[moduleId]?.lectures?.[lectureId];

    const card = document.createElement('div');
    card.className =
      'bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col min-h-[280px] border border-gray-200 dark:border-gray-700';

    // Get display values - prefer loaded data, fall back to manifest
    const topic =
      lecture?.topic ||
      lectureInfo?.topic ||
      lectureId.replace(/^\d+-/, '').replace(/-/g, ' ');
    const description = lecture?.description || lectureInfo?.description || '';
    const lectureItemCount =
      lecture?.items?.length || lectureInfo?.itemCount || 0;
    const quizQuestionCount =
      lecture?.quiz?.length || lectureInfo?.quizCount || 0;
    const lectureTime =
      lecture?.estimatedTime || lectureInfo?.estimatedTime || 0;
    const quizTime =
      lecture?.quizEstimatedTime || Math.round(quizQuestionCount * 2);
    const lectureVersion = lecture?.version || lectureInfo?.version || null;
    const hasQuiz = quizQuestionCount > 0;

    // Card Header with badge
    let contentHTML = `<div class="px-5 py-4 border-b dark:border-gray-700">`;
    contentHTML += `<div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-lg text-gray-900 dark:text-gray-100 flex-grow pr-2">${topic}</h3>`;

    // Add quiz badge in header if available
    if (hasQuiz) {
      let badgeEmoji = '';
      let tooltipText = '';

      if (lectureProgress?.score !== undefined) {
        const badgeInfo = window.getBadgeInfo
          ? window.getBadgeInfo(lectureProgress.score)
          : { html: '☆', text: '' };
        badgeEmoji = badgeInfo.html;
        tooltipText = `Erreichte Punktzahl: ${lectureProgress.score.toFixed(
          0
        )}% (${badgeInfo.text})`;
      } else {
        badgeEmoji = '<span style="color: #D1D5DB;">☆</span>';
        tooltipText = 'Quiz noch nicht absolviert';
      }
      contentHTML += `<span class="text-2xl flex-shrink-0" title="${tooltipText}">${badgeEmoji}</span>`;
    }
    contentHTML += `</div>`;

    // Content counts in header (lecture items and quiz questions)
    if (lectureItemCount > 0 || quizQuestionCount > 0) {
      contentHTML += `<div class="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">`;
      if (lectureItemCount > 0) {
        const timeInfo =
          lectureTime > 0 ? ` · ${formatEstimatedTime(lectureTime)}` : '';
        contentHTML += `<span class="flex items-center gap-1">${Icons.get(
          'book',
          'w-3.5 h-3.5'
        )} ${lectureItemCount}${timeInfo}</span>`;
      }
      if (quizQuestionCount > 0) {
        const timeInfo =
          quizTime > 0 ? ` · ${formatEstimatedTime(quizTime)}` : '';
        contentHTML += `<span class="flex items-center gap-1">${Icons.get(
          'pencil',
          'w-3.5 h-3.5'
        )} ${quizQuestionCount}${timeInfo}</span>`;
      }
      if (lectureVersion) {
        contentHTML += `<span class="text-gray-400 dark:text-gray-500">v${lectureVersion}</span>`;
      }
      contentHTML += `</div>`;
    }
    contentHTML += `</div>`; // Close header

    // Card Content - Description
    contentHTML += `<div class="flex-grow px-5 py-4">`;
    if (description) {
      contentHTML += `<p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">${description}</p>`;
    }
    contentHTML += `</div>`;

    // Card Footer - Action buttons with lecture number and download status
    // Extract lecture number from ID (e.g., "01-" from "01-grundlagen-zellbiologie")
    const lectureNumber = lectureId.match(/^(\d+)-/)?.[1] || '';

    contentHTML += `<div class="px-4 py-3 border-t dark:border-gray-700 rounded-b-lg flex items-center justify-between">`;

    // Lecture number + middot + offline indicator on the left
    contentHTML += `<div class="flex items-center gap-1.5">`;
    if (lectureNumber) {
      contentHTML += `<span class="text-xs font-semibold text-gray-500 dark:text-gray-400">${lectureNumber}</span>`;
      contentHTML += `<span class="text-gray-400 dark:text-gray-500">&middot;</span>`;
    }
    // Placeholder for offline status - will be updated async
    contentHTML += `<span class="offline-status flex items-center" data-module="${moduleId}" data-lecture="${lectureId}"></span>`;
    contentHTML += `</div>`;

    // Action buttons on the right - will be updated with download status
    contentHTML += `<div class="flex items-center space-x-2 lecture-actions" data-module="${moduleId}" data-lecture="${lectureId}">`;
    contentHTML += `<button data-action="start-lecture" data-module="${moduleId}" data-lecture="${lectureId}" class="text-sm px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition duration-200" title="Vorlesung">${Icons.get(
      'book',
      'w-4 h-4'
    )}</button>`;
    contentHTML += `<button data-action="show-lecture-overview" data-module="${moduleId}" data-lecture="${lectureId}" class="text-sm px-2.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition duration-200" title="Übersicht">${Icons.get(
      'listBullet',
      'w-4 h-4'
    )}</button>`;

    if (hasQuiz) {
      contentHTML += `<button data-action="start-quiz" data-module="${moduleId}" data-lecture="${lectureId}" class="text-sm px-2.5 py-1.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded transition duration-200" title="Test">${Icons.get(
        'exam',
        'w-4 h-4'
      )}</button>`;
    }

    contentHTML += '</div>'; // Close action buttons

    contentHTML += '</div>'; // Close footer

    card.innerHTML = contentHTML;
    lectureContentDiv.appendChild(card);
  }

  // Update offline status indicators async, then auto-sync
  await updateLectureOfflineStatus(lectureContentDiv, studyId);

  // Auto-sync all lectures in background when online
  if (navigator.onLine) {
    autoSyncModuleLectures(
      studyId,
      moduleId,
      lecturesToShow,
      lectureContentDiv
    );
  }

  // Add event listeners for the new buttons
  lectureContentDiv.addEventListener('click', (e) => {
    const button = e.target.closest('button[data-action]');
    if (!button) return;

    const action = button.dataset.action;
    const modId = button.dataset.module;
    const lecId = button.dataset.lecture;

    if (action === 'start-lecture') {
      startLecture(modId, lecId);
    } else if (action === 'show-lecture-overview') {
      showLectureOverview(modId, lecId);
    } else if (action === 'start-quiz') {
      startQuiz(modId, lecId);
    } else if (action === 'download-lecture') {
      handleLectureDownload(modId, lecId, button);
    } else if (action === 'sync-lecture') {
      handleLectureDownload(modId, lecId, button);
    }
  });
}

/**
 * Update offline status indicators for lecture cards
 * @param {HTMLElement} container - Container with lecture cards
 * @param {string} studyId - Study ID
 */
async function updateLectureOfflineStatus(container, studyId) {
  if (!window.DownloadManager) return;

  const statusElements = container.querySelectorAll('.offline-status');

  for (const el of statusElements) {
    const moduleId = el.dataset.module;
    const lectureId = el.dataset.lecture;

    const status = await window.DownloadManager.getStatus(
      studyId,
      moduleId,
      lectureId
    );

    if (status === 'current') {
      el.innerHTML = `<span class="text-green-500 dark:text-green-400" title="Offline verfügbar">${Icons.get(
        'cloudCheck',
        'w-5 h-5'
      )}</span>`;
    } else if (status === 'outdated') {
      el.innerHTML = `<span class="text-amber-500 dark:text-amber-400" title="Update verfügbar">${Icons.get(
        'cloudDownload',
        'w-5 h-5'
      )}</span>`;
    } else {
      // not-downloaded - show gray cloud
      el.innerHTML = `<span class="text-gray-400 dark:text-gray-500" title="Nicht offline verfügbar">${Icons.get(
        'cloudOff',
        'w-5 h-5'
      )}</span>`;
    }
  }
}

/**
 * Auto-sync all lectures in a module in the background
 * Downloads lectures that haven't been cached yet
 * @param {string} studyId - Study ID
 * @param {string} moduleId - Module ID
 * @param {Array} lectureIds - Array of lecture IDs to sync
 * @param {HTMLElement} container - Container to update status after sync
 */
async function autoSyncModuleLectures(
  studyId,
  moduleId,
  lectureIds,
  container
) {
  if (!window.DownloadManager || !window.BundleLoader) return;

  console.log(
    `[Modules] Auto-syncing ${lectureIds.length} lectures for ${moduleId}`
  );

  let syncedCount = 0;

  for (const lectureId of lectureIds) {
    try {
      const status = await window.DownloadManager.getStatus(
        studyId,
        moduleId,
        lectureId
      );

      // Only download if not already cached
      if (status === 'not-downloaded' || status === 'outdated') {
        // Show loading spinner and track start time
        const spinnerStartTime = Date.now();
        const statusEl = container.querySelector(
          `.offline-status[data-module="${moduleId}"][data-lecture="${lectureId}"]`
        );
        if (statusEl) {
          statusEl.innerHTML = `<span class="text-blue-500 dark:text-blue-400 inline-block animate-spin" title="Wird synchronisiert...">${Icons.get(
            'spinner',
            'w-5 h-5'
          )}</span>`;
        }

        // Use BundleLoader which auto-saves to IndexedDB
        await window.BundleLoader.loadLectureFromBundle(
          studyId,
          moduleId,
          lectureId
        );
        syncedCount++;

        // Ensure spinner is visible for at least 1 second
        const elapsed = Date.now() - spinnerStartTime;
        const minDisplayTime = 1000; // 1 second minimum
        if (elapsed < minDisplayTime) {
          await new Promise((resolve) =>
            setTimeout(resolve, minDisplayTime - elapsed)
          );
        }

        // Update the status indicator to green check
        if (statusEl) {
          statusEl.innerHTML = `<span class="text-green-500 dark:text-green-400" title="Offline verfügbar">${Icons.get(
            'cloudCheck',
            'w-5 h-5'
          )}</span>`;
        }
      }
    } catch (e) {
      console.warn(`[Modules] Failed to sync lecture ${lectureId}:`, e);
      // Show error state - keep gray
      const statusEl = container.querySelector(
        `.offline-status[data-module="${moduleId}"][data-lecture="${lectureId}"]`
      );
      if (statusEl) {
        statusEl.innerHTML = `<span class="text-gray-400 dark:text-gray-500" title="Synchronisierung fehlgeschlagen">${Icons.get(
          'cloudOff',
          'w-5 h-5'
        )}</span>`;
      }
    }
  }

  if (syncedCount > 0) {
    console.log(
      `[Modules] Auto-synced ${syncedCount} lectures for ${moduleId}`
    );
  }
}

/**
 * Handle lecture download with progress UI
 * @param {string} moduleId - Module ID
 * @param {string} lectureId - Lecture ID
 * @param {HTMLElement} button - The button that was clicked
 */
async function handleLectureDownload(moduleId, lectureId, button) {
  if (!window.DownloadManager) {
    console.error('[Modules] DownloadManager not available');
    return;
  }

  const settings = window.getAppSettings ? window.getAppSettings() : {};
  const studyId = settings.activeStudyId || 'bsc-ernaehrungswissenschaften';

  // Disable button and show progress
  const originalText = button.textContent;
  button.disabled = true;
  button.classList.remove(
    'bg-yellow-500',
    'hover:bg-yellow-600',
    'bg-orange-500',
    'hover:bg-orange-600'
  );
  button.classList.add('bg-gray-400');

  try {
    const success = await window.DownloadManager.download(
      studyId,
      moduleId,
      lectureId,
      (progress, message) => {
        button.textContent = `${progress}%`;
      }
    );

    if (success) {
      // Update the button to show lecture is ready
      button.textContent = 'Vorlesung';
      button.classList.remove('bg-gray-400');
      button.classList.add('bg-blue-500', 'hover:bg-blue-600');
      button.dataset.action = 'start-lecture';
      button.disabled = false;
    } else {
      // Restore original state on failure
      button.textContent = originalText;
      button.classList.remove('bg-gray-400');
      button.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
      button.disabled = false;
      alert('Download fehlgeschlagen. Bitte versuche es erneut.');
    }
  } catch (e) {
    console.error('[Modules] Download error:', e);
    button.textContent = originalText;
    button.classList.remove('bg-gray-400');
    button.classList.add('bg-yellow-500', 'hover:bg-yellow-600');
    button.disabled = false;
  }
}

/**
 * Update download status indicators on lecture cards
 * Should be called after rendering lecture cards
 * @param {string} studyId - Study ID
 */
async function updateLectureDownloadStatus(studyId) {
  if (!window.DownloadManager) return;

  const actionContainers = document.querySelectorAll('.lecture-actions');

  for (const container of actionContainers) {
    const moduleId = container.dataset.module;
    const lectureId = container.dataset.lecture;

    const status = await window.DownloadManager.getStatus(
      studyId,
      moduleId,
      lectureId
    );
    const lectureBtn = container.querySelector('[data-action="start-lecture"]');

    if (!lectureBtn) continue;

    if (status === 'not-downloaded') {
      // Change to download button
      lectureBtn.textContent = '⬇️ Download';
      lectureBtn.dataset.action = 'download-lecture';
      lectureBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
      lectureBtn.classList.add('bg-yellow-500', 'hover:bg-yellow-600');

      // Get size info
      const info = await window.DownloadManager.getLectureInfo(
        studyId,
        moduleId,
        lectureId
      );
      if (info && info.sizeKB) {
        lectureBtn.title = `Größe: ~${info.sizeKB} KB`;
      }
    } else if (status === 'outdated') {
      // Change to sync button
      lectureBtn.textContent = '🔄 Sync';
      lectureBtn.dataset.action = 'sync-lecture';
      lectureBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
      lectureBtn.classList.add('bg-orange-500', 'hover:bg-orange-600');
      lectureBtn.title = 'Update verfügbar - klicken zum Synchronisieren';
    }
    // 'current' status keeps the default "Vorlesung" button
  }
}

// Expose functions to global scope
window.ModulesModule = {
  getModuleStats,
  loadModuleCards,
  createModuleCard,
  displayLecturesForModule,
  updateLectureDownloadStatus,
  handleLectureDownload
};
