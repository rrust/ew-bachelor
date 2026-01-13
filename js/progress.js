// js/progress.js

// Keys for localStorage
const GLOBAL_SETTINGS_KEY = 'appSettings';

/**
 * Gets the progress key for a specific study
 * @param {string} studyId - The study ID
 * @returns {string} The localStorage key for this study's progress
 */
function getProgressKey(studyId) {
  return `progress_${studyId}`;
}

/**
 * Gets global app settings (theme, active study, etc.)
 * @returns {object} App settings object
 */
function getAppSettings() {
  const settings = localStorage.getItem(GLOBAL_SETTINGS_KEY);
  return settings
    ? JSON.parse(settings)
    : {
        userName: null,
        activeStudyId: null,
        theme: 'light'
      };
}

/**
 * Saves global app settings
 * @param {object} settings - Settings object to save
 */
function saveAppSettings(settings) {
  localStorage.setItem(GLOBAL_SETTINGS_KEY, JSON.stringify(settings));
}

// Gets the initial structure for a new user's progress
function getInitialProgress(userName) {
  return {
    userName: userName,
    startedAt: new Date().toISOString(),
    modules: {}
  };
}

/**
 * Fetches the user's progress from localStorage
 * @param {string|null} studyId - Optional study ID (uses active study if not provided)
 * @returns {object|null} Progress object or null
 */
function getUserProgress(studyId = null) {
  const settings = getAppSettings();
  const activeStudy = studyId || settings.activeStudyId;

  // If no active study, try legacy key for backward compatibility
  if (!activeStudy) {
    const legacyProgress = localStorage.getItem('userProgress');
    return legacyProgress ? JSON.parse(legacyProgress) : null;
  }

  const key = getProgressKey(activeStudy);
  const progress = localStorage.getItem(key);
  return progress ? JSON.parse(progress) : null;
}

/**
 * Saves the user's progress to localStorage
 * @param {object} progressData - Progress object to save
 * @param {string|null} studyId - Optional study ID (uses active study if not provided)
 */
function saveUserProgress(progressData, studyId = null) {
  const settings = getAppSettings();
  const activeStudy = studyId || settings.activeStudyId;

  if (!activeStudy) {
    // Fallback to legacy key if no active study
    localStorage.setItem('userProgress', JSON.stringify(progressData));
    return;
  }

  const key = getProgressKey(activeStudy);
  localStorage.setItem(key, JSON.stringify(progressData));
}

/**
 * Resets all progress for a specific study
 * @param {string|null} studyId - Optional study ID (uses active study if not provided)
 */
function resetUserProgress(studyId = null) {
  const settings = getAppSettings();
  const activeStudy = studyId || settings.activeStudyId;

  if (!activeStudy) {
    localStorage.removeItem('userProgress');
    return;
  }

  const key = getProgressKey(activeStudy);
  localStorage.removeItem(key);
}

// Updates the progress for a specific lecture
function updateLectureProgress(moduleId, lectureId, score) {
  const progress = getUserProgress();
  if (!progress) return;

  // Ensure module and lecture objects exist
  if (!progress.modules[moduleId]) {
    progress.modules[moduleId] = {
      status: 'in-progress',
      lectures: {},
      achievements: {}
    };
  }
  if (!progress.modules[moduleId].lectures[lectureId]) {
    progress.modules[moduleId].lectures[lectureId] = {};
  }

  // Determine badge
  let badge = 'none';
  if (score >= 90) {
    badge = 'gold';
  } else if (score >= 70) {
    badge = 'silver';
  } else if (score >= 50) {
    badge = 'bronze';
  }

  progress.modules[moduleId].lectures[lectureId] = {
    score: score,
    badge: badge
  };

  saveUserProgress(progress);

  // Check for achievement unlocks after progress is saved
  if (typeof window.checkAchievementUnlocksForQuiz === 'function') {
    const unlockedAchievements = window.checkAchievementUnlocksForQuiz(
      moduleId,
      lectureId,
      badge
    );

    // Show notification for newly unlocked achievements
    if (unlockedAchievements.length > 0) {
      unlockedAchievements.forEach((achievement) => {
        console.log('🏆 Achievement unlocked:', achievement.title);
        // TODO: Show UI notification
      });
    }
  }
}

// Resets the progress for a specific lecture
function resetLectureProgress(moduleId, lectureId) {
  const progress = getUserProgress();
  if (!progress) return;

  if (progress.modules?.[moduleId]?.lectures?.[lectureId]) {
    delete progress.modules[moduleId].lectures[lectureId];
    saveUserProgress(progress);
  }
}

