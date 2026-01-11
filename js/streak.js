// js/streak.js
// Daily streak system for continuous learning engagement

const STREAK_MAX = 10;
const STREAK_RESCUE_REQUIRED = 2; // Correct answers needed to rescue
const STREAK_RESCUE_TOTAL = 3; // Total questions in rescue mode

/**
 * Get streak data from progress
 * @returns {Object} Streak data
 */
function getStreakData() {
  const progress = window.getUserProgress ? window.getUserProgress() : null;
  if (!progress) {
    return createDefaultStreak();
  }

  if (!progress.streak) {
    progress.streak = createDefaultStreak();
    if (window.saveUserProgress) {
      window.saveUserProgress(progress);
    }
  }

  return progress.streak;
}

/**
 * Create default streak object
 */
function createDefaultStreak() {
  return {
    current: 0,
    lastActivityDate: null,
    totalDays: 0,
    longestStreak: 0,
    rescueMode: false,
    rescueCorrect: 0,
    rescueTotal: 0
  };
}

/**
 * Save streak data to progress
 */
function saveStreakData(streakData) {
  const progress = window.getUserProgress ? window.getUserProgress() : null;
  if (!progress) return;

  progress.streak = streakData;
  if (window.saveUserProgress) {
    window.saveUserProgress(progress);
  }
}

/**
 * Check if user has any completed tests (streak prerequisite)
 * A test is considered completed if it has a badge (bronze, silver, gold)
 */
function hasCompletedTests() {
  const progress = window.getUserProgress ? window.getUserProgress() : null;
  if (!progress || !progress.modules) return false;

  for (const moduleId in progress.modules) {
    const module = progress.modules[moduleId];
    if (module.lectures) {
      for (const lectureId in module.lectures) {
        const lecture = module.lectures[lectureId];
        // A badge means the test was completed successfully
        if (lecture.badge) {
          return true;
        }
      }
    }
  }
  return false;
}

/**
 * Get a random question from completed tests
 * @returns {Object|null} { question, moduleId, lectureId } or null
 */
function getRandomStreakQuestion() {
  const progress = window.getUserProgress ? window.getUserProgress() : null;
  const appContent = window.APP_CONTENT;
  if (!progress || !appContent) return null;

  const completedQuizzes = [];

  // Find all completed quizzes (badge means completed)
  for (const moduleId in progress.modules) {
    const module = progress.modules[moduleId];
    if (module.lectures) {
      for (const lectureId in module.lectures) {
        const lecture = module.lectures[lectureId];
        if (lecture.badge) {
          // Get quiz from APP_CONTENT
          const moduleContent = appContent[moduleId];
          const lectureContent = moduleContent?.lectures?.[lectureId];
          if (lectureContent?.quiz && Array.isArray(lectureContent.quiz)) {
            completedQuizzes.push({
              moduleId,
              lectureId,
              questions: lectureContent.quiz
            });
          }
        }
      }
    }
  }

  if (completedQuizzes.length === 0) return null;

  // Pick random quiz and question
  const randomQuiz =
    completedQuizzes[Math.floor(Math.random() * completedQuizzes.length)];
  const randomQuestion =
    randomQuiz.questions[
      Math.floor(Math.random() * randomQuiz.questions.length)
    ];

  return {
    question: randomQuestion,
    moduleId: randomQuiz.moduleId,
    lectureId: randomQuiz.lectureId
  };
}

/**
 * Get multiple random questions for rescue mode
 * @returns {Array} Array of question objects
 */
function getStreakRescueQuestions() {
  const questions = [];
  const usedIndices = new Set();

  for (let i = 0; i < STREAK_RESCUE_TOTAL; i++) {
    let attempt = 0;
    let q = null;

    // Try to get unique questions
    while (attempt < 10) {
      q = getRandomStreakQuestion();
      if (q) {
        const key = `${q.moduleId}-${q.lectureId}-${q.question.question}`;
        if (!usedIndices.has(key)) {
          usedIndices.add(key);
          break;
        }
      }
      attempt++;
    }

    if (q) {
      questions.push(q);
    }
  }

  return questions;
}

/**
 * Calculate streak status based on current date
 * @returns {Object} { status: 'active'|'pending'|'at-risk'|'lost'|'unavailable', daysGap: number }
 */
function calculateStreakStatus() {
  if (!hasCompletedTests()) {
    return { status: 'unavailable', daysGap: 0 };
  }

  const streak = getStreakData();
  const today = new Date().toDateString();

  if (!streak.lastActivityDate) {
    return { status: 'pending', daysGap: 0 };
  }

  const lastDate = new Date(streak.lastActivityDate);
  const todayDate = new Date(today);
  const diffTime = todayDate - lastDate;
  const daysGap = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (daysGap === 0) {
    // Already did today's streak
    return { status: 'active', daysGap: 0 };
  } else if (daysGap === 1) {
    // Yesterday - streak pending for today
    return { status: 'pending', daysGap: 1 };
  } else if (daysGap <= 3 && streak.current > 0) {
    // 2-3 days gap - at risk, can rescue
    return { status: 'at-risk', daysGap };
  } else {
    // More than 3 days or no streak - lost
    return { status: 'lost', daysGap };
  }
}

/**
 * Process streak on app start - apply penalties for missed days
 */
