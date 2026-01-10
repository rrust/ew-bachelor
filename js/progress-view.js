// Progress Dashboard View
// Shows overall achievements and progress statistics

/**
 * Renders the progress dashboard
 * @param {Array} modules - Array of module metadata
 * @param {Object} content - APP_CONTENT object
 */
function renderProgressDashboard(modules, content) {
  const progress = getUserProgress();

  if (!progress || !modules || modules.length === 0) {
    console.warn('No progress or modules data available');
    return;
  }

  // Calculate overall statistics
  const stats = calculateOverallStats(modules, content, progress);

  // Render stats cards
  document.getElementById('total-progress').textContent = `${Math.round(
    stats.overallProgress
  )}%`;
  document.getElementById(
    'modules-started'
  ).textContent = `${stats.modulesStarted} / ${stats.totalModules}`;
  document.getElementById(
    'quizzes-completed'
  ).textContent = `${stats.quizzesCompleted} / ${stats.totalQuizzes}`;
  document.getElementById('average-score').textContent = `${Math.round(
    stats.averageScore
  )}%`;

  // Render overall progress bar
  renderOverallProgressBar(stats.overallProgress);

  // Render module progress list
  renderModuleProgressList(modules, content, progress);
}

/**
 * Calculates overall progress statistics
 * @param {Array} modules - Module metadata
 * @param {Object} content - APP_CONTENT object
 * @param {Object} progress - User progress
 * @returns {Object} Statistics object
 */
function calculateOverallStats(modules, content, progress) {
  // Minimum assumed quizzes per module if no content exists yet
  const MIN_QUIZZES_PER_MODULE = 3;

  let totalQuizzes = 0;
  let quizzesCompleted = 0;
  let totalScore = 0;
  let scoredQuizzes = 0;
  let modulesStarted = 0;
  let modulesWithContent = 0;

  modules.forEach((module) => {
    const moduleContent = content[module.id];
    const moduleProgress = progress.modules?.[module.id];

    // Check if module has actual content
    if (
      moduleContent?.lectures &&
      Object.keys(moduleContent.lectures).length > 0
    ) {
      modulesWithContent++;

      // Count if module has been started
      if (
        moduleProgress &&
        Object.keys(moduleProgress.lectures || {}).length > 0
      ) {
        modulesStarted++;
      }

      // Count quizzes and scores from actual content
      Object.keys(moduleContent.lectures).forEach((lectureId) => {
        const lecture = moduleContent.lectures[lectureId];
        if (lecture.quiz && lecture.quiz.length > 0) {
          totalQuizzes++;

          const lectureData = moduleProgress?.lectures?.[lectureId];
          if (lectureData?.score !== undefined) {
            quizzesCompleted++;
            totalScore += lectureData.score;
            scoredQuizzes++;
          }
        }
      });
    } else {
      // Module has no content yet - assume minimum quizzes
      totalQuizzes += MIN_QUIZZES_PER_MODULE;
    }
  });

  const averageScore = scoredQuizzes > 0 ? totalScore / scoredQuizzes : 0;
  const overallProgress =
    totalQuizzes > 0 ? (quizzesCompleted / totalQuizzes) * 100 : 0;

  return {
    totalModules: modules.length,
    modulesStarted,
    modulesWithContent,
    totalQuizzes,
    quizzesCompleted,
    averageScore,
    overallProgress,
    goldBadges: 0,
    silverBadges: 0,
    bronzeBadges: 0
  };
}

/**
 * Renders the overall progress bar with milestone message
 * @param {number} progress - Progress percentage (0-100)
 */
function renderOverallProgressBar(progress) {
  const progressBar = document.getElementById('overall-progress-bar');
  const milestoneText = document.getElementById('progress-milestone');

  if (!progressBar || !milestoneText) return;

  // Animate the progress bar
  progressBar.style.width = `${Math.round(progress)}%`;

  // Set milestone message based on progress
  let message = '';
  let emoji = '';

  if (progress >= 100) {
    emoji = '🎓';
    message = 'Geschafft! Alle Quizze abgeschlossen!';
  } else if (progress >= 75) {
    emoji = '🔥';
    message = 'Auf der Zielgeraden!';
  } else if (progress >= 50) {
    emoji = '💪';
    message = 'Halbzeit erreicht!';
  } else if (progress >= 25) {
    emoji = '🚀';
    message = 'Gut gestartet!';
  } else if (progress > 0) {
    emoji = '📚';
    message = "Los geht's!";
  } else {
    emoji = '👋';
    message = 'Starte dein erstes Quiz!';
  }

  milestoneText.textContent = `${emoji} ${message}`;
}

/**
 * Renders detailed module progress list
 * @param {Array} modules - Module metadata
 * @param {Object} content - APP_CONTENT object
 * @param {Object} progress - User progress
 */
