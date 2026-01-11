// Modules module - Handles module cards and lecture lists

/**
 * Calculates estimated time for a module (sum of all lectures and quizzes)
 * @param {string} moduleId - Module ID
 * @param {Object} APP_CONTENT - Content object
 * @returns {number} Total estimated time in minutes
 */
function getModuleEstimatedTime(moduleId, APP_CONTENT) {
  const module = APP_CONTENT[moduleId];
  if (!module || !module.lectures) {
    return 0;
  }

  let totalTime = 0;
  for (const lectureId in module.lectures) {
    const lecture = module.lectures[lectureId];
    totalTime += lecture.estimatedTime || 0;
    totalTime += lecture.quizEstimatedTime || 0;
  }

  return totalTime;
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
 * @param {string} moduleId - Module ID
 * @param {Object} APP_CONTENT - Content object
 * @param {Function} getUserProgress - Function to get user progress
 * @returns {Object} Stats object with totalQuizzes, completedQuizzes, averageScore, badge
 */
function getModuleStats(moduleId, APP_CONTENT, getUserProgress) {
  const module = APP_CONTENT[moduleId];
  const progress = getUserProgress();

  if (!module || !module.lectures) {
    return {
      totalQuizzes: 0,
      completedQuizzes: 0,
      averageScore: 0,
      badge: 'none'
    };
  }

  let totalQuizzes = 0;
  let completedQuizzes = 0;
  let totalScore = 0;

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

    // Module icon + number on the left
    if (moduleNumber) {
      const moduleIcon = Icons.get(
        'modules',
        'w-4 h-4',
        'text-gray-500 dark:text-gray-400'
      );
      cardHTML += `<span class="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400">${moduleIcon}${moduleNumber}</span>`;
    } else {
      cardHTML += '<div></div>'; // Empty div for spacing
    }

    // Action buttons on the right
    cardHTML += '<div class="flex items-center space-x-2">';
    cardHTML += `<button class="view-lectures-btn text-sm px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition duration-200">Vorlesungen</button>`;

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
    } title="${examTooltip}">Prüfung</button>`;
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
function displayLecturesForModule(
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

  if (!module || !module.lectures) {
    alert('Für dieses Modul wurden keine Vorlesungen gefunden.');
    return;
  }

  // Update URL
  const moduleData = MODULES.find((m) => m.id === moduleId);
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

  for (const lectureId in module.lectures) {
    const lecture = module.lectures[lectureId];
    if (lecture.items.length === 0) continue; // Don't show empty lectures

    const lectureProgress =
      progress?.modules?.[moduleId]?.lectures?.[lectureId];

    const card = document.createElement('div');
    card.className =
      'bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col min-h-[280px] border border-gray-200 dark:border-gray-700';

    // Card Header with badge
    let contentHTML = `<div class="px-5 py-4 border-b dark:border-gray-700">`;
    contentHTML += `<div class="flex justify-between items-start mb-2">
              <h3 class="font-bold text-lg text-gray-900 dark:text-gray-100 flex-grow pr-2">${
                lecture.topic || lectureId.replace(/-/g, ' ')
              }</h3>`;

    // Add quiz badge in header if available
    if (lecture.quiz && lecture.quiz.length > 0) {
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
    const lectureItemCount = lecture.items ? lecture.items.length : 0;
    const quizQuestionCount = lecture.quiz ? lecture.quiz.length : 0;
    const lectureTime = lecture.estimatedTime || 0;
    const quizTime = lecture.quizEstimatedTime || 0;

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
      contentHTML += `</div>`;
    }
    contentHTML += `</div>`; // Close header

    // Card Content - Description
    contentHTML += `<div class="flex-grow px-5 py-4">`;
    if (lecture.description) {
      contentHTML += `<p class="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">${lecture.description}</p>`;
    }
    contentHTML += `</div>`;

    // Card Footer - Action buttons with lecture number
    // Extract lecture number from ID (e.g., "01-" from "01-grundlagen-zellbiologie")
    const lectureNumber = lectureId.match(/^(\d+)-/)?.[1] || '';

    contentHTML += `<div class="px-4 py-3 border-t dark:border-gray-700 rounded-b-lg flex items-center justify-between">`;

    // Lecture number on the left
    if (lectureNumber) {
      contentHTML += `<span class="text-xs font-semibold text-gray-500 dark:text-gray-400">${lectureNumber}</span>`;
    } else {
      contentHTML += '<div></div>'; // Empty div for spacing
    }

    // Action buttons on the right
    contentHTML += '<div class="flex items-center space-x-2">';
    contentHTML += `<button data-action="start-lecture" data-module="${moduleId}" data-lecture="${lectureId}" class="text-sm px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition duration-200">Vorlesung</button>`;
    contentHTML += `<button data-action="show-lecture-overview" data-module="${moduleId}" data-lecture="${lectureId}" class="text-sm px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded transition duration-200">Übersicht</button>`;

    if (lecture.quiz && lecture.quiz.length > 0) {
      contentHTML += `<button data-action="start-quiz" data-module="${moduleId}" data-lecture="${lectureId}" class="text-sm px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white font-medium rounded transition duration-200">Test</button>`;
    }

    contentHTML += '</div>'; // Close action buttons

    contentHTML += '</div>'; // Close footer

    card.innerHTML = contentHTML;
    lectureContentDiv.appendChild(card);
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
    }
  });
}

// Expose functions to global scope
window.ModulesModule = {
  getModuleStats,
  loadModuleCards,
  createModuleCard,
  displayLecturesForModule
};
