// js/progress.js

const PROGRESS_KEY = 'userProgress';

// Gets the initial structure for a new user's progress
function getInitialProgress(userName) {
  return {
    userName: userName,
    modules: {}
  };
}

// Fetches the user's progress from localStorage
function getUserProgress() {
  const progress = localStorage.getItem(PROGRESS_KEY);
  return progress ? JSON.parse(progress) : null;
}

// Saves the user's progress to localStorage
function saveUserProgress(progressData) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progressData));
}

// Resets all progress
function resetUserProgress() {
  localStorage.removeItem(PROGRESS_KEY);
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
  console.log('Progress updated:', progress);

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
    console.log(`Progress for ${lectureId} in ${moduleId} reset.`);
  }
}

// Exports all progress data as a JSON file download
function exportProgress() {
  const progress = getUserProgress();
  if (!progress) {
    alert('Keine Fortschrittsdaten vorhanden.');
    return;
  }

  // Add export metadata
  const exportData = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    progress: progress
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `lernfortschritt-${
    new Date().toISOString().split('T')[0]
  }.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  console.log('Progress exported successfully');
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

        // Confirm with user before overwriting
        const currentProgress = getUserProgress();
        if (currentProgress) {
          const confirmed = confirm(
            `Aktueller Fortschritt wird überschrieben.\n\n` +
              `Aktuell: ${currentProgress.userName}\n` +
              `Import: ${importData.progress.userName}\n\n` +
              `Fortfahren?`
          );
          if (!confirmed) {
            reject(new Error('Import abgebrochen'));
            return;
          }
        }

        // Save imported progress
        saveUserProgress(importData.progress);
        console.log(
          'Progress imported successfully from',
          importData.exportedAt
        );
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
window.getUserProgress = getUserProgress;
window.saveUserProgress = saveUserProgress;
window.resetUserProgress = resetUserProgress;
window.getInitialProgress = getInitialProgress;
window.updateLectureProgress = updateLectureProgress;
window.resetLectureProgress = resetLectureProgress;
window.exportProgress = exportProgress;
window.importProgress = importProgress;