/**
 * Migrates legacy progress data to the new multi-study format
 * @param {string} defaultStudyId - The study ID to migrate legacy data to
 * @returns {boolean} True if migration occurred
 */
function migrateLegacyProgress(defaultStudyId) {
  const legacyKey = 'userProgress';
  const legacyProgress = localStorage.getItem(legacyKey);

  if (!legacyProgress) {
    return false;
  }

  try {
    const progressData = JSON.parse(legacyProgress);

    // Check if already migrated (has startedAt field)
    if (progressData.startedAt) {
      // Already in new format, just copy to new key
      const newKey = getProgressKey(defaultStudyId);
      if (!localStorage.getItem(newKey)) {
        localStorage.setItem(newKey, legacyProgress);
      }
    } else {
      // Old format, add metadata
      progressData.startedAt = new Date().toISOString();
      progressData.migratedAt = new Date().toISOString();
      const newKey = getProgressKey(defaultStudyId);
      localStorage.setItem(newKey, JSON.stringify(progressData));
    }

    // Update app settings
    const settings = getAppSettings();
    if (!settings.userName && progressData.userName) {
      settings.userName = progressData.userName;
    }
    if (!settings.activeStudyId) {
      settings.activeStudyId = defaultStudyId;
    }
    saveAppSettings(settings);

    // Don't delete legacy key yet - keep as backup
    return true;
  } catch (error) {
    console.error('Error migrating legacy progress:', error);
    return false;
  }
}

// Exports all progress data as a JSON file download
function exportProgress() {
  const settings = getAppSettings();
  const activeStudy = settings.activeStudyId;

  const progress = getUserProgress(activeStudy);
  if (!progress) {
    alert('Keine Fortschrittsdaten vorhanden.');
    return;
  }

  // Add export metadata
  const exportData = {
    exportedAt: new Date().toISOString(),
    version: '2.0',
    studyId: activeStudy,
    settings: {
      userName: settings.userName,
      theme: settings.theme
    },
    progress: progress
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  const studySuffix = activeStudy ? `-${activeStudy}` : '';
  link.download = `lernfortschritt${studySuffix}-${
    new Date().toISOString().split('T')[0]
  }.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Imports progress data from a JSON file
function importProgress(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = function (e) {
      try {
        const importData = JSON.parse(e.target.result);

        // Validate import data structure
        if (!importData.progress || !importData.progress.userName) {
          reject(new Error('Ungültiges Backup-Format'));
          return;
        }

        const currentProgress = getUserProgress();
        if (currentProgress) {
          // Determine study ID from import or use active study
          const settings = getAppSettings();
          const studyId =
            importData.studyId ||
            settings.activeStudyId ||
            'bsc-ernaehrungswissenschaften';

          const confirmed = confirm(
            `Aktueller Fortschritt wird überschrieben.\n\n` +
              `Studiengang: ${studyId}\n` +
              `Aktuell: ${currentProgress.userName}\n` +
              `Import: ${importData.progress.userName}\n\n` +
              `Fortfahren?`
          );
          if (!confirmed) {
            reject(new Error('Import abgebrochen'));
            return;
          }
        }

        // Determine study ID
        const settings = getAppSettings();
        const studyId =
          importData.studyId ||
          settings.activeStudyId ||
          'bsc-ernaehrungswissenschaften';

        // Save imported progress
        saveUserProgress(importData.progress, studyId);

        // Update settings if provided
        if (importData.settings) {
          const newSettings = getAppSettings();
          if (importData.settings.userName) {
            newSettings.userName = importData.settings.userName;
          }
          if (!newSettings.activeStudyId) {
            newSettings.activeStudyId = studyId;
          }
          saveAppSettings(newSettings);
        }

        resolve(importData.progress);
      } catch (err) {
        reject(new Error('Fehler beim Lesen der Datei: ' + err.message));
      }
    };

    reader.onerror = function () {
      reject(new Error('Fehler beim Lesen der Datei'));
    };

    reader.readAsText(file);
  });
}

// Expose functions to global scope
window.getAppSettings = getAppSettings;
window.saveAppSettings = saveAppSettings;
window.getProgressKey = getProgressKey;
window.getUserProgress = getUserProgress;
window.saveUserProgress = saveUserProgress;
window.resetUserProgress = resetUserProgress;
window.getInitialProgress = getInitialProgress;
window.updateLectureProgress = updateLectureProgress;
window.resetLectureProgress = resetLectureProgress;
window.migrateLegacyProgress = migrateLegacyProgress;
window.exportProgress = exportProgress;
window.importProgress = importProgress;
