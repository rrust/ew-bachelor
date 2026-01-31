// js/achievements.js

/**
 * Check if a specific achievement's unlock condition is met
 * @param {string} achievementId The achievement ID to check
 * @returns {boolean} True if unlock conditions are met
 */
function checkAchievementUnlock(achievementId) {
  const achievement = APP_CONTENT.achievements[achievementId];
  if (!achievement) {
    console.error('Achievement not found:', achievementId);
    return false;
  }

  const condition = achievement.unlockCondition;
  const progress = getUserProgress();

  switch (condition.type) {
    case 'lecture-quiz-gold':
      return checkLectureQuizGold(condition, progress);
    case 'lecture-item-reached':
      return checkLectureItemReached(condition, progress);
    case 'module-exam-gold':
      return checkModuleExamGold(condition, progress);
    case 'multiple-lecture-gold':
      return checkMultipleLectureGold(condition, progress);
    case 'consecutive-lecture-gold':
      return checkConsecutiveLectureGold(condition, progress);
    case 'achievement-with-extensions':
      return checkAchievementWithExtensions(condition, progress);
    case 'first-exercise-solved':
      return checkFirstExerciseSolved(condition, progress);
    default:
      console.error('Unknown unlock condition type:', condition.type);
      return false;
  }
}

/**
 * Check if lecture quiz has gold badge
 */
function checkLectureQuizGold(condition, progress) {
  const moduleProgress = progress.modules[condition.moduleId];
  if (!moduleProgress) return false;

  const lectureProgress = moduleProgress.lectures[condition.lectureId];
  if (!lectureProgress) return false;

  return lectureProgress.badge === 'gold';
}

/**
 * Check if specific lecture item has been reached
 */
function checkLectureItemReached(condition, progress) {
  const moduleProgress = progress.modules[condition.moduleId];
  if (!moduleProgress) return false;

  const lectureProgress = moduleProgress.lectures[condition.lectureId];
  if (!lectureProgress) return false;

  // Check if currentItem is >= itemIndex
  return (lectureProgress.currentItem || 0) >= condition.itemIndex;
}

/**
 * Check if module exam has gold badge
 */
function checkModuleExamGold(condition, progress) {
  const moduleProgress = progress.modules[condition.moduleId];
  if (!moduleProgress) return false;

  return moduleProgress.examBadge === 'gold';
}

/**
 * Check if multiple specific lectures have gold badges
 */
function checkMultipleLectureGold(condition, progress) {
  const moduleProgress = progress.modules[condition.moduleId];
  if (!moduleProgress) return false;

  return condition.lectureIds.every((lectureId) => {
    const lectureProgress = moduleProgress.lectures[lectureId];
    return lectureProgress && lectureProgress.badge === 'gold';
  });
}

/**
 * Check if consecutive lectures have gold badges
 */
function checkConsecutiveLectureGold(condition, progress) {
  const moduleId = condition.moduleId;

  if (moduleId) {
    // Check within specific module
    const moduleProgress = progress.modules[moduleId];
    if (!moduleProgress) return false;

    const lectures = Object.keys(moduleProgress.lectures).sort();
    let consecutiveCount = 0;

    for (const lectureId of lectures) {
      if (moduleProgress.lectures[lectureId].badge === 'gold') {
        consecutiveCount++;
        if (consecutiveCount >= condition.count) return true;
      } else {
        consecutiveCount = 0;
      }
    }
    return false;
  } else {
    // Check across all modules
    let consecutiveCount = 0;
    const moduleIds = Object.keys(progress.modules).sort();

    for (const modId of moduleIds) {
      const lectures = Object.keys(progress.modules[modId].lectures).sort();
      for (const lectureId of lectures) {
        if (progress.modules[modId].lectures[lectureId].badge === 'gold') {
          consecutiveCount++;
          if (consecutiveCount >= condition.count) return true;
        } else {
          consecutiveCount = 0;
        }
      }
    }
    return false;
  }
}

