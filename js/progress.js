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
    progress.modules[moduleId] = { status: 'in-progress', lectures: {} };
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

// Expose functions to global scope
window.getUserProgress = getUserProgress;
window.saveUserProgress = saveUserProgress;
window.resetUserProgress = resetUserProgress;
window.getInitialProgress = getInitialProgress;
window.updateLectureProgress = updateLectureProgress;
window.resetLectureProgress = resetLectureProgress;
