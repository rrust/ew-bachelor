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

  // Badge on the right
  cardHTML += '<div class="badge-container">';
  if (stats.totalQuizzes > 0 && moduleMeta.status !== 'gesperrt') {
    if (stats.badge === 'gold') {
      cardHTML += `<span class="text-2xl" title="Durchschnittliche Punktzahl: ${stats.averageScore.toFixed(
        0
      )}%">🥇</span>`;
    } else if (stats.badge === 'silver') {
      cardHTML += `<span class="text-2xl" title="Durchschnittliche Punktzahl: ${stats.averageScore.toFixed(
        0
      )}%">🥈</span>`;
    } else if (stats.badge === 'bronze') {
      cardHTML += `<span class="text-2xl" title="Durchschnittliche Punktzahl: ${stats.averageScore.toFixed(
        0
      )}%">🥉</span>`;
    } else if (stats.badge === 'incomplete') {
      cardHTML += `<span class="text-2xl" title="${stats.completedQuizzes} von ${stats.totalQuizzes} Quizzes absolviert">⚪</span>`;
    } else {
      cardHTML += `<span class="text-2xl text-gray-300" title="Noch keine Quizzes absolviert">⚪</span>`;
    }
  } else {
    cardHTML +=
      '<span class="text-2xl text-gray-300" title="Noch keine Quizzes absolviert">⚪</span>';
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
    cardHTML +=
      '<div class="card-footer px-4 py-3 border-t dark:border-gray-700 rounded-b-lg flex items-center justify-end space-x-2">';
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
  showLectureOverview
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
  document.getElementById('lecture-list-container').style.display = 'block';
  showView('lecture');

  const lectureContentDiv = document.getElementById('lecture-content');
  lectureContentDiv.innerHTML = ''; // Clear previous player UI

  const header = document.createElement('h2');
  header.className = 'text-2xl font-bold mb-4';
  header.textContent = `Vorlesungen für ${moduleData?.title || moduleId}`;
  lectureContentDiv.appendChild(header);

  const lectureList = document.createElement('ul');
  lectureList.className = 'space-y-4';
  for (const lectureId in module.lectures) {
    const lecture = module.lectures[lectureId];
    if (lecture.items.length === 0) continue; // Don't show empty lectures

    const lectureProgress =
      progress?.modules?.[moduleId]?.lectures?.[lectureId];

    const listItem = document.createElement('li');
    listItem.className =
      'p-4 bg-gray-50 dark:bg-gray-700 rounded-lg flex justify-between items-center';

    let contentHTML = `<div class="flex-grow">
              <h3 class="font-bold">${
                lecture.topic || lectureId.replace(/-/g, ' ')
              }</h3>`;

    // Add description if available
    if (lecture.description) {
      contentHTML += `<p class="text-sm text-gray-600 dark:text-gray-400 mt-1">${lecture.description}</p>`;
    }

    // Add estimated time if available
    const lectureTime = lecture.estimatedTime || 0;
    const quizTime = lecture.quizEstimatedTime || 0;
    const totalTime = lectureTime + quizTime;
    if (totalTime > 0) {
      const timeStr = formatEstimatedTime(totalTime);
      contentHTML += `<p class="text-xs text-gray-500 dark:text-gray-500 mt-1">⏱️ ${timeStr}`;
      if (lectureTime > 0 && quizTime > 0) {
        contentHTML += ` (Vorlesung: ${formatEstimatedTime(
          lectureTime
        )}, Quiz: ${formatEstimatedTime(quizTime)})`;
      }
      contentHTML += `</p>`;
    }

    contentHTML += `</div>`;

    contentHTML += '<div class="flex-shrink-0 flex items-center space-x-2">';
    contentHTML += `<button data-action="start-lecture" data-module="${moduleId}" data-lecture="${lectureId}" class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">Vorlesung</button>`;
    contentHTML += `<button data-action="show-lecture-overview" data-module="${moduleId}" data-lecture="${lectureId}" class="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm">Übersicht</button>`;

    if (lecture.quiz && lecture.quiz.length > 0) {
      contentHTML += `<button data-action="start-quiz" data-module="${moduleId}" data-lecture="${lectureId}" class="px-3 py-1 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm">Quiz</button>`;

      // Determine badge emoji
      let badgeEmoji = '';
      let tooltipText = '';

      if (lectureProgress?.badge === 'gold') {
        badgeEmoji = '🥇';
        tooltipText = `Erreichte Punktzahl: ${lectureProgress.score.toFixed(
          0
        )}%`;
      } else if (lectureProgress?.badge === 'silver') {
        badgeEmoji = '🥈';
        tooltipText = `Erreichte Punktzahl: ${lectureProgress.score.toFixed(
          0
        )}%`;
      } else if (lectureProgress?.badge === 'bronze') {
        badgeEmoji = '🥉';
        tooltipText = `Erreichte Punktzahl: ${lectureProgress.score.toFixed(
          0
        )}%`;
      } else {
        // No score yet - show placeholder
        badgeEmoji = '⚪';
        tooltipText = 'Quiz noch nicht absolviert';
      }

      // Add badge after quiz button with tooltip
      contentHTML += `<span class="text-2xl ${
        lectureProgress?.badge ? '' : 'text-gray-300'
      }" title="${tooltipText}">${badgeEmoji}</span>`;
    }
    contentHTML += '</div>';

    listItem.innerHTML = contentHTML;
    lectureList.appendChild(listItem);
  }
  lectureContentDiv.appendChild(lectureList);

  // Add event listeners for the new buttons
  lectureList.addEventListener('click', (e) => {
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