function renderModuleProgressList(modules, content, progress) {
  const container = document.getElementById('module-progress-list');
  const MIN_QUIZZES_PER_MODULE = 3;

  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  container.innerHTML = sortedModules
    .map((module) => {
      const moduleContent = content[module.id];
      const moduleProgress = progress.modules?.[module.id];
      const hasContent =
        moduleContent?.lectures &&
        Object.keys(moduleContent.lectures).length > 0;

      // Calculate module stats
      let totalLectures = 0;
      let completedLectures = 0;
      let totalScore = 0;
      let scoredCount = 0;

      if (hasContent) {
        Object.keys(moduleContent.lectures).forEach((lectureId) => {
          const lecture = moduleContent.lectures[lectureId];
          if (lecture.quiz && lecture.quiz.length > 0) {
            totalLectures++;

            const lectureData = moduleProgress?.lectures?.[lectureId];
            if (lectureData?.score !== undefined) {
              completedLectures++;
              totalScore += lectureData.score;
              scoredCount++;
            }
          }
        });
      } else {
        // No content yet - show placeholder
        totalLectures = MIN_QUIZZES_PER_MODULE;
      }

      const moduleAverage = scoredCount > 0 ? totalScore / scoredCount : 0;
      const completionPercent =
        totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;
      const badgeInfo = window.getBadgeInfo
        ? window.getBadgeInfo(moduleAverage)
        : { html: '☆' };
      const badge = hasContent
        ? badgeInfo.html
        : '<span style="color: #9CA3AF;">⏳</span>';

      return `
      <div class="border dark:border-gray-700 rounded-lg p-3 md:p-4 ${
        !hasContent ? 'opacity-60' : ''
      }">
        <div class="flex items-center justify-between mb-2 md:mb-3">
          <div class="flex items-center space-x-3 md:space-x-4 min-w-0">
            <!-- Circular Progress Ring -->
            <div class="relative w-12 h-12 md:w-16 md:h-16 flex-shrink-0">
              <svg class="w-12 h-12 md:w-16 md:h-16 transform -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18" cy="18" r="16"
                  fill="none"
                  class="stroke-current text-gray-200 dark:text-gray-700"
                  stroke-width="3"
                ></circle>
                <circle
                  cx="18" cy="18" r="16"
                  fill="none"
                  class="stroke-current ${
                    hasContent
                      ? 'text-blue-500 dark:text-blue-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }"
                  stroke-width="3"
                  stroke-linecap="round"
                  stroke-dasharray="${completionPercent}, 100"
                ></circle>
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <span class="text-base md:text-lg">${badge}</span>
              </div>
            </div>
            <div class="min-w-0">
              <div class="font-bold text-base md:text-lg truncate">${
                module.title
              }</div>
              <div class="text-xs md:text-sm text-gray-600 dark:text-gray-400">${
                module.ects
              } ECTS • ${
        hasContent
          ? `${completedLectures}/${totalLectures} Tests`
          : 'Inhalt folgt'
      }</div>
            </div>
          </div>
          <div class="text-right flex-shrink-0 ml-2">
            ${
              hasContent
                ? `
            <div class="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${Math.round(moduleAverage)}%
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">
              Durchschnitt
            </div>
            `
                : `
            <div class="text-xs md:text-sm text-gray-400 dark:text-gray-500 italic">
              Bald verfügbar
            </div>
            `
            }
          </div>
        </div>
        
        ${
          !hasContent
            ? `
          <div class="text-xs md:text-sm text-gray-400 dark:text-gray-500 italic">
            ⏳ Inhalte werden noch erstellt
          </div>
        `
            : completedLectures === 0
            ? `
          <div class="text-xs md:text-sm text-gray-500 dark:text-gray-400 italic">
            Noch nicht begonnen
          </div>
        `
            : completedLectures === totalLectures
            ? `
          <div class="text-xs md:text-sm text-green-600 dark:text-green-400 font-bold">
            ✓ Modul abgeschlossen
          </div>
        `
            : `
          <div class="text-xs md:text-sm text-blue-600 dark:text-blue-400">
            In Bearbeitung
          </div>
        `
        }
      </div>
    `;
    })
    .join('');
}

/**
 * Handles file import from input element
 * @param {HTMLInputElement} input - The file input element
 */
function handleProgressImport(input) {
  const file = input.files?.[0];
  if (!file) return;

  importProgress(file)
    .then(() => {
      alert('Fortschritt erfolgreich wiederhergestellt!');
      // Reload the page to show updated progress
      window.location.reload();
    })
    .catch((err) => {
      alert(err.message);
    })
    .finally(() => {
      // Reset input so the same file can be selected again
      input.value = '';
    });
}

// Expose to global scope
window.handleProgressImport = handleProgressImport;