function processStreakOnStart() {
  if (!hasCompletedTests()) return;

  const streak = getStreakData();
  const status = calculateStreakStatus();

  if (status.status === 'lost' && streak.current > 0) {
    // Reset streak
    streak.current = 0;
    streak.rescueMode = false;
    streak.rescueCorrect = 0;
    streak.rescueTotal = 0;
    saveStreakData(streak);
  } else if (status.status === 'at-risk' && !streak.rescueMode) {
    // Enter rescue mode
    streak.rescueMode = true;
    streak.rescueCorrect = 0;
    streak.rescueTotal = 0;
    // Deduct points for missed days (but keep at least 0)
    streak.current = Math.max(0, streak.current - (status.daysGap - 1));
    saveStreakData(streak);
  }
}

/**
 * Complete daily streak challenge
 * @param {boolean} correct - Was the answer correct?
 */
function completeStreakChallenge(correct) {
  const streak = getStreakData();
  const today = new Date().toDateString();

  if (correct) {
    // Increment streak (max 10)
    streak.current = Math.min(STREAK_MAX, streak.current + 1);
    streak.lastActivityDate = today;
    streak.totalDays++;

    // Update longest streak
    if (streak.current > streak.longestStreak) {
      streak.longestStreak = streak.current;
    }

    // Exit rescue mode if in it
    streak.rescueMode = false;
    streak.rescueCorrect = 0;
    streak.rescueTotal = 0;

    saveStreakData(streak);
    return { success: true, newStreak: streak.current };
  } else {
    // Wrong answer - don't update anything for regular challenge
    return { success: false, newStreak: streak.current };
  }
}

/**
 * Process rescue mode answer
 * @param {boolean} correct - Was the answer correct?
 * @returns {Object} { rescued: boolean|null, correctCount: number, totalAnswered: number }
 */
function processRescueAnswer(correct) {
  const streak = getStreakData();

  streak.rescueTotal++;
  if (correct) {
    streak.rescueCorrect++;
  }

  // Check if rescue complete
  if (streak.rescueTotal >= STREAK_RESCUE_TOTAL) {
    const rescued = streak.rescueCorrect >= STREAK_RESCUE_REQUIRED;

    if (rescued) {
      // Rescued! Keep current streak and update date
      streak.lastActivityDate = new Date().toDateString();
      streak.rescueMode = false;
      streak.rescueCorrect = 0;
      streak.rescueTotal = 0;
      saveStreakData(streak);
      return {
        rescued: true,
        correctCount: streak.rescueCorrect,
        totalAnswered: STREAK_RESCUE_TOTAL
      };
    } else {
      // Failed - reset streak
      streak.current = 0;
      streak.rescueMode = false;
      streak.rescueCorrect = 0;
      streak.rescueTotal = 0;
      saveStreakData(streak);
      return {
        rescued: false,
        correctCount: streak.rescueCorrect,
        totalAnswered: STREAK_RESCUE_TOTAL
      };
    }
  }

  saveStreakData(streak);
  return {
    rescued: null, // Not yet determined
    correctCount: streak.rescueCorrect,
    totalAnswered: streak.rescueTotal
  };
}

/**
 * Check if streak condition is met for an achievement
 * @param {number} requiredStreak - Required streak level
 * @returns {boolean}
 */
function isStreakConditionMet(requiredStreak) {
  const streak = getStreakData();
  return streak.current >= requiredStreak;
}

/**
 * Get streak display info
 * @returns {Object} { current, max, status, statusText, icon }
 */
function getStreakDisplayInfo() {
  const streak = getStreakData();
  const status = calculateStreakStatus();

  let statusText = '';
  let icon = 'fire';
  let color = 'text-orange-500';

  switch (status.status) {
    case 'unavailable':
      statusText = 'Schließe erst einen Test ab';
      color = 'text-gray-400';
      break;
    case 'active':
      statusText = 'Heute erledigt! ✓';
      color = 'text-green-500';
      break;
    case 'pending':
      statusText = 'Tägliche Challenge wartet';
      color = 'text-orange-500';
      break;
    case 'at-risk':
      statusText = `Streak in Gefahr! (${status.daysGap} Tage verpasst)`;
      color = 'text-red-500';
      break;
    case 'lost':
      statusText = 'Streak verloren';
      color = 'text-gray-400';
      break;
  }

  return {
    current: streak.current,
    max: STREAK_MAX,
    longestStreak: streak.longestStreak,
    totalDays: streak.totalDays,
    status: status.status,
    statusText,
    icon,
    color,
    rescueMode: streak.rescueMode,
    rescueCorrect: streak.rescueCorrect,
    rescueTotal: streak.rescueTotal
  };
}

/**
 * Initialize streak system
 */
function initStreak() {
  processStreakOnStart();
}

// Expose to global scope
window.getStreakData = getStreakData;
window.getStreakDisplayInfo = getStreakDisplayInfo;
window.calculateStreakStatus = calculateStreakStatus;
window.hasCompletedTests = hasCompletedTests;
window.getRandomStreakQuestion = getRandomStreakQuestion;
window.getStreakRescueQuestions = getStreakRescueQuestions;
window.completeStreakChallenge = completeStreakChallenge;
window.processRescueAnswer = processRescueAnswer;
window.isStreakConditionMet = isStreakConditionMet;
window.initStreak = initStreak;
window.STREAK_MAX = STREAK_MAX;
window.STREAK_RESCUE_REQUIRED = STREAK_RESCUE_REQUIRED;
window.STREAK_RESCUE_TOTAL = STREAK_RESCUE_TOTAL;