/**
 * Check if achievement has been extended minimum number of times
 */
function checkAchievementWithExtensions(condition, progress) {
  // First check if base achievement is unlocked
  const baseAchievementProgress = getAchievementProgress(
    condition.achievementId
  );
  if (!baseAchievementProgress || baseAchievementProgress.status !== 'unlocked')
    return false;

  // Check extension count
  return (
    (baseAchievementProgress.extensionCount || 0) >= condition.minExtensions
  );
}

/**
 * Check if first exercise of a specific type has been solved
 * Used for Blueprint achievements
 */
function checkFirstExerciseSolved(condition, progress) {
  const { exerciseType, moduleId } = condition;

  // Check module training progress
  if (!progress.moduleTraining) return false;

  const moduleProgress = progress.moduleTraining[moduleId];
  if (!moduleProgress) return false;

  // Check for solved exercises
  const solvedExercises = moduleProgress.solvedExercises || [];

  // If exerciseType is specified, check for matching exercises
  // The exerciseType corresponds to the blueprintType in exercises.yaml
  if (exerciseType) {
    // For now, we just check if any exercise is solved
    // TODO: Could filter by blueprintType stored in the exercise ID
    return solvedExercises.length > 0;
  }

  // Any solved exercise counts if no specific type required
  return solvedExercises.length > 0;
}

/**
 * Get the current status of an achievement
 * @param {string} achievementId The achievement ID
 * @returns {string} Status: 'locked', 'unlocked', 'locked-soon', 'expired'
 */
function getAchievementStatus(achievementId) {
  const achievementProgress = getAchievementProgress(achievementId);
  if (!achievementProgress) return 'locked';

  const now = new Date();
  const expiresAt = new Date(achievementProgress.expiresAt);

  if (expiresAt < now) {
    return 'expired';
  }

  const daysRemaining = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));
  const achievement = APP_CONTENT.achievements[achievementId];
  const warningThreshold = achievement ? achievement.warningThreshold : 7;

  if (daysRemaining <= warningThreshold) {
    return 'locked-soon';
  }

  return achievementProgress.status || 'locked';
}

/**
 * Get achievement progress from user progress
 * @param {string} achievementId The achievement ID
 * @returns {object|null} Achievement progress object or null
 */
function getAchievementProgress(achievementId) {
  const progress = getUserProgress();
  const achievement = APP_CONTENT.achievements[achievementId];
  if (!achievement) return null;

  const moduleProgress = progress.modules[achievement.moduleId];
  if (!moduleProgress) return null;

  return moduleProgress.achievements?.[achievementId] || null;
}

/**
 * Unlock an achievement
 * @param {string} achievementId The achievement ID to unlock
 */
function unlockAchievement(achievementId) {
  const achievement = APP_CONTENT.achievements[achievementId];
  if (!achievement) {
    console.error('Achievement not found:', achievementId);
    return;
  }

  const progress = getUserProgress();
  const moduleId = achievement.moduleId;

  if (!progress.modules[moduleId]) {
    progress.modules[moduleId] = { lectures: {}, achievements: {} };
  }
  if (!progress.modules[moduleId].achievements) {
    progress.modules[moduleId].achievements = {};
  }

  const now = new Date();
  const expiresAt = new Date(
    now.getTime() + achievement.defaultDuration * 24 * 60 * 60 * 1000
  );

  progress.modules[moduleId].achievements[achievementId] = {
    status: 'unlocked',
    unlockedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    extensionCount: 0,
    lastExtensionAt: null
  };

  saveUserProgress(progress);
}

/**
 * Extend an achievement's expiration date
 * @param {string} achievementId The achievement ID to extend
 */
