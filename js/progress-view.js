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

  // Render achievements
  renderAchievements(stats);

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
  let totalQuizzes = 0;
  let quizzesCompleted = 0;
  let totalScore = 0;
  let scoredQuizzes = 0;
  let modulesStarted = 0;

  modules.forEach((module) => {
    const moduleContent = content[module.id];
    const moduleProgress = progress.modules?.[module.id];

    if (!moduleContent?.lectures) return;

    // Count if module has been started
    if (
      moduleProgress &&
      Object.keys(moduleProgress.lectures || {}).length > 0
    ) {
      modulesStarted++;
    }

    // Count quizzes and scores
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
  });

  const averageScore = scoredQuizzes > 0 ? totalScore / scoredQuizzes : 0;
  const overallProgress =
    totalQuizzes > 0 ? (quizzesCompleted / totalQuizzes) * 100 : 0;

  return {
    totalModules: modules.length,
    modulesStarted,
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
 * Renders achievement badges
 * @param {Object} stats - Statistics object
 */
function renderAchievements(stats) {
  const container = document.getElementById('achievements-grid');

  const achievements = [
    {
      icon: '🎓',
      title: 'Erster Schritt',
      description: 'Erstes Quiz abgeschlossen',
      unlocked: stats.quizzesCompleted >= 1,
      progress: Math.min(stats.quizzesCompleted, 1)
    },
    {
      icon: '📚',
      title: 'Fleißig',
      description: '5 Quizze abgeschlossen',
      unlocked: stats.quizzesCompleted >= 5,
      progress: Math.min(stats.quizzesCompleted / 5, 1)
    },
    {
      icon: '🌟',
      title: 'Experte',
      description: '10 Quizze abgeschlossen',
      unlocked: stats.quizzesCompleted >= 10,
      progress: Math.min(stats.quizzesCompleted / 10, 1)
    },
    {
      icon: '🥇',
      title: 'Perfektionist',
      description: 'Durchschnitt ≥ 90%',
      unlocked: stats.averageScore >= 90,
      progress: stats.averageScore / 90
    },
    {
      icon: '🚀',
      title: 'Schnellstarter',
      description: '3 Module begonnen',
      unlocked: stats.modulesStarted >= 3,
      progress: Math.min(stats.modulesStarted / 3, 1)
    },
    {
      icon: '💯',
      title: 'Vollständig',
      description: 'Alle Quizze bestanden',
      unlocked:
        stats.totalQuizzes > 0 && stats.quizzesCompleted === stats.totalQuizzes,
      progress:
        stats.totalQuizzes > 0 ? stats.quizzesCompleted / stats.totalQuizzes : 0
    },
    {
      icon: '🎯',
      title: 'Zielstrebig',
      description: '5 Module begonnen',
      unlocked: stats.modulesStarted >= 5,
      progress: Math.min(stats.modulesStarted / 5, 1)
    },
    {
      icon: '⭐',
      title: 'Stern-Sammler',
      description: 'Durchschnitt ≥ 80%',
      unlocked: stats.averageScore >= 80,
      progress: stats.averageScore / 80
    }
  ];

  container.innerHTML = achievements
    .map((achievement) => {
      const unlocked = achievement.unlocked;
      const progressPercent = Math.min(achievement.progress * 100, 100);

      return `
      <div class="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 text-center ${
        unlocked ? '' : 'opacity-50'
      }">
        <div class="text-4xl mb-2 ${unlocked ? '' : 'grayscale'}">${
        achievement.icon
      }</div>
        <div class="font-bold text-sm mb-1">${achievement.title}</div>
        <div class="text-xs text-gray-600 dark:text-gray-400 mb-2">${
          achievement.description
        }</div>
        ${
          !unlocked
            ? `
          <div class="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-1.5">
            <div class="bg-blue-600 h-1.5 rounded-full" style="width: ${progressPercent}%"></div>
          </div>
        `
            : `
          <div class="text-green-600 dark:text-green-400 text-xs font-bold">✓ Erreicht</div>
        `
        }
      </div>
    `;
    })
    .join('');
}

/**
 * Renders detailed module progress list
 * @param {Array} modules - Module metadata
 * @param {Object} content - APP_CONTENT object
 * @param {Object} progress - User progress
 */
function renderModuleProgressList(modules, content, progress) {
  const container = document.getElementById('module-progress-list');

  const sortedModules = [...modules].sort((a, b) => a.order - b.order);

  container.innerHTML = sortedModules
    .map((module) => {
      const moduleContent = content[module.id];
      const moduleProgress = progress.modules?.[module.id];

      if (!moduleContent?.lectures) {
        return '';
      }

      // Calculate module stats
      let totalLectures = 0;
      let completedLectures = 0;
      let totalScore = 0;
      let scoredCount = 0;

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

      const moduleAverage = scoredCount > 0 ? totalScore / scoredCount : 0;
      const completionPercent =
        totalLectures > 0 ? (completedLectures / totalLectures) * 100 : 0;
      const badge =
        moduleAverage >= 90
          ? '🥇'
          : moduleAverage >= 70
          ? '🥈'
          : moduleAverage >= 50
          ? '🥉'
          : '⚪';

      return `
      <div class="border dark:border-gray-700 rounded-lg p-4">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <span class="text-2xl">${badge}</span>
            <div>
              <div class="font-bold text-lg">${module.title}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400">${
                module.ects
              } ECTS</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
              ${Math.round(moduleAverage)}%
            </div>
            <div class="text-xs text-gray-600 dark:text-gray-400">
              ${completedLectures} / ${totalLectures} Quizze
            </div>
          </div>
        </div>
        
        <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div class="bg-blue-600 dark:bg-blue-500 h-2.5 rounded-full transition-all duration-300" 
               style="width: ${completionPercent}%"></div>
        </div>
        
        ${
          completedLectures === 0
            ? `
          <div class="mt-3 text-sm text-gray-500 dark:text-gray-400 italic">
            Noch nicht begonnen
          </div>
        `
            : completedLectures === totalLectures
            ? `
          <div class="mt-3 text-sm text-green-600 dark:text-green-400 font-bold">
            ✓ Modul abgeschlossen
          </div>
        `
            : `
          <div class="mt-3 text-sm text-blue-600 dark:text-blue-400">
            In Bearbeitung
          </div>
        `
        }
      </div>
    `;
    })
    .join('');
}