function extendAchievement(achievementId) {
  const achievement = APP_CONTENT.achievements[achievementId];
  if (!achievement) {
    console.error('Achievement not found:', achievementId);
    return;
  }

  const progress = getUserProgress();
  const moduleId = achievement.moduleId;
  const achievementProgress =
    progress.modules[moduleId]?.achievements?.[achievementId];

  if (!achievementProgress) {
    console.error('Achievement not unlocked:', achievementId);
    return;
  }

  const now = new Date();
  const newExpiresAt = new Date(
    now.getTime() + achievement.extensionDuration * 24 * 60 * 60 * 1000
  );

  achievementProgress.expiresAt = newExpiresAt.toISOString();
  achievementProgress.extensionCount =
    (achievementProgress.extensionCount || 0) + 1;
  achievementProgress.lastExtensionAt = now.toISOString();
  achievementProgress.status = 'unlocked';

  saveUserProgress(progress);
}

/**
 * Lock an achievement (after failed extension)
 * @param {string} achievementId The achievement ID to lock
 */
function lockAchievement(achievementId) {
  const achievement = APP_CONTENT.achievements[achievementId];
  if (!achievement) {
    console.error('Achievement not found:', achievementId);
    return;
  }

  const progress = getUserProgress();
  const moduleId = achievement.moduleId;

  if (progress.modules[moduleId]?.achievements?.[achievementId]) {
    delete progress.modules[moduleId].achievements[achievementId];
    saveUserProgress(progress);
  }
}

/**
 * Calculate expiration status for all achievements and update warnings
 */
function calculateExpirationStatus() {
  const progress = getUserProgress();
  const now = new Date();
  let hasChanges = false;

  for (const moduleId in progress.modules) {
    const achievements = progress.modules[moduleId].achievements;
    if (!achievements) continue;

    for (const achievementId in achievements) {
      const achievementProgress = achievements[achievementId];
      const expiresAt = new Date(achievementProgress.expiresAt);

      // Check if expired
      if (expiresAt < now && achievementProgress.status !== 'expired') {
        achievementProgress.status = 'expired';
        hasChanges = true;
      }
    }
  }

  if (hasChanges) {
    saveUserProgress(progress);
  }
}

/**
 * Check all achievements for potential unlocks after quiz completion
 * @param {string} moduleId The module ID
 * @param {string} lectureId The lecture ID
 * @param {string} badge The badge earned (gold/silver/bronze/none)
 */
function checkAchievementUnlocksForQuiz(moduleId, lectureId, badge) {
  if (badge !== 'gold') return [];

  const unlockedAchievements = [];

  // Check all achievements for this module
  for (const achievementId in APP_CONTENT.achievements) {
    const achievement = APP_CONTENT.achievements[achievementId];
    if (achievement.moduleId !== moduleId) continue;

    // Skip if already unlocked
    const achievementProgress = getAchievementProgress(achievementId);
    if (achievementProgress && achievementProgress.status === 'unlocked')
      continue;

    // Check if conditions are now met
    if (checkAchievementUnlock(achievementId)) {
      unlockAchievement(achievementId);
      unlockedAchievements.push(achievement);
    }
  }

  return unlockedAchievements;
}

/**
 * Get all achievements for a module
 * @param {string} moduleId The module ID
 * @returns {Array} Array of achievement objects
 */
function getModuleAchievements(moduleId) {
  const achievements = [];
  for (const achievementId in APP_CONTENT.achievements) {
    const achievement = APP_CONTENT.achievements[achievementId];
    if (achievement.moduleId === moduleId) {
      achievements.push({
        ...achievement,
        progress: getAchievementProgress(achievementId),
        currentStatus: getAchievementStatus(achievementId)
      });
    }
  }
  return achievements;
}

// Expose functions to global scope
window.checkAchievementUnlock = checkAchievementUnlock;
window.getAchievementStatus = getAchievementStatus;
window.getAchievementProgress = getAchievementProgress;
window.unlockAchievement = unlockAchievement;
window.extendAchievement = extendAchievement;
window.lockAchievement = lockAchievement;
window.calculateExpirationStatus = calculateExpirationStatus;
window.checkAchievementUnlocksForQuiz = checkAchievementUnlocksForQuiz;
window.getModuleAchievements = getModuleAchievements;
